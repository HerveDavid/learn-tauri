import { create } from 'zustand';
import { WebviewWindow } from '@tauri-apps/api/webviewWindow';
import { AddPanelOptions, DockviewApi, SerializedDockview } from 'dockview';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { paths } from '@/config/paths';
import { LiveManagedRuntime } from '@/services/live-layer';
import { useEffect, useState, useRef } from 'react';
import { SettingsClient } from '@/services/common/settings-client';
import { Effect } from 'effect';

const KEY_DASHBOARD_SETTING = 'dashboard-layout';

interface DashboardStore {
  api: DockviewApi | null;
  runtime: LiveManagedRuntime | null;
  savedLayout: SerializedDockview | null;
  isLayoutLoaded: boolean;
  isInitialized: boolean;
  setApi: (api: DockviewApi) => void;
  setRuntime: (runtime: LiveManagedRuntime) => void;
  setSavedLayout: (layout: SerializedDockview | null) => void;
  setIsLayoutLoaded: (loaded: boolean) => void;
  setIsInitialized: (initialized: boolean) => void;
  addPanel: (panel: AddPanelOptions) => void;
  detachPanel: (id: string) => void;
  removePanel: (id: string) => void;
  loadLayout: () => Promise<void>;
  restoreLayout: () => void;
  initialize: (runtime: LiveManagedRuntime) => Promise<void>;
}

export const useDashboardStore = (runtime: LiveManagedRuntime) => {
  const store = dashboardStore();
  const initializeRef = useRef(false);
  const [isRuntimeReady, setIsRuntimeReady] = useState(false);

  useEffect(() => {
    if (runtime && !isRuntimeReady) {
      console.log('Runtime detected, checking readiness...');
      
      const timer = setTimeout(() => {
        setIsRuntimeReady(true);
        console.log('Runtime marked as ready');
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [runtime, isRuntimeReady]);

  useEffect(() => {
    if (!initializeRef.current && runtime && isRuntimeReady) {
      initializeRef.current = true;
      console.log('Initializing dashboard store with ready runtime');
      store.initialize(runtime);
    }
  }, [runtime, isRuntimeReady]);

  return store;
};

const dashboardStore = create<DashboardStore>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      api: null,
      runtime: null,
      savedLayout: null,
      isLayoutLoaded: false,
      isInitialized: false,

      initialize: async (runtime: LiveManagedRuntime) => {
        console.log('Dashboard store initialization started');
        const { isInitialized } = get();
        
        if (isInitialized) {
          console.log('Store already initialized, skipping');
          return;
        }

        set({ runtime, isInitialized: true });
        
        try {
          await get().loadLayout();
          console.log('Dashboard store initialization completed');
        } catch (error) {
          console.error('Failed to initialize dashboard store:', error);
        }
      },

      setApi: (api) => {
        console.log('Setting API in dashboard store');
        set({ api });
        
        const { savedLayout, isLayoutLoaded, runtime } = get();
        if (savedLayout && isLayoutLoaded && api && runtime) {
          console.log('API set, restoring layout');
          
          setTimeout(() => {
            try {
              console.log('Attempting to restore layout with data:', {
                panelsCount: savedLayout.panels?.length || 0,
              });
              
              api.fromJSON(savedLayout);
              console.log('Layout restored after API set');
              
              setTimeout(() => {
                const currentPanels = api.panels.length;
                console.log(`Layout restoration verification - panels count: ${currentPanels}`);
              }, 100);
              
            } catch (error) {
              console.warn('Failed to restore dashboard layout after API set:', error);
              console.warn('Saved layout data:', savedLayout);
            }
          }, 200);
        } else {
          console.log('Layout restoration skipped:', {
            hasSavedLayout: !!savedLayout,
            isLayoutLoaded,
            hasApi: !!api,
            hasRuntime: !!runtime
          });
        }
      },

      setRuntime: (runtime) => {
        console.log('Runtime updated in store');
        set({ runtime });
      },

      setSavedLayout: (layout) => set({ savedLayout: layout }),

      setIsLayoutLoaded: (loaded) => set({ isLayoutLoaded: loaded }),

      setIsInitialized: (initialized) => set({ isInitialized: initialized }),

      loadLayout: async () => {
        const { runtime, isLayoutLoaded } = get();
        
        if (!runtime) {
          console.warn('Runtime not available for loading layout');
          return;
        }

        if (isLayoutLoaded) {
          console.log('Layout already loaded, skipping');
          return;
        }

        try {
          console.log('Loading layout from settings...');
          
          await new Promise(resolve => setTimeout(resolve, 50));
          
          const loadEffect = Effect.gen(function* () {
            const settingsClient = yield* SettingsClient;
            return yield* settingsClient.getSetting<SerializedDockview>(
              KEY_DASHBOARD_SETTING,
            );
          });

          const layout = await runtime.runPromise(loadEffect);
          
          if (layout && Object.keys(layout).length > 0) {
            console.log('Layout loaded successfully with data:', {
              panelsCount: layout.panels?.length || 0,
              hasActiveGroup: !!layout.activeGroup
            });
            
            set({ savedLayout: layout, isLayoutLoaded: true });

            const { api } = get();
            if (api) {
              console.log('API available, restoring layout immediately');
              try {
                api.fromJSON(layout);
                console.log('Layout restored immediately');
                
                setTimeout(() => {
                  console.log(`Immediate restoration verification - panels: ${api.panels.length}`);
                }, 100);
              } catch (error) {
                console.warn('Failed to restore dashboard layout immediately:', error);
              }
            }
          } else {
            console.log('No valid saved layout found');
            set({ isLayoutLoaded: true });
          }
        } catch (error) {
          console.info('No saved dashboard layout found or failed to load:', error);
          set({ isLayoutLoaded: true });
        }
      },

      restoreLayout: () => {
        const { api, savedLayout } = get();
        console.log('Manual restore layout called', {
          hasApi: !!api,
          hasLayout: !!savedLayout,
        });
        if (api && savedLayout) {
          try {
            api.fromJSON(savedLayout);
            console.log('Manual layout restoration successful');
          } catch (error) {
            console.warn('Failed to restore dashboard layout manually:', error);
          }
        }
      },

      addPanel: (panel) => {
        const { api } = get();
        if (!api) {
          console.warn('API not available for adding panel');
          return;
        }
        api.addPanel(panel);
      },

      removePanel: (id) => {
        const { api } = get();
        if (!api) {
          console.warn('API not available for removing panel');
          return;
        }
        const panel = api.getPanel(id);
        if (panel) {
          api.removePanel(panel);
        }
      },

      detachPanel: (id) => {
        get().removePanel(id);
        new WebviewWindow(id, {
          url: paths.panels.getHref(id),
          title: id,
          width: 800,
          height: 600,
          resizable: true,
          focus: true,
        });
      },
    })),
    { name: 'dashboard-store' },
  ),
);

const saveApiToSettings = async (api: DockviewApi, runtime: LiveManagedRuntime) => {
  if (!runtime) {
    console.warn('Runtime not available for saving layout');
    return;
  }

  try {
    const setEffect = Effect.gen(function* () {
      const settingsClient = yield* SettingsClient;
      yield* settingsClient.setSetting<SerializedDockview>(
        KEY_DASHBOARD_SETTING,
        api.toJSON(),
      );
    });
    await runtime.runPromise(setEffect);

    dashboardStore.getState().setSavedLayout(api.toJSON());
    console.log('Layout saved to settings');
  } catch (error) {
    console.error('Failed to save dashboard layout:', error);
  }
};

dashboardStore.subscribe(
  (state) => ({ api: state.api, runtime: state.runtime, isInitialized: state.isInitialized }),
  ({ api, runtime, isInitialized }, prev) => {
    if (api && runtime && isInitialized && (!prev.api || prev.api !== api)) {
      console.log('Setting up API event listeners');
      
      const disposables = [
        api.onDidAddPanel(() => {
          console.log('Panel added, saving layout');
          saveApiToSettings(api, runtime);
        }),
        api.onDidRemovePanel(() => {
          console.log('Panel removed, saving layout');
          saveApiToSettings(api, runtime);
        }),
        api.onDidMovePanel(() => {
          console.log('Panel moved, saving layout');
          saveApiToSettings(api, runtime);
        }),
        api.onDidLayoutChange(() => {
          console.log('Layout changed, saving layout');
          saveApiToSettings(api, runtime);
        })
      ];
      
      return () => {
        console.log('Disposing API event listeners');
        disposables.forEach((disposable) => disposable.dispose());
      };
    }
  },
  {
    fireImmediately: false,
    equalityFn: (a, b) => 
      a.api === b.api && 
      a.runtime === b.runtime && 
      a.isInitialized === b.isInitialized,
  },
);
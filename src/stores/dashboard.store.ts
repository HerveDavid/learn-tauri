import * as Effect from 'effect/Effect';
import { create } from 'zustand';
import { WebviewWindow } from '@tauri-apps/api/webviewWindow';
import { AddPanelOptions, DockviewApi, SerializedDockview } from 'dockview';
import { devtools, subscribeWithSelector } from 'zustand/middleware';

import { paths } from '@/config/paths';
import { LiveManagedRuntime } from '@/services/live-layer';
import { SettingsClient } from '@/services/common/settings-client';

const KEY_DASHBOARD_SETTING = 'dashboard-layout';

interface DashboardStore {
  api: DockviewApi | null;
  runtime: LiveManagedRuntime | null;
  setApi: (api: DockviewApi) => void;
  setRuntime: (runtime: LiveManagedRuntime) => void;
  addPanel: (panel: AddPanelOptions) => void;
  detachPanel: (id: string) => void;
  removePanel: (id: string) => void;
}

export const useDashboardStore = create<DashboardStore>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      api: null,
      runtime: null,

      setApi: (api) => {
        set({ api });
        
        const { runtime } = get();
        if (runtime) {
          loadLayout(api, runtime);
        }
      },

      setRuntime: (runtime) => {
        set({ runtime });
        
        const { api } = get();
        if (api) {
          loadLayout(api, runtime);
        }
      },

      addPanel: (panel) => {
        const { api } = get();
        if (!api) return;
        api.addPanel(panel);
      },

      removePanel: (id) => {
        const { api } = get();
        if (!api) return;
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
    { name: 'dashboard-store' }
  )
);

const loadLayout = async (api: DockviewApi, runtime: LiveManagedRuntime) => {
  try {
    const loadEffect = Effect.gen(function* () {
      const settingsClient = yield* SettingsClient;
      return yield* settingsClient.getSetting<SerializedDockview>(KEY_DASHBOARD_SETTING);
    });

    const layout = await runtime.runPromise(loadEffect);
    
    if (layout && Object.keys(layout).length > 0) {
      api.fromJSON(layout);
      console.log('Layout chargé');
    }
  } catch (error) {
    console.info('Aucun layout sauvegardé trouvé');
  }
};

const saveLayout = async (api: DockviewApi, runtime: LiveManagedRuntime) => {
  try {
    const setEffect = Effect.gen(function* () {
      const settingsClient = yield* SettingsClient;
      yield* settingsClient.setSetting<SerializedDockview>(
        KEY_DASHBOARD_SETTING,
        api.toJSON()
      );
    });
    await runtime.runPromise(setEffect);
    console.log('Layout sauvegardé');
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error);
  }
};

useDashboardStore.subscribe(
  (state) => ({ api: state.api, runtime: state.runtime }),
  ({ api, runtime }, prev) => {
    if (api && runtime && (!prev.api || prev.api !== api)) {
      const disposables = [
        api.onDidAddPanel(() => saveLayout(api, runtime)),
        api.onDidRemovePanel(() => saveLayout(api, runtime)),
        api.onDidMovePanel(() => saveLayout(api, runtime)),
        api.onDidLayoutChange(() => saveLayout(api, runtime))
      ];
      
      return () => {
        disposables.forEach((disposable) => disposable.dispose());
      };
    }
  },
  {
    fireImmediately: false,
    equalityFn: (a, b) => a.api === b.api && a.runtime === b.runtime,
  }
);
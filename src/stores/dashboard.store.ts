import { create } from 'zustand';
import { WebviewWindow } from '@tauri-apps/api/webviewWindow';
import { AddPanelOptions, DockviewApi, SerializedDockview } from 'dockview';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { paths } from '@/config/paths';
import { LiveManagedRuntime } from '@/services/live-layer';
import { useEffect, useState } from 'react';
import { SettingsClient } from '@/services/common/settings-client';
import { Effect } from 'effect';

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

export const useDashboardStore = (runtime: LiveManagedRuntime) => {
  const store = dashboardStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isInitialized) {
      store.setRuntime(runtime);
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (isInitialized) {
      store.setRuntime(runtime);
    }
  }, [runtime]);

  return store;
};

const dashboardStore = create<DashboardStore>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      api: null,
      runtime: null,
      setApi: (api) => set({ api }),
      setRuntime: (runtime) => set({ runtime }),
      addPanel: (panel) => {
        const { api } = get();
        if (!api) {
          return;
        }
        api.addPanel(panel);
      },
      removePanel: (id) => {
        const { api } = get();
        if (!api) {
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

const saveApiToSettings = async (api: DockviewApi, runtime: any) => {
  if (!runtime) return;

  const setEffect = Effect.gen(function* () {
    const settingsClient = yield* SettingsClient;
    yield* settingsClient.setSetting<SerializedDockview>(
      KEY_DASHBOARD_SETTING,
      api.toJSON(),
    );
  });

  await runtime.runPromise(setEffect);
};

dashboardStore.subscribe(
  (state) => ({ api: state.api, runtime: state.runtime }),
  ({ api, runtime }, prev) => {
    if (api && runtime && (!prev.api || prev.api !== api)) {
      saveApiToSettings(api, runtime);

      const disposables = [
        api.onDidAddPanel(() => saveApiToSettings(api, runtime)),
        api.onDidRemovePanel(() => saveApiToSettings(api, runtime)),
        api.onDidMovePanel(() => saveApiToSettings(api, runtime)),
      ];

      return () => {
        disposables.forEach((disposable) => disposable.dispose());
      };
    }
  },
  {
    fireImmediately: false,
    equalityFn: (a, b) => a.api === b.api && a.runtime === b.runtime,
  },
);

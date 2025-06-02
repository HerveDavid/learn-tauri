import { create } from 'zustand';
import { WebviewWindow } from '@tauri-apps/api/webviewWindow';
import { AddPanelOptions, DockviewApi } from 'dockview';
import { devtools, subscribeWithSelector } from 'zustand/middleware';

import { paths } from '@/config/paths';

interface DashboardStore {
  api: DockviewApi | null;

  setApi: (api: DockviewApi) => void;
  addPanel: (panel: AddPanelOptions) => void;
  detachPanel: (id: string) => void;
  removePanel: (id: string) => void;
}

export const useDashboardStore = create<DashboardStore>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      api: null,

      setApi: (api) => set({ api }),
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

        const _webviewWindow = new WebviewWindow(id, {
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

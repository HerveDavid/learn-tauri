import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { AddPanelOptions, DockviewApi, SerializedDockview } from 'dockview';

interface DashboardStore {
  api: DockviewApi | null;

  setApi: (api: DockviewApi) => void;
  addPanel: (panel: AddPanelOptions) => void;
  removePanel: (id: string) => void;
  toJson: () => SerializedDockview;
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
      toJson: () => {
        const { api } = get();
        return api!.toJSON();
      },
    })),
    { name: 'dashboard-store' },
  ),
);

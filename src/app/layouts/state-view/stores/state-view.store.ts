import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';

import { SidebarItem } from '@/types/sidebar-item';
import { leftSidebarPanels, leftSidebarTools, rightSidebarPanels } from '@/config/layouts';

interface SidebarConfig {
  name: string;
  panels: SidebarItem[];
  defaultSize?: number;
}

const createSidebarStore = (config: SidebarConfig) => {
  interface SidebarStore {
    isOpen: boolean;
    activeItem: SidebarItem;
    size: number;
    closePanel: () => void;
    openPanel: () => void;
    setActiveItem: (panelId: string) => void;
    setSize: (size: number) => void;
  }

  return create<SidebarStore>()(
    devtools(
      subscribeWithSelector((set) => ({
        isOpen: false,
        activeItem: config.panels[0],
        size: config.defaultSize || 15,
        closePanel: () => set({ isOpen: false }),
        openPanel: () => set({ isOpen: true }),
        setActiveItem: (panelId) => {
          const activeItem = config.panels.find((item) => item.id === panelId);
          if (activeItem) {
            set({ activeItem });
          } else {
            throw new Error(`Panel ${panelId} not found in ${config.name}`);
          }
        },
        setSize: (size) => set({ size }),
      })),
      { name: config.name },
    ),
  );
};

export const useLeftSidebarStore = createSidebarStore({
  name: 'left-sidebar-store',
  panels: leftSidebarPanels,
});

export const useRightSidebarStore = createSidebarStore({
  name: 'right-sidebar-store',
  panels: rightSidebarPanels,
});

export const useToolsStore = createSidebarStore({
  name: 'tools-store',
  panels: leftSidebarTools,
});
import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';

import { leftSidebarTools } from '@/config/layouts';
import { SidebarItem } from '@/types/sidebar-item';

interface ToolsStore {
  isOpen: boolean;
  activeItem: SidebarItem;
  size: number;

  closePanel: () => void;
  openPanel: () => void;
  setActiveItem: (panelId: string) => void;
  setSize: (size: number) => void;
}

export const useToolsStore = create<ToolsStore>()(
  devtools(
    subscribeWithSelector((set) => ({
      isOpen: false,
      activeItem: leftSidebarTools[0],
      size: 15,

      closePanel: () => set({ isOpen: false }),
      openPanel: () => set({ isOpen: true }),
      setActiveItem: (panelId) => {
        const activeItem = leftSidebarTools.find((item) => item.id === panelId);
        if (activeItem) {
          set({ activeItem });
        } else {
          throw Error('Not find left sidebar item');
        }
      },
      setSize: (size) => set({ size }),
    })),
    { name: 'left-sidebar-tools-store' },
  ),
);

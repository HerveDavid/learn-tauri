import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';

import { leftSidebarItems } from '@/config/layout';
import { SidebarItem } from '@/types/sidebar-item';

interface LeftSidebarStore {
  isOpen: boolean;
  activeItem: SidebarItem;
  size: number;

  closePanel: () => void;
  openPanel: () => void;
  setActiveItem: (panelId: string) => void;
  setSize: (size: number) => void;
}

export const useLeftSidebarStore = create<LeftSidebarStore>()(
  devtools(
    subscribeWithSelector((set) => ({
      isOpen: false,
      activeItem: leftSidebarItems[0],
      size: 15,

      closePanel: () => set({ isOpen: false }),
      openPanel: () => set({ isOpen: true }),
      setActiveItem: (panelId) => {
        const activeItem = leftSidebarItems.find((item) => item.id === panelId);
        if (activeItem) {
          set({ activeItem });
        } else {
          throw Error('Not find left sidebar item');
        }
      },
      setSize: (size) => set({ size }),
    })),
    { name: 'left-sidebar-store' },
  ),
);

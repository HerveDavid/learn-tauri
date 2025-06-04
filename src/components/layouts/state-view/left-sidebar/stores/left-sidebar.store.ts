import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';

import { leftSidebarItems } from '@/config/layout';
import { SidebarItem } from '@/types/sidebar-item';

interface LeftSidebarStore {
  isOpen: boolean;
  activeItem: SidebarItem;

  closePanel: () => void;
  openPanel: () => void;
  setActiveItem: (panelId: string) => void;
}

export const useLeftSidebarStore = create<LeftSidebarStore>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      isOpen: false,
      activeItem: leftSidebarItems[0],
      closePanel: () => set({ isOpen: false }),
      openPanel: () => set({ isOpen: true }),
      setActiveItem: (panelId) => {
        const activeItem = leftSidebarItems.find(
          (item) => item.id === panelId,
        );
        if (activeItem) {
          set({ activeItem });
        } else {
          throw Error('Not find left sidebar item');
        }
      },
    })),
    { name: 'left-sidebar-store' },
  ),
);

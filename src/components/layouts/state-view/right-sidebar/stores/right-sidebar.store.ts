import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';

import { rightSidebarItems } from '@/config/layout';
import { SidebarItem } from '@/types/sidebar-item';

interface RightSidebarStore {
  isOpen: boolean;
  activeItem: SidebarItem;

  closePanel: () => void;
  openPanel: () => void;
  setActiveItem: (panelId: string) => void;
}

export const useRightSidebarStore = create<RightSidebarStore>()(
  devtools(
    subscribeWithSelector((set) => ({
      isOpen: false,
      activeItem: rightSidebarItems[0],
      closePanel: () => set({ isOpen: false }),
      openPanel: () => set({ isOpen: true }),
      setActiveItem: (panelId) => {
        const activeItem = rightSidebarItems.find(
          (item) => item.id === panelId,
        );
        if (activeItem) {
          set({ activeItem });
        } else {
          throw Error('Not find right sidebar item');
        }
      },
    })),
    { name: 'right-sidebar-store' },
  ),
);

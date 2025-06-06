import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';

import { rightSidebarPanels } from '@/config/layouts';
import { SidebarItem } from '@/types/sidebar-item';

interface RightSidebarStore {
  isOpen: boolean;
  activeItem: SidebarItem;
  size: number;

  closePanel: () => void;
  openPanel: () => void;
  setActiveItem: (panelId: string) => void;
  setSize: (size: number) => void;
}

export const useRightSidebarStore = create<RightSidebarStore>()(
  devtools(
    subscribeWithSelector((set) => ({
      isOpen: false,
      activeItem: rightSidebarPanels[0],
      size: 15,

      closePanel: () => set({ isOpen: false }),
      openPanel: () => set({ isOpen: true }),
      setActiveItem: (panelId) => {
        const activeItem = rightSidebarPanels.find(
          (item) => item.id === panelId,
        );
        if (activeItem) {
          set({ activeItem });
        } else {
          throw Error('Not find right sidebar item');
        }
      },
      setSize: (size) => set({ size }),
    })),
    { name: 'right-sidebar-store' },
  ),
);

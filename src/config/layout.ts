import { Folder } from 'lucide-react';

import EquipmentExplorer from '@/features/equipment-explorer';
import { SidebarItem } from '@/types/sidebar-item';

export const leftSidebarItems: SidebarItem[] = [
  {
    id: 'equipment-explorer',
    icon: Folder,
    label: 'Explorer',
    content: EquipmentExplorer,
  },
] as const;

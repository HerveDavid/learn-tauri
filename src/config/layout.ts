import { Layers, Folder } from 'lucide-react';
import EquipmentExplorer from '@/features/equipment-explorer';
import { SidebarItem } from '@/types/sidebar-item';
import Widgets from '@/features/widgets';

export const leftSidebarItems: SidebarItem[] = [
  {
    id: 'equipment-explorer',
    icon: Folder,
    label: 'Explorer',
    content: EquipmentExplorer,
  },
] as const;

export const rightSidebarItems: SidebarItem[] = [
  { id: 'widgets', icon: Layers, label: 'Widgets', content: Widgets },
] as const;

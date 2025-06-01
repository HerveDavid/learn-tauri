import { Layers, Folder, Terminal as TerminalIcon } from 'lucide-react';

import EquipmentExplorer from '@/features/equipment-explorer';
import Terminal from '@/features/terminal';
import Widgets from '@/features/widgets';
import { SidebarItem } from '@/types/sidebar-item';

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

export const toolsItems: SidebarItem[] = [
  { id: 'terminal', icon: TerminalIcon, label: 'Terminal', content: Terminal },
] as const;

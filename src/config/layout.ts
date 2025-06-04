import { Layers, Folder, Terminal as TerminalIcon } from 'lucide-react';

import EquipmentExplorer from '@/features/equipment-explorer';
import { EventsLog } from '@/features/events-log';
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
  {
    id: 'equipment-explorer2',
    icon: Folder,
    label: 'Explorer2',
    content: EquipmentExplorer,
  },
] as const;

export const rightSidebarItems: SidebarItem[] = [
  { id: 'widgets', icon: Layers, label: 'Widgets', content: Widgets },
] as const;

export const toolsItems: SidebarItem[] = [
  { id: 'terminal', icon: TerminalIcon, label: 'Terminal', content: Terminal },
  { id: 'log', icon: TerminalIcon, label: 'Log', content: EventsLog },
] as const;

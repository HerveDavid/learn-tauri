import { IDockviewPanelProps } from 'dockview';
import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from '@/components/ui/context-menu';
import { useCentralPanelStore } from '@/stores/central-panel.store';

const Default = (props: IDockviewPanelProps<{ title: string }>) => {
  const { removePanel } = useCentralPanelStore();
  const handleClose = () => {
    removePanel(props.api.id);
  };

  return (
    <div className="flex justify-between items-center mx-2 h-[calc(100%+1px)]">
      <ContextMenu>
        <ContextMenuTrigger>{props.api.title}</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={handleClose}>Close</ContextMenuItem>
          <ContextMenuItem>Close Others</ContextMenuItem>
          <ContextMenuItem>Close All</ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem>Add in Favorites</ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem>Detach Panel</ContextMenuItem>
          <ContextMenuItem>Detach Groups</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
};

export const TabComponent = {
  default: Default,
};

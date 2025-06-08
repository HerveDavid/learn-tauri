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
    <div className="flex justify-between items-center space-x-3">
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
      <Button
        variant="ghost"
        className="size-1 hover:bg-destructive hover:text-destructive-foreground"
        onClick={handleClose}
      >
        <X />
      </Button>
    </div>
  );
};

export const TabComponent = {
  default: Default,
};

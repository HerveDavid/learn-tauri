import { IDockviewHeaderActionsProps } from 'dockview';
import { EllipsisVertical } from 'lucide-react';

import { Button } from '@/components/ui/button';

export const LeftHeaderActions = (_props: IDockviewHeaderActionsProps) => {
  return (
    <div className="h-full flex items-center px-2">
      <Button
        variant="ghost"
        size="sm"
        className="size-5 p-0 hover:bg-accent"
        title="Settings panel"
      >
        <EllipsisVertical className="size-4" />
      </Button>
    </div>
  );
};

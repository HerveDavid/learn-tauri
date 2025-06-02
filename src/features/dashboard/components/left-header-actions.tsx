import { IDockviewHeaderActionsProps } from 'dockview';
import { EllipsisVertical } from 'lucide-react';

import { Button } from '@/components/ui/button';

export const LeftHeaderActions = (_props: IDockviewHeaderActionsProps) => {
  return (
    <div className="h-full flex items-center px-2">
      <Button
        variant="ghost"
        size="sm"
        className="h-6 w-6 p-0 hover:bg-accent"
        title="Settings panel"
      >
        <EllipsisVertical className="h-4 w-4" />
      </Button>
    </div>
  );
};

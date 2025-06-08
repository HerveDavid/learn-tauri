import { Minus } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { useToolsStore } from '../../stores/state-view.store';

export const Tools = () => {
  const { activeItem, closePanel } = useToolsStore();

  return (
    <div className="flex flex-col ">
      <div className="flex bg-sidebar border-y justify-between">
        <div className="font-medium text-xs uppercase tracking-wide text-sidebar-foreground/70 ml-2">
          {activeItem.id}
        </div>

        <Button variant="ghost" className="size-0.5 px-1" onClick={closePanel}>
          <Minus />
        </Button>
      </div>

      <div className="p-4 h-full">{activeItem.content()}</div>
    </div>
  );
};

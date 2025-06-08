import { Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRightSidebarStore } from '../../hooks/use-right-sidebar-store';

export const RightSidebarPanel = ({ id }: { id: string }) => {
  const { activeItem, closePanel } = useRightSidebarStore(id);

  return (
    <div className="h-full bg-sidebar border-l overflow-auto">
      <div className="flex items-center justify-between border-b py-1 px-2 bg-background shadow">
        <h3 className="font-medium text-xs uppercase tracking-wide text-sidebar-foreground">
          {activeItem.label}
        </h3>
        <Button variant="ghost" className="size-1" onClick={closePanel}>
          <Minus />
        </Button>
      </div>
      <div className="p-4">{activeItem.content()}</div>
    </div>
  );
};

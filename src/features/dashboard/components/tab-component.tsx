import { IDockviewPanelProps } from 'dockview';
import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useDashboardStore } from '@/stores/dashboard.store';

const Default = (props: IDockviewPanelProps<{ title: string }>) => {
  const { removePanel } = useDashboardStore();
  const handleClose = () => {
    removePanel(props.api.id);
  };

  return (
    <div className="flex justify-between items-center space-x-3">
      <h1>{props.api.title}</h1>
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

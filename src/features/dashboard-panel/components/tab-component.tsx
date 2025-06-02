import { Button } from '@/components/ui/button';
import { IDockviewPanelProps } from 'dockview';
import { X } from 'lucide-react';
import { useDashboardStore } from '../stores/dashboard.store';

export const TabComponent = {
  default: (props: IDockviewPanelProps<{ title: string }>) => {
    const { removePanel } = useDashboardStore();
    
    const handleClose = () => {
      removePanel(props.api.id);
    };

    return (
      <div className="flex justify-between items-center space-x-3">
        <h1>{props.api.title}</h1>
        <Button
          variant="ghost"
          className="size-1"
          onClick={handleClose}
        >
          <X />
        </Button>
      </div>
    );
  },
};

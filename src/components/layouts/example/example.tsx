import {
  DockviewApi,
  DockviewDidDropEvent,
  DockviewReact,
  DockviewReadyEvent,
  DockviewTheme,
  IDockviewPanelProps,
  positionToDirection,
} from 'dockview';
import React from 'react';
import 'dockview/dist/styles/dockview.css';
import './example.css';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

const customTailwindTheme: DockviewTheme = {
  name: 'tailwind-custom',
  className: 'dockview-theme-tailwind-custom',
  gap: 0,
  dndOverlayMounting: 'absolute',
  dndPanelOverlay: 'group',
};

const dockviewComponents = {
  default: (props: IDockviewPanelProps<{ title: string }>) => {
    return (
      <div className="p-5">
        <div>{props.params?.title || 'Default Panel'}</div>
      </div>
    );
  },
};

const tabComponent = {
  default: (props: IDockviewPanelProps<{ title: string }>) => {
    return (
      <div className="flex justify-between items-center space-x-3">
        <h1>{props.api.title}</h1>
        <Button
          variant="ghost"
          className="size-1"
          onClick={() => props.api.close()}
        >
          <X />
        </Button>
      </div>
    );
  },
};

export const Example = () => {
  const [api, setApi] = React.useState<DockviewApi>();

  React.useEffect(() => {
    if (!api) {
      return;
    }

    const disposable = api.onUnhandledDragOverEvent((event) => {
      event.accept();
    });

    return () => {
      disposable.dispose();
    };
  }, [api]);

  const onReady = (event: DockviewReadyEvent) => {
    setApi(event.api);
  };

  const onDidDrop = (event: DockviewDidDropEvent) => {
    let draggedItem = null;

    try {
      const dragData =
        event.nativeEvent?.dataTransfer?.getData('application/json');
      if (dragData) {
        draggedItem = JSON.parse(dragData);
      }
    } catch (error) {
      console.error('Error parsing drag data:', error);
    }

    const title = draggedItem?.name || 'Dropped Item';

    event.api.addPanel({
      id: title,
      component: 'default',
      tabComponent: 'default',
      params: { title },
      position: {
        direction: positionToDirection(event.position),
        referenceGroup: event.group || undefined,
      },
    });
  };

  return (
    <div className="h-full flex flex-col">
      <DockviewReact
        components={dockviewComponents}
        onReady={onReady}
        tabComponents={tabComponent}
        theme={customTailwindTheme}
        onDidDrop={onDidDrop}
        dndEdges={{
          size: { value: 100, type: 'pixels' },
          activationSize: { value: 5, type: 'percentage' },
        }}
      />
    </div>
  );
};

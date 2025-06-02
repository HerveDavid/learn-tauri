import {
  DockviewDidDropEvent,
  DockviewReact,
  DockviewReadyEvent,
  DockviewTheme,
  positionToDirection,
} from 'dockview';
import React from 'react';
import 'dockview/dist/styles/dockview.css';
import './dashboard.css';
import { Watermark } from './watermark';
import { DockviewComponents } from './dockview-components';
import { TabComponent } from './tab-component';
import { useDashboardStore } from '../stores/dashboard.store';

const customTailwindTheme: DockviewTheme = {
  name: 'tailwind-custom',
  className: 'dockview-theme-tailwind-custom',
  gap: 0,
  dndOverlayMounting: 'absolute',
  dndPanelOverlay: 'group',
};

export const Dashboard = () => {
  const { api, setApi, addPanel } = useDashboardStore();

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
    const panel = {
      id: title,
      component: 'default',
      tabComponent: 'default',
      params: { title },
      position: {
        direction: positionToDirection(event.position),
        referenceGroup: event.group,
      },
    };

    event.api.addPanel(panel);
    addPanel(panel);
  };

  return (
    <div className="h-full flex flex-col">
      <DockviewReact
        watermarkComponent={Watermark}
        components={DockviewComponents}
        onReady={onReady}
        tabComponents={TabComponent}
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

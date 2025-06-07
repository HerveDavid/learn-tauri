import React from 'react';
import {
  DockviewDidDropEvent,
  DockviewReact,
  DockviewReadyEvent,
  DockviewTheme,
  positionToDirection,
} from 'dockview';
import 'dockview/dist/styles/dockview.css';
import './dashboard.css';
import { DashboardComponents } from '@/config/dashboard';
import { useDashboardStore } from '@/stores/dashboard.store';
import { DraggedItem } from '../types/dragged-item.type';
import { isDraggedItem } from '../utils';
import { LeftHeaderActions } from './left-header-actions';
import { RightHeaderActions } from './right-header-actions';
import { TabComponent } from './tab-component';
import { Watermark } from './watermark';
import { useRuntime } from '@/services/runtime/use-runtime';

const customTailwindTheme: DockviewTheme = {
  name: 'tailwind-custom',
  className: 'dockview-theme-tailwind-custom',
  gap: 0,
  dndOverlayMounting: 'absolute',
  dndPanelOverlay: 'group',
};

export interface DashboardProps {
  defaultPanels?: [{ id: string }];
}

export const Dashboard: React.FC<DashboardProps> = ({ defaultPanels }) => {
  const runtime = useRuntime();
  const { api, setApi, addPanel, isLayoutLoaded } = useDashboardStore(runtime);

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
    console.log('Dockview ready, setting API');
    setApi(event.api);

    setTimeout(() => {
      const hasExistingPanels = event.api.panels.length > 0;

      console.log('Checking for existing panels after delay:', {
        panelsCount: event.api.panels.length,
        groupsCount: event.api.groups.length,
        hasExistingPanels,
      });

      if (!hasExistingPanels && defaultPanels) {
        console.log('No existing panels found, adding default panels');
        defaultPanels.forEach(({ id }) =>
          event.api.addPanel({
            id: id,
            component: 'sld',
            tabComponent: 'default',
            params: { title: id },
          }),
        );
      } else {
        console.log('Existing panels found or no default panels specified');
      }
    }, 300);
  };

  const onDidDrop = (event: DockviewDidDropEvent) => {
    const dragData =
      event.nativeEvent?.dataTransfer?.getData('application/json');
    if (!dragData) {
      console.warn('No drag data found');
      return;
    }
    let parsedData: DraggedItem;
    try {
      parsedData = JSON.parse(dragData);
    } catch (error) {
      console.error('Error parsing drag data:', error);
      return;
    }
    if (!isDraggedItem(parsedData)) {
      console.warn('Invalid drag data structure:', parsedData);
      return;
    }
    const title = parsedData.name;
    const panel = {
      id: title,
      component: 'sld',
      tabComponent: 'default',
      params: { title },
      position: {
        direction: positionToDirection(event.position),
        referenceGroup: event.group,
      },
    };
    addPanel(panel);
  };

  if (!isLayoutLoaded) {
    return (
      <div className="h-full flex items-center justify-center">
        <div>Chargement du layout...</div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <DockviewReact
        watermarkComponent={Watermark}
        components={DashboardComponents}
        onReady={onReady}
        tabComponents={TabComponent}
        theme={customTailwindTheme}
        onDidDrop={onDidDrop}
        leftHeaderActionsComponent={LeftHeaderActions}
        rightHeaderActionsComponent={RightHeaderActions}
        dndEdges={{
          size: { value: 100, type: 'pixels' },
          activationSize: { value: 5, type: 'percentage' },
        }}
      />
    </div>
  );
};

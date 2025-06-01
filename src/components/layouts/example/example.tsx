import {
  DockviewReact,
  DockviewReadyEvent,
  IDockviewPanelProps,
  DockviewTheme,
} from 'dockview';

import 'dockview/dist/styles/dockview.css';
import { EventsLog } from '@/features/events-log';
import './example.css';

// Custom theme using your Tailwind CSS variables
const customTailwindTheme: DockviewTheme = {
  name: 'tailwind-custom',
  className: 'dockview-theme-tailwind-custom',
  gap: 0,
  dndOverlayMounting: 'absolute',
  dndPanelOverlay: 'group',
};

// Inner Dockview Component
const InnerDockview = () => {
  const onReady = (event: DockviewReadyEvent) => {
    event.api.addPanel({
      id: 'inner_panel_1',
      component: 'default',
      title: 'Inner Panel 1',
      params: { title: 'Inner Panel 1' },
    });
    event.api.addPanel({
      id: 'inner_panel_2',
      component: 'default',
      title: 'Inner Panel 2',
      params: { title: 'Inner Panel 2' },
    });
    event.api.addPanel({
      id: 'inner_panel_3',
      component: 'default',
      title: 'Inner Panel 3',
      params: { title: 'Inner Panel 3' },
    });
  };

  return (
    <div className="h-full w-full">
      <DockviewReact
        onReady={onReady}
        // tabComponents={tabComponent}
        components={innerComponents}
        theme={customTailwindTheme}
      />
    </div>
  );
};

// Inner components
const innerComponents = {
  default: (props: IDockviewPanelProps<{ title: string }>) => {
    return (
      <div className="h-full p-6 bg-card text-card-foreground flex flex-col items-center justify-center space-y-4 border border-border rounded-none">
        <h3 className="text-lg font-semibold text-primary">
          {props.params?.title || 'Default Panel'}
        </h3>
        <p className="text-sm text-muted-foreground">
          This panel uses your custom Tailwind theme with CSS variables
        </p>
        <div className="flex space-x-2">
          <div className="w-4 h-4 bg-chart-1 rounded-none"></div>
          <div className="w-4 h-4 bg-chart-2 rounded-none"></div>
          <div className="w-4 h-4 bg-chart-3 rounded-none"></div>
        </div>
      </div>
    );
  },
};

// Main components
const components = {
  default: (props: IDockviewPanelProps<{ title: string }>) => {
    return (
      <div className="h-full p-6 bg-card-background text-foreground flex flex-col items-center justify-center space-y-4">
        <div className="bg-card text-card-foreground p-6 border border-border shadow-lg w-full max-w-md rounded-none">
          <h2 className="text-xl font-bold text-primary mb-4">
            {props.params?.title || 'Main Panel'}
          </h2>
          <p className="text-muted-foreground mb-4">
            This panel demonstrates your Tailwind theme integration with
            Dockview.
          </p>
          <div className="flex space-x-2 mb-4">
            <button className="bg-primary text-primary-foreground px-3 py-1 text-sm hover:opacity-90 transition-opacity rounded-none">
              Primary
            </button>
            <button className="bg-secondary text-secondary-foreground px-3 py-1 text-sm hover:opacity-90 transition-opacity rounded-none">
              Secondary
            </button>
          </div>
          <div className="grid grid-cols-5 gap-2">
            <div className="w-8 h-8 bg-chart-1 rounded-none"></div>
            <div className="w-8 h-8 bg-chart-2 rounded-none"></div>
            <div className="w-8 h-8 bg-chart-3 rounded-none"></div>
            <div className="w-8 h-8 bg-chart-4 rounded-none"></div>
            <div className="w-8 h-8 bg-chart-5 rounded-none"></div>
          </div>
        </div>
      </div>
    );
  },
  innerDockview: InnerDockview,
  eventsLog: EventsLog,
};

export const Example = () => {
  const onReady = (event: DockviewReadyEvent) => {
    event.api.addPanel({
      id: 'panel_1',
      component: 'default',
      // tabComponent: 'default',
      title: 'Main Panel 1',
      params: { title: 'Main Panel 1' },
    });

    event.api.addPanel({
      id: 'panel_2',
      component: 'default',
      // tabComponent: 'default',
      title: 'Main Panel 2',
      params: { title: 'Main Panel 2' },
    });

    event.api.addPanel({
      id: 'panel_3',
      component: 'eventsLog',
      // tabComponent: 'default',

      title: 'Logs',
      position: { referencePanel: 'panel_2', direction: 'below' },
    });
  };

  return (
    <div className="h-full w-full bg-background">
      <DockviewReact
        onReady={onReady}
        // tabComponents={tabComponent}
        components={components}
        theme={customTailwindTheme}
      />
    </div>
  );
};

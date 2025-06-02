import { useState } from 'react';
import { leftSidebarItems } from '@/config/layout';
import { LeftSidebarPanel } from './left-sidebar-panel';

export const LeftSidebar = () => {
  const [activePanel, setActivePanel] = useState<string | null>(
    'equipment-explorer',
  );

  const handleIconClick = (itemId: string) => {
    if (activePanel === itemId) {
      setActivePanel(null);
    } else {
      setActivePanel(itemId);
    }
  };

  return (
    <div className="flex">
      <div className="w-8 bg-sidebar border-r flex flex-col items-center py-2 space-y-3">
        {leftSidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePanel === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleIconClick(item.id)}
              className={`size-5 flex items-center justify-center rounded hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors group relative ${
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground'
              }`}
              title={item.label}
            >
              <Icon className="size-4" />
              <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                {item.label}
              </div>
            </button>
          );
        })}
      </div>

      <LeftSidebarPanel
        activePanel={activePanel}
        closePanel={() => setActivePanel(null)}
      />
    </div>
  );
};

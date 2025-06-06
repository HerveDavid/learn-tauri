import { Minus } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { toolsItems } from '@/config/layouts';

import { ToolsPanel } from './tools-panel';

export const Tools = () => {
  const [activePanel, setActivePanel] = useState<string | null>('terminal');

  const handleTabClick = (content: string) => {
    if (activePanel === content) {
      setActivePanel(null);
    } else {
      setActivePanel(content);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex bg-sidebar border-t justify-between">
        <div className="flex">
          {toolsItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePanel === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`flex items-center gap-2 px-2 text-sm border-r hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors ${
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground'
                }`}
              >
                <Icon className="w-3 h-3" />
                {item.label}
              </button>
            );
          })}
        </div>

        {activePanel && (
          <Button
            variant="ghost"
            className="size-1"
            onClick={() => setActivePanel(null)}
          >
            <Minus />
          </Button>
        )}
      </div>

      <ToolsPanel activePanel={activePanel} />
    </div>
  );
};

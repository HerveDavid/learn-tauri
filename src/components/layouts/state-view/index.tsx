import { Bug, Terminal, Settings, FileText } from 'lucide-react';
import React, { useState, useEffect } from 'react';

import { Header } from './header';
import { LeftSidebar } from './left-sidebar';
import { Footer } from './footer';
import { RightSidebar } from './right-sidebar';

// Bottom tools configuration
const toolsItems = [
  { id: 'terminal', icon: Terminal, label: 'Terminal', content: 'terminal' },
  { id: 'problems', icon: Bug, label: 'Problems', content: 'problems' },
  { id: 'output', icon: FileText, label: 'Output', content: 'output' },
  { id: 'settings', icon: Settings, label: 'Settings', content: 'settings' },
];

const ToolsPanel = ({ activePanel }: { activePanel: string | null }) => {
  if (!activePanel) return null;

  const renderContent = () => {
    switch (activePanel) {
      case 'terminal':
        return (
          <div className="p-4 h-full">
            <div className="bg-background text-green-400 font-mono text-sm p-3 rounded h-full overflow-auto">
              <div>$ npm start</div>
              <div className="text-gray-400">
                Starting development server...
              </div>
              <div className="text-green-400">
                ✓ Server running on http://localhost:3000
              </div>
              <div className="mt-2">
                $ <span className="animate-pulse">|</span>
              </div>
            </div>
          </div>
        );
      case 'problems':
        return (
          <div className="p-4">
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 py-2 border-b border-border">
                <span className="text-red-500">●</span>
                <span>Error: Missing dependency in package.json</span>
              </div>
              <div className="flex items-center gap-2 py-2 border-b border-border">
                <span className="text-yellow-500">●</span>
                <span>Warning: Unused variable 'temp'</span>
              </div>
              <div className="flex items-center gap-2 py-2">
                <span className="text-blue-500">●</span>
                <span>Info: Code can be optimized</span>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="p-4">
            <div className="text-sm text-muted-foreground">
              {toolsItems.find((item) => item.content === activePanel)?.label}{' '}
              content
            </div>
          </div>
        );
    }
  };

  return (
    <div
      className="bg-sidebar border-t border-sidebar-border overflow-auto"
      style={{ height: '200px' }}
    >
      {renderContent()}
    </div>
  );
};

const Tools = () => {
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
      {/* Tool Tabs */}
      <div className="flex bg-sidebar border-t border-sidebar-border">
        {toolsItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePanel === item.content;

          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.content)}
              className={`flex items-center gap-2 px-2 text-sm border-r border-sidebar-border hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors ${
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

      {/* Tool Content */}
      <ToolsPanel activePanel={activePanel} />
    </div>
  );
};

export const StateView: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Create a ref to track layout changes and trigger Dockview resize
  const contentRef = React.useRef<HTMLDivElement>(null);

  // Use ResizeObserver to detect when the content area changes size
  useEffect(() => {
    if (!contentRef.current) return;

    const resizeObserver = new ResizeObserver((_entries) => {
      // Trigger a global resize event that Dockview will listen to
      window.dispatchEvent(new Event('resize'));
    });

    resizeObserver.observe(contentRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div className="h-screen bg-background text-foreground flex flex-col">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        <LeftSidebar />

        <div className="flex-1 flex flex-col min-w-0" ref={contentRef}>
          <div className="flex-1 bg-background overflow-hidden">
            <div className="h-full w-full">{children}</div>
          </div>

          <Tools />
        </div>

        <RightSidebar />
      </div>

      <Footer />
    </div>
  );
};

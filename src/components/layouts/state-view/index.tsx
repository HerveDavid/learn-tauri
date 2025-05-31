import React, { useState } from 'react';
import {
  Search,
  GitBranch,
  Bug,
  Database,
  Terminal,
  Settings,
  Package,
  Folder,
  ChevronRight,
  ChevronDown,
  File,
  FolderOpen,
  Layers,
  Activity,
  FileText,
  BarChart3,
  Network,
  Zap,
} from 'lucide-react';

// Mock data for file explorer
const fileStructure = [
  {
    name: 'src',
    type: 'folder',
    expanded: true,
    children: [
      {
        name: 'components',
        type: 'folder',
        expanded: true,
        children: [
          { name: 'Button.tsx', type: 'file' },
          { name: 'Sidebar.tsx', type: 'file' },
          { name: 'Modal.tsx', type: 'file' },
        ],
      },
      {
        name: 'hooks',
        type: 'folder',
        expanded: false,
        children: [
          { name: 'useAuth.ts', type: 'file' },
          { name: 'useApi.ts', type: 'file' },
        ],
      },
      { name: 'App.tsx', type: 'file' },
      { name: 'index.tsx', type: 'file' },
    ],
  },
  {
    name: 'public',
    type: 'folder',
    expanded: false,
    children: [
      { name: 'index.html', type: 'file' },
      { name: 'favicon.ico', type: 'file' },
    ],
  },
  { name: 'package.json', type: 'file' },
  { name: 'README.md', type: 'file' },
];

// Left sidebar configuration
const leftSidebarItems = [
  { id: 'explorer', icon: Folder, label: 'Explorer', content: 'file-explorer' },
  { id: 'search', icon: Search, label: 'Search', content: 'search' },
  { id: 'git', icon: GitBranch, label: 'Source Control', content: 'git' },
  { id: 'debug', icon: Bug, label: 'Run and Debug', content: 'debug' },
  {
    id: 'extensions',
    icon: Package,
    label: 'Extensions',
    content: 'extensions',
  },
  { id: 'database', icon: Database, label: 'Database', content: 'database' },
];

// Right sidebar configuration
const rightSidebarItems = [
  { id: 'outline', icon: Layers, label: 'Outline', content: 'outline' },
  { id: 'inspector', icon: Activity, label: 'Inspector', content: 'inspector' },
  { id: 'docs', icon: FileText, label: 'Documentation', content: 'docs' },
  {
    id: 'analytics',
    icon: BarChart3,
    label: 'Analytics',
    content: 'analytics',
  },
  { id: 'network', icon: Network, label: 'Network', content: 'network' },
  {
    id: 'performance',
    icon: Zap,
    label: 'Performance',
    content: 'performance',
  },
];

// Bottom tools configuration
const toolsItems = [
  { id: 'terminal', icon: Terminal, label: 'Terminal', content: 'terminal' },
  { id: 'problems', icon: Bug, label: 'Problems', content: 'problems' },
  { id: 'output', icon: FileText, label: 'Output', content: 'output' },
  { id: 'settings', icon: Settings, label: 'Settings', content: 'settings' },
];

const FileTreeItem = ({ item, level = 0 }: { item: any; level?: number }) => {
  const [expanded, setExpanded] = useState(item.expanded || false);

  const handleToggle = () => {
    if (item.type === 'folder') {
      setExpanded(!expanded);
    }
  };

  return (
    <div>
      <div
        className={`flex items-center py-1 px-2 cursor-pointer hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-sm text-sm`}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={handleToggle}
      >
        {item.type === 'folder' ? (
          <>
            {expanded ? (
              <ChevronDown className="w-3 h-3 mr-1" />
            ) : (
              <ChevronRight className="w-3 h-3 mr-1" />
            )}
            {expanded ? (
              <FolderOpen className="size-4 mr-2 text-blue-500" />
            ) : (
              <Folder className="size-4 mr-2 text-blue-500" />
            )}
          </>
        ) : (
          <>
            <div className="size-4 mr-2" />
            <File className="size-4 mr-2 text-gray-500" />
          </>
        )}
        <span className="truncate">{item.name}</span>
      </div>
      {item.type === 'folder' && expanded && item.children && (
        <div>
          {item.children.map((child: any, index: number) => (
            <FileTreeItem key={index} item={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

const LeftSidebarPanel = ({ activePanel }: { activePanel: string | null }) => {
  if (!activePanel) return null;

  const renderContent = () => {
    switch (activePanel) {
      case 'file-explorer':
        return (
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-sm uppercase tracking-wide text-sidebar-foreground/70">
                Explorer
              </h3>
            </div>
            <div className="space-y-1">
              {fileStructure.map((item, index) => (
                <FileTreeItem key={index} item={item} />
              ))}
            </div>
          </div>
        );
      case 'search':
        return (
          <div className="p-4">
            <h3 className="font-medium text-sm uppercase tracking-wide text-sidebar-foreground/70 mb-4">
              Search
            </h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Search files..."
                className="w-full px-3 py-2 bg-input border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <input
                type="text"
                placeholder="Replace..."
                className="w-full px-3 py-2 bg-input border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/90">
                  Search
                </button>
                <button className="px-3 py-1 bg-secondary text-secondary-foreground rounded text-sm hover:bg-secondary/90">
                  Replace All
                </button>
              </div>
            </div>
          </div>
        );
      case 'git':
        return (
          <div className="p-4">
            <h3 className="font-medium text-sm uppercase tracking-wide text-sidebar-foreground/70 mb-4">
              Source Control
            </h3>
            <div className="space-y-3">
              <div className="text-sm">
                <div className="font-medium mb-2">Changes (3)</div>
                <div className="space-y-1 ml-2">
                  <div className="flex items-center gap-2 py-1">
                    <span className="text-green-500">M</span>
                    <span className="text-sm">src/components/Button.tsx</span>
                  </div>
                  <div className="flex items-center gap-2 py-1">
                    <span className="text-blue-500">A</span>
                    <span className="text-sm">src/components/Modal.tsx</span>
                  </div>
                  <div className="flex items-center gap-2 py-1">
                    <span className="text-red-500">D</span>
                    <span className="text-sm">src/old-component.tsx</span>
                  </div>
                </div>
              </div>
              <textarea
                placeholder="Commit message..."
                className="w-full px-3 py-2 bg-input border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                rows={3}
              />
              <button className="w-full px-3 py-2 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/90">
                Commit & Push
              </button>
            </div>
          </div>
        );
      default:
        return (
          <div className="p-4">
            <h3 className="font-medium text-sm uppercase tracking-wide text-sidebar-foreground/70 mb-4">
              {
                leftSidebarItems.find((item) => item.content === activePanel)
                  ?.label
              }
            </h3>
            <div className="text-sm text-muted-foreground">
              Content for {activePanel} panel would go here.
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border overflow-auto">
      {renderContent()}
    </div>
  );
};

const RightSidebarPanel = ({ activePanel }: { activePanel: string | null }) => {
  if (!activePanel) return null;

  const renderContent = () => {
    switch (activePanel) {
      case 'outline':
        return (
          <div className="p-4">
            <h3 className="font-medium text-sm uppercase tracking-wide text-sidebar-foreground/70 mb-4">
              Outline
            </h3>
            <div className="space-y-2 text-sm">
              <div className="font-medium">Components</div>
              <div className="ml-2 space-y-1">
                <div className="py-1 hover:bg-sidebar-accent rounded px-2 cursor-pointer">
                  App
                </div>
                <div className="py-1 hover:bg-sidebar-accent rounded px-2 cursor-pointer">
                  Header
                </div>
                <div className="py-1 hover:bg-sidebar-accent rounded px-2 cursor-pointer">
                  Sidebar
                </div>
                <div className="py-1 hover:bg-sidebar-accent rounded px-2 cursor-pointer">
                  Footer
                </div>
              </div>
              <div className="font-medium mt-3">Functions</div>
              <div className="ml-2 space-y-1">
                <div className="py-1 hover:bg-sidebar-accent rounded px-2 cursor-pointer">
                  handleClick()
                </div>
                <div className="py-1 hover:bg-sidebar-accent rounded px-2 cursor-pointer">
                  useEffect()
                </div>
              </div>
            </div>
          </div>
        );
      case 'inspector':
        return (
          <div className="p-4">
            <h3 className="font-medium text-sm uppercase tracking-wide text-sidebar-foreground/70 mb-4">
              Inspector
            </h3>
            <div className="space-y-3 text-sm">
              <div className="bg-card border border-border rounded p-3">
                <div className="font-medium mb-2">Element Properties</div>
                <div className="space-y-1 text-xs">
                  <div>className: "flex items-center"</div>
                  <div>id: "main-container"</div>
                  <div>style: "color: #333"</div>
                </div>
              </div>
              <div className="bg-card border border-border rounded p-3">
                <div className="font-medium mb-2">Computed Styles</div>
                <div className="space-y-1 text-xs">
                  <div>display: flex</div>
                  <div>align-items: center</div>
                  <div>margin: 0px</div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'docs':
        return (
          <div className="p-4">
            <h3 className="font-medium text-sm uppercase tracking-wide text-sidebar-foreground/70 mb-4">
              Documentation
            </h3>
            <div className="space-y-3 text-sm">
              <div className="bg-card border border-border rounded p-3">
                <div className="font-medium mb-2">React.useState</div>
                <div className="text-xs text-muted-foreground mb-2">
                  Returns a stateful value and a function to update it.
                </div>
                <code className="text-xs bg-muted p-1 rounded">
                  const [state, setState] = useState(initialState)
                </code>
              </div>
              <div className="bg-card border border-border rounded p-3">
                <div className="font-medium mb-2">useEffect</div>
                <div className="text-xs text-muted-foreground">
                  Accepts a function that contains imperative code.
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="p-4">
            <h3 className="font-medium text-sm uppercase tracking-wide text-sidebar-foreground/70 mb-4">
              {
                rightSidebarItems.find((item) => item.content === activePanel)
                  ?.label
              }
            </h3>
            <div className="text-sm text-muted-foreground">
              Content for {activePanel} panel would go here.
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-64 bg-sidebar border-l border-sidebar-border overflow-auto">
      {renderContent()}
    </div>
  );
};

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

const LeftSidebar = () => {
  const [activePanel, setActivePanel] = useState<string | null>(
    'file-explorer',
  );

  const handleIconClick = (content: string) => {
    if (activePanel === content) {
      setActivePanel(null);
    } else {
      setActivePanel(content);
    }
  };

  return (
    <div className="flex">
      {/* Icon Bar */}
      <div className="w-8 bg-sidebar border-r border-sidebar-border flex flex-col items-center py-2 space-y-3">
        {leftSidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePanel === item.content;

          return (
            <button
              key={item.id}
              onClick={() => handleIconClick(item.content)}
              className={`size-6 flex items-center justify-center rounded hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors group relative ${
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground'
              }`}
              title={item.label}
            >
              <Icon className="size-4" />
              {/* Tooltip */}
              <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                {item.label}
              </div>
            </button>
          );
        })}
      </div>

      {/* Panel Content */}
      <LeftSidebarPanel activePanel={activePanel} />
    </div>
  );
};

const RightSidebar = () => {
  const [activePanel, setActivePanel] = useState<string | null>('outline');

  const handleIconClick = (content: string) => {
    if (activePanel === content) {
      setActivePanel(null);
    } else {
      setActivePanel(content);
    }
  };

  return (
    <div className="flex">
      {/* Panel Content */}
      <RightSidebarPanel activePanel={activePanel} />

      {/* Icon Bar */}
      <div className="w-8 bg-sidebar border-l border-sidebar-border flex flex-col items-center py-2 space-y-3">
        {rightSidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePanel === item.content;

          return (
            <button
              key={item.id}
              onClick={() => handleIconClick(item.content)}
              className={`size-6 flex items-center justify-center rounded hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors group relative ${
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground'
              }`}
              title={item.label}
            >
              <Icon className="size-4" />
              {/* Tooltip */}
              <div className="absolute right-full mr-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                {item.label}
              </div>
            </button>
          );
        })}
      </div>
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

// Main Layout Component
export const StateView: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Create a ref to track layout changes and trigger Dockview resize
  const contentRef = React.useRef<HTMLDivElement>(null);

  // Use ResizeObserver to detect when the content area changes size
  React.useEffect(() => {
    if (!contentRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
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
      {/* Header */}
      <div className="h-5 border-b border-border flex items-center flex-shrink-0 gap-x-2">
        <h1 className="text-sm">File</h1>
        <h1 className="text-sm">View</h1>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <LeftSidebar />

        {/* Center Content */}
        <div className="flex-1 flex flex-col min-w-0" ref={contentRef}>
          {/* Editor Area */}
          <div className="flex-1 bg-background overflow-hidden">
            <div className="h-full w-full">{children}</div>
          </div>
        </div>

        {/* Right Sidebar */}
        <RightSidebar />
      </div>

      {/* Bottom Tools */}
      <Tools />
    </div>
  );
};

import { useState } from 'react';
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

const sidebarItems = [
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
  { id: 'terminal', icon: Terminal, label: 'Terminal', content: 'terminal' },
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
              <FolderOpen className="w-4 h-4 mr-2 text-blue-500" />
            ) : (
              <Folder className="w-4 h-4 mr-2 text-blue-500" />
            )}
          </>
        ) : (
          <>
            <div className="w-4 h-4 mr-2" />
            <File className="w-4 h-4 mr-2 text-gray-500" />
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

const PanelContent = ({ activePanel }: { activePanel: string | null }) => {
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
      case 'debug':
        return (
          <div className="p-4">
            <h3 className="font-medium text-sm uppercase tracking-wide text-sidebar-foreground/70 mb-4">
              Run and Debug
            </h3>
            <div className="space-y-3">
              <button className="w-full px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 flex items-center justify-center gap-2">
                <div className="w-0 h-0 border-l-4 border-l-white border-y-2 border-y-transparent"></div>
                Start Debugging
              </button>
              <div className="text-sm">
                <div className="font-medium mb-2">Breakpoints</div>
                <div className="text-muted-foreground text-xs">
                  No breakpoints set
                </div>
              </div>
              <div className="text-sm">
                <div className="font-medium mb-2">Call Stack</div>
                <div className="text-muted-foreground text-xs">
                  Not debugging
                </div>
              </div>
            </div>
          </div>
        );
      case 'extensions':
        return (
          <div className="p-4">
            <h3 className="font-medium text-sm uppercase tracking-wide text-sidebar-foreground/70 mb-4">
              Extensions
            </h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Search extensions..."
                className="w-full px-3 py-2 bg-input border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <div className="space-y-2">
                <div className="p-3 border border-border rounded bg-card">
                  <div className="font-medium text-sm">Prettier</div>
                  <div className="text-xs text-muted-foreground">
                    Code formatter
                  </div>
                  <button className="mt-2 px-2 py-1 bg-primary text-primary-foreground rounded text-xs">
                    Installed
                  </button>
                </div>
                <div className="p-3 border border-border rounded bg-card">
                  <div className="font-medium text-sm">ESLint</div>
                  <div className="text-xs text-muted-foreground">
                    Linting utility
                  </div>
                  <button className="mt-2 px-2 py-1 bg-primary text-primary-foreground rounded text-xs">
                    Installed
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="p-4">
            <h3 className="font-medium text-sm uppercase tracking-wide text-sidebar-foreground/70 mb-4">
              {sidebarItems.find((item) => item.content === activePanel)?.label}
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

export default function LeftSidebar() {
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
    <div className="flex h-screen bg-background text-foreground">
      {/* Icon Bar */}
      <div className="w-12 bg-sidebar border-r border-sidebar-border flex flex-col items-center py-2 space-y-1">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePanel === item.content;

          return (
            <button
              key={item.id}
              onClick={() => handleIconClick(item.content)}
              className={`w-8 h-8 flex items-center justify-center rounded hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors group relative ${
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground'
              }`}
              title={item.label}
            >
              <Icon className="w-4 h-4" />
              {/* Tooltip */}
              <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                {item.label}
              </div>
            </button>
          );
        })}
      </div>

      {/* Panel Content */}
      <PanelContent activePanel={activePanel} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-12 bg-card border-b border-border flex items-center px-4">
          <h1 className="text-lg font-semibold">JetBrains-Style IDE</h1>
        </div>

        {/* Editor Area */}
        <div className="flex-1 p-6 bg-background">
          <div className="h-full bg-card border border-border rounded-lg p-6 flex flex-col">
            <h2 className="text-xl font-semibold mb-4">Welcome to Your IDE</h2>
            <div className="flex-1 bg-muted rounded-lg p-4 font-mono text-sm">
              <div className="text-muted-foreground">
                // Your code editor would go here
              </div>
              <div className="mt-2">
                <span className="text-blue-600">import</span> React{' '}
                <span className="text-blue-600">from</span>{' '}
                <span className="text-green-600">'react'</span>;
              </div>
              <div className="mt-1">
                <span className="text-blue-600">export</span>{' '}
                <span className="text-blue-600">default</span>{' '}
                <span className="text-blue-600">function</span>{' '}
                <span className="text-yellow-600">App</span>() {'{'}
              </div>
              <div className="mt-1 ml-4">
                <span className="text-blue-600">return</span> (
              </div>
              <div className="mt-1 ml-8">
                &lt;<span className="text-red-600">div</span>&gt;Hello
                World&lt;/<span className="text-red-600">div</span>&gt;
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

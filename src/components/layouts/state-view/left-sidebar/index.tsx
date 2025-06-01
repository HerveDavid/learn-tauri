import { useState } from 'react';
import {
  Folder,
  ChevronRight,
  ChevronDown,
  File,
  FolderOpen,
} from 'lucide-react';
import EquipmentExplorer from '@/features/equipment-explorer';

const leftSidebarItems = [
  {
    id: 'equipment-explorer',
    icon: Folder,
    label: 'Explorer',
    content: EquipmentExplorer,
  },
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

  const activeItem = leftSidebarItems.find((item) => item.id === activePanel);

  if (!activeItem || !activeItem.content) {
    return (
      <div className="w-64 bg-sidebar border-r border-sidebar-border overflow-auto">
        <div className="p-4">
          <div className="text-sm text-muted-foreground">
            Panel not found: {activePanel}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border overflow-auto">
      <div className="flex items-center justify-between border-b py-2 px-2">
        <h3 className="font-medium text-xs uppercase tracking-wide text-sidebar-foreground/70">
          {activeItem.label}
        </h3>
      </div>
      <div className="p-4">{activeItem.content()}</div>
    </div>
  );
};

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
      {/* Icon Bar */}
      <div className="w-8 bg-sidebar border-r border-sidebar-border flex flex-col items-center py-2 space-y-3">
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
              {/* Tooltip */}
              <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                {item.label}
              </div>
            </button>
          );
        })}
      </div>

      <LeftSidebarPanel activePanel={activePanel} />
    </div>
  );
};

import { leftSidebarItems } from '@/config/layout';
import { useLeftSidebarStore } from '../stores/left-sidebar.store';

export const LeftSidebar = () => {
  const { activeItem, setActiveItem, isOpen, openPanel, closePanel } =
    useLeftSidebarStore();

  const handleIconClick = (itemId: string) => {
    setActiveItem(itemId);
    openPanel();
  };

  return (
    <div className="flex">
      <div className="w-8 bg-sidebar border-r flex flex-col items-center py-2 space-y-3">
        {leftSidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem.id === item.id;
          const handleClick = isOpen
            ? () => (isActive ? closePanel() : handleIconClick(item.id))
            : () => handleIconClick(item.id);

          return (
            <button
              key={item.id}
              onClick={handleClick}
              className={`size-5 flex items-center justify-center rounded hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors group relative ${
                isActive ? 'bg-muted' : 'text-sidebar-foreground'
              }`}
              title={item.label}
            >
              {/* {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
              )} */}
              <Icon className="size-4" />
              <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                {item.label}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

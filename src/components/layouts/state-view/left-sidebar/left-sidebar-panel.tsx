import { leftSidebarItems } from '@/config/layout';

export const LeftSidebarPanel = ({
  activePanel,
}: {
  activePanel: string | null;
}) => {
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

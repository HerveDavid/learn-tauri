import { toolsItems } from '@/config/layout';

export const ToolsPanel = ({ activePanel }: { activePanel: string | null }) => {
  if (!activePanel) return null;

  const activeItem = toolsItems.find((item) => item.id === activePanel);

  if (!activeItem || !activeItem.content) {
    return (
      <div className="bg-sidebar border-t border-sidebar-border overflow-auto">
        <div className="p-4">
          <div className="text-sm text-muted-foreground">
            Panel not found: {activePanel}
          </div>
        </div>
      </div>
    );
  }

  return <div className="p-4 h-full">{activeItem.content()}</div>;
};

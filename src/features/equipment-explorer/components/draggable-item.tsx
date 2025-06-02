import React from 'react';

interface DraggableItemProps {
  item: { name: string };
}

const DraggableItem: React.FC<DraggableItemProps> = ({ item }) => {
  const handleDragStart = (e: React.DragEvent<HTMLSpanElement>) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('application/json', JSON.stringify(item));
    e.dataTransfer.setData('text/plain', item.name);
  };

  return (
    <span
      draggable={true}
      className="cursor-pointer text-xs text-muted-foreground block p-2 border border-border rounded hover:bg-sidebar-accent"
      onDragStart={handleDragStart}
      tabIndex={-1}
    >
      {item.name}
    </span>
  );
};

export default DraggableItem;

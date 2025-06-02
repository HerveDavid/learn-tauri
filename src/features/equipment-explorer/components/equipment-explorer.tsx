import DraggableItem from './draggable-item';

interface FileItem {
  name: string;
}

const fileStructure: FileItem[] = [
  { name: 'src' },
  { name: 'public' },
  { name: 'package.json' },
  { name: 'README.md' },
  { name: 'components' },
  { name: 'utils' },
  { name: 'styles' },
  { name: 'assets' },
];

export const EquipmentExplorer = () => {
  return (
    <div className="h-full text-card-foreground">
      <div className="space-y-1 flex flex-col ">
        {fileStructure.map((item, index) => (
          <DraggableItem key={`${item.name}-${index}`} item={item} />
        ))}
      </div>
    </div>
  );
};

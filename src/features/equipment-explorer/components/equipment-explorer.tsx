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
    <div className="h-full p-4 text-card-foreground">
      <div className="space-y-2 flex flex-col mb-4">
        {fileStructure.map((item, index) => (
          <DraggableItem key={`${item.name}-${index}`} item={item} />
        ))}
      </div>
    </div>
  );
};

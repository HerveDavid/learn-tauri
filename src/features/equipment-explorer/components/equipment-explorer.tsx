import { FileTreeItem } from './file-tree-item';

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

export const EquipmentExplorer = () => {
  return (
    <div className="space-y-1">
      {fileStructure.map((item, index) => (
        <FileTreeItem key={index} item={item} />
      ))}
    </div>
  );
};

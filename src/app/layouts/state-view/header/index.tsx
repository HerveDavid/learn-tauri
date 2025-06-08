import Clock from '@/features/clock';

import FileDropdown from './file-dropdown';

export const Header = () => {
  return (
    <div className="w-full p-1 h-5 border-b flex items-center justify-between">
      <div className="flex gap-3">
        <FileDropdown />
        <h1 className="text-sm">View</h1>
      </div>
      <Clock />
    </div>
  );
};

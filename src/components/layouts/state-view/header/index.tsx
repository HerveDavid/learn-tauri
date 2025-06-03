import FileDropdown from "./file-dropdown";

export const Header = () => {
  return (
    <div className="p-1 h-5 border-b border-border flex items-center flex-shrink-0 gap-x-2">
      <FileDropdown />
      <h1 className="text-sm">View</h1>
    </div>
  );
};

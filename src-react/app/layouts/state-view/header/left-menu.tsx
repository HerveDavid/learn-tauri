import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Link } from '@/components/ui/link';

export const LeftMenu = () => {
  return (
    <div className="flex gap-3">
      <FileDropdown />
      <h1 className="text-sm">View</h1>
    </div>
  );
};

const FileDropdown = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="text-sm text-foreground hover:text-foreground-hover">
          File
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Project</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Link to={''}>Home</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link to={''}>Settings</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuLabel>Help</DropdownMenuLabel>
        <DropdownMenuItem>GitHub</DropdownMenuItem>
        <DropdownMenuItem>Support</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

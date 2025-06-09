import { Avatar } from '@/components/ui/avatar';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from '@/components/ui/menubar';
import { AvatarFallback } from '@radix-ui/react-avatar';
import { ChevronDown, MenuIcon } from 'lucide-react';

export const LeftMenu = () => {
  return (
    <div className="">
      <MenuDropdown />
    </div>
  );
};

const MenuDropdown = () => {
  return (
    <Menubar className="bg-transparent border-0 shadow-none text-xs p-0">
      <MenubarMenu>
        <MenubarTrigger className="bg-transparent" title="Menu">
          <MenuIcon className="size-4" />
        </MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            Open Project <MenubarShortcut>⌘O</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />

          <MenubarItem>
            New Project <MenubarShortcut>⌘T</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>New Window</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Settings</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Exit</MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger>
          <div className='flex gap-x-2'>
            <Avatar className='size-4 bg-green-600'>
              <AvatarFallback>SFJ</AvatarFallback>
            </Avatar>
            <p>Scenario for june</p>
            <ChevronDown className="size-4" />
          </div>
        </MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Open Project...</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};

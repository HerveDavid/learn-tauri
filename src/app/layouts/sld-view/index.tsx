import React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Sld } from '@/features/single-line-diagram';
import { RightSidebar, RightSidebarPanel } from './right-sidebar';
import { useRightSidebarStore } from './hooks/use-right-sidebar-store';

export interface SldViewProps {
  id: string;
}

export const SldView: React.FC<SldViewProps> = ({ id }) => {
  const { isOpen } = useRightSidebarStore(id);

  return (
    <div className="flex flex-col h-full">
      <header className="shadow-sm border-b bg-background">
        <Breadcrumb className="mx-2 py-2 text-sm">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>Components</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{id}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-hidden p-2">
          <Sld id={id} />
        </div>
        <RightSidebar id={id} />
        {isOpen && <RightSidebarPanel id={id} />}
      </div>
    </div>
  );
};

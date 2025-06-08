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

export interface SldViewProps {
  id: string;
}

export const SldView: React.FC<SldViewProps> = ({ id }) => {
  return (
    <div className="flex flex-col h-full">
      <header className="shadow-sm">
        <Breadcrumb className="mx-2 text-sm">
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
      
      <div className="flex-1 overflow-hidden">
        <Sld id={id} />
      </div>
    </div>
  );
};
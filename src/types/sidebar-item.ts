import { LucideProps } from 'lucide-react';

export interface SidebarItem {
  id: string;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
  >;
  label: string;
  content: () => JSX.Element;
}

import { IDockviewPanelProps } from 'dockview';

import { Sld } from '@/features/single-line-diagram';

export const DashboardComponents = {
  default: ({ params: { title } }: IDockviewPanelProps<{ title: string }>) => {
    return <>Default {title}</>;
  },
  sld: ({ params: { title } }: IDockviewPanelProps<{ title: string }>) => {
    return <Sld id={title} />;
  },
};

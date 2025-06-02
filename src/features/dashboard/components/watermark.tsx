import { IWatermarkPanelProps } from 'dockview';

export const Watermark = (_props: IWatermarkPanelProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full text-muted-foreground">
      <h1>Drag and drop equipment on this panel</h1>
    </div>
  );
};

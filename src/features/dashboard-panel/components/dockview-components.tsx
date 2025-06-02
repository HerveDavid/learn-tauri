import { IDockviewPanelProps } from 'dockview';

export const DockviewComponents = {
  default: (props: IDockviewPanelProps<{ title: string }>) => {
    return (
      <div className="p-5">
        <div>{props.params!.title}</div>
      </div>
    );
  },
};

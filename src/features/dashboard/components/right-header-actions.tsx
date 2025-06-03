import React from 'react';
import { IDockviewHeaderActionsProps } from 'dockview';
import { Expand, Maximize, Minimize, ScreenShare, Shrink } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useDashboardStore } from '@/stores/dashboard.store';

export const RightHeaderActions = (props: IDockviewHeaderActionsProps) => {
  const { detachPanel } = useDashboardStore();

  const [maximized, setMaximized] = React.useState<boolean>(
    props.api.isMaximized(),
  );

  const [groupCount, setGroupCount] = React.useState<number>(
    props.containerApi.size,
  );

  React.useEffect(() => {
    const disposable = props.containerApi.onDidMaximizedGroupChange(() => {
      setMaximized(props.api.isMaximized());
    });
    return () => {
      disposable.dispose();
    };
  }, [props.containerApi, props.api]);

  React.useEffect(() => {
    const updateGroupCount = () => {
      setGroupCount(props.containerApi.size);
    };

    const addDisposable = props.containerApi.onDidAddGroup(updateGroupCount);
    const removeDisposable =
      props.containerApi.onDidRemoveGroup(updateGroupCount);

    return () => {
      addDisposable.dispose();
      removeDisposable.dispose();
    };
  }, [props.containerApi]);

  const handleMaximizeToggle = () => {
    if (maximized) {
      props.api.exitMaximized();
    } else {
      props.api.maximize();
    }
  };

  const handleDetachPanel = () => {
    detachPanel(props.activePanel!.id);
  };

  const showMaximizeButton = groupCount > 1;

  return (
    <div className="h-full flex items-center px-2 gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDetachPanel}
        className="size-5 p-0 hover:bg-accent"
        title={'Detach group'}
      >
        <ScreenShare className="size-4" />
      </Button>
      {showMaximizeButton && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleMaximizeToggle}
          className="size-5 p-0 hover:bg-accent"
          title={maximized ? 'Restore group' : 'Maximize group'}
        >
          {maximized ? (
            <Minimize className="size-4" />
          ) : (
            <Maximize className="size-4" />
          )}
        </Button>
      )}
    </div>
  );
};

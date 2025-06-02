import { IDockviewHeaderActionsProps } from 'dockview';
import { Expand, ScreenShare, Shrink } from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';

export const RightHeaderActions = (props: IDockviewHeaderActionsProps) => {
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

  const showMaximizeButton = groupCount > 1;

  return (
    <div className="h-full flex items-center px-2 gap-2">
      <Button
        variant="ghost"
        size="sm"
        className="h-6 w-6 p-0 hover:bg-accent"
        title={'Detach'}
      >
        <ScreenShare className="size-4" />
      </Button>
      {showMaximizeButton && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleMaximizeToggle}
          className="h-6 w-6 p-0 hover:bg-accent"
          title={maximized ? 'Restore group' : 'Maximize group'}
        >
          {maximized ? (
            <Shrink className="size-4" />
          ) : (
            <Expand className="size-4" />
          )}
        </Button>
      )}
    </div>
  );
};

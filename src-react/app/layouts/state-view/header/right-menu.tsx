import { useEffect, useState } from 'react';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { WebviewWindow } from '@tauri-apps/api/webviewWindow';
import { Button } from '@/components/ui/button';
import { Minus, Square, X } from 'lucide-react';

export const RightMenu = () => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [appWindow, setAppWindow] = useState<WebviewWindow | null>(null);

  useEffect(() => {
    const initWindow = async () => {
      const window = getCurrentWindow() as WebviewWindow;
      setAppWindow(window);
      try {
        const maximized = await window.isMaximized();
        setIsMaximized(maximized);
      } catch (error) {
        // Handle error silently
      }
    };
    initWindow();
  }, []);

  const handleMinimize = async () => {
    if (appWindow) {
      try {
        await appWindow.minimize();
      } catch (error) {
        // Handle error silently
      }
    }
  };

  const handleMaximize = async () => {
    if (appWindow) {
      try {
        await appWindow.toggleMaximize();
        const maximized = await appWindow.isMaximized();
        setIsMaximized(maximized);
      } catch (error) {
        // Handle error silently
      }
    }
  };

  const handleClose = async () => {
    if (appWindow) {
      try {
        await appWindow.close();
      } catch (error) {
        // Handle error silently
      }
    }
  };

  return (
    <div className="flex items-center gap-x-4 mr-1">
      <Button
        variant="ghost"
        size="sm"
        className="size-5 p-2 rounded-full bg-muted/80"
        onClick={handleMinimize}
        title="Minimize"
      >
        <Minus className="size-3" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="size-5 p-2 rounded-full bg-muted/80"
        onClick={handleMaximize}
        title={isMaximized ? 'Restore' : 'Maximize'}
      >
        <Square className="size-3" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="size-5 p-2 rounded-full bg-muted/80"
        onClick={handleClose}
        title="Close"
      >
        <X className="size-3" />
      </Button>
    </div>
  );
};

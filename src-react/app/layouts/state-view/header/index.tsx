import React, { useEffect, useState } from 'react';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { WebviewWindow } from '@tauri-apps/api/webviewWindow';
import { CenterMenu } from './center-menu';
import { LeftMenu } from './left-menu';
import { RightMenu } from './right-menu';

export const Header = () => {
  const [_isMaximized, setIsMaximized] = useState(false);
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

  const handleDragStart = async (e: React.MouseEvent<HTMLDivElement>) => {
    // Check if the click comes from an interactive element
    const target = e.target as HTMLElement;
    const isInteractiveElement =
      target.closest('button') ||
      target.closest('[role="button"]') ||
      target.closest('select') ||
      target.closest('input') ||
      target.closest('[data-no-drag]');

    if (isInteractiveElement) {
      return;
    }

    if (appWindow && e.buttons === 1) {
      try {
        if (e.detail === 2) {
          await handleMaximize();
        } else {
          await appWindow.startDragging();
        }
      } catch (error) {
        // Handle error silently
      }
    }
  };

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className="w-full p-1 h-8 border-b flex items-center justify-between luxury-glass"
      onMouseDown={handleDragStart}
    >
      <div className="relative z-10" onMouseDown={stopPropagation}>
        <LeftMenu />
      </div>
      <div className="relative z-10" onMouseDown={stopPropagation}>
        <CenterMenu />
      </div>
      <div className="relative z-10" onMouseDown={stopPropagation}>
        <RightMenu />
      </div>
    </div>
  );
};

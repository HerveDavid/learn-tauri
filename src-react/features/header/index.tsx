import React, { useEffect, useState } from 'react';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { WebviewWindow } from '@tauri-apps/api/webviewWindow';
import { Button } from '@/components/ui/button';
import { Minus, Square, X, Menu } from 'lucide-react';

interface AppHeaderProps {
  title?: string;
  showMenu?: boolean;
  className?: string;
  onMenuClick?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ 
  title = "Mon Application Tauri",
  showMenu = true,
  className = "",
  onMenuClick
}) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [appWindow, setAppWindow] = useState<WebviewWindow | null>(null);

  useEffect(() => {
    const initWindow = async () => {
      const window = getCurrentWindow();
      setAppWindow(window);
      
      // Vérifier l'état initial de la fenêtre
      try {
        const maximized = await window.isMaximized();
        setIsMaximized(maximized);
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'état de la fenêtre:', error);
      }
    };

    initWindow();
  }, []);

  const handleMinimize = async () => {
    if (appWindow) {
      try {
        await appWindow.minimize();
      } catch (error) {
        console.error('Erreur lors de la minimisation:', error);
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
        console.error('Erreur lors de la maximisation:', error);
      }
    }
  };

  const handleClose = async () => {
    if (appWindow) {
      try {
        await appWindow.close();
      } catch (error) {
        console.error('Erreur lors de la fermeture:', error);
      }
    }
  };

  const handleDragStart = async (e: React.MouseEvent<HTMLDivElement>) => {
    if (appWindow && e.buttons === 1) {
      try {
        if (e.detail === 2) {
          // Double-clic pour maximiser/restaurer
          await handleMaximize();
        } else {
          // Simple clic pour déplacer
          await appWindow.startDragging();
        }
      } catch (error) {
        console.error('Erreur lors du déplacement:', error);
      }
    }
  };

  return (
    <div className={`
      flex items-center justify-between h-8 bg-background border-b border-border
      select-none top-0 left-0 right-0 z-50 ${className}
    `}>
      {/* Zone gauche - Menu et titre */}
      <div className="flex items-center h-full">
        {showMenu && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-accent/50"
            onClick={onMenuClick}
          >
            <Menu className="h-4 w-4" />
          </Button>
        )}
        
        {/* Zone de titre déplaçable */}
        <div
          className="flex-1 px-3 py-1 cursor-default hover:bg-accent/30 transition-colors h-full flex items-center"
          onMouseDown={handleDragStart}
        >
          <span className="text-sm font-medium text-foreground/80 truncate">
            {title}
          </span>
        </div>
      </div>

      {/* Zone droite - Contrôles de fenêtre */}
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-12 p-0 hover:bg-yellow-500/20 hover:text-yellow-600 rounded-none"
          onClick={handleMinimize}
          title="Minimiser"
        >
          <Minus className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-12 p-0 hover:bg-green-500/20 hover:text-green-600 rounded-none"
          onClick={handleMaximize}
          title={isMaximized ? "Restaurer" : "Maximiser"}
        >
          <Square className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-12 p-0 hover:bg-red-500/20 hover:text-red-600 rounded-none"
          onClick={handleClose}
          title="Fermer"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};


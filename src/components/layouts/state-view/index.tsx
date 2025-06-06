import React, { useEffect } from 'react';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { Footer } from './footer';
import { Header } from './header';
import {
  LeftSidebar,
  LeftSidebarPanel,
  useLeftSidebarStore,
} from './left-sidebar';
import {
  RightSidebar,
  RightSidebarPanel,
  useRightSidebarStore,
} from './right-sidebar';
import { Tools } from './tools';

export const StateView: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isOpen: isLeftOpen } = useLeftSidebarStore();
  const { isOpen: isRightOpen } = useRightSidebarStore();

  // Create a ref to track layout changes and trigger Dockview resize
  const contentRef = React.useRef<HTMLDivElement>(null);

  // Use ResizeObserver to detect when the content area changes size
  useEffect(() => {
    if (!contentRef.current) return;

    const resizeObserver = new ResizeObserver((_entries) => {
      // Trigger a global resize event that Dockview will listen to
      window.dispatchEvent(new Event('resize'));
    });

    resizeObserver.observe(contentRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div className="h-screen w-screen bg-background text-foreground flex flex-col">
      <Header />
      <div className="flex flex-1">
        <LeftSidebar />
        <ResizablePanelGroup
          className="flex flex-1 flex-col"
          direction="vertical"
        >
          <ResizablePanel className="flex flex-1">
            <ResizablePanelGroup direction="horizontal">
              {isLeftOpen && (
                <>
                  <ResizablePanel
                    id="left-sidebar"
                    order={1}
                    defaultSize={isRightOpen ? 25 : 30}
                    minSize={15}
                  >
                    <LeftSidebarPanel />
                  </ResizablePanel>
                  <ResizableHandle />
                </>
              )}

              <ResizablePanel
                id="main-content"
                order={2}
                defaultSize={
                  isLeftOpen && isRightOpen
                    ? 50
                    : isLeftOpen || isRightOpen
                      ? 70
                      : 100
                }
                minSize={30}
              >
                <div ref={contentRef} className="h-full">
                  {children}
                </div>
              </ResizablePanel>

              {isRightOpen && (
                <>
                  <ResizableHandle />
                  <ResizablePanel
                    id="right-sidebar"
                    order={3}
                    defaultSize={isLeftOpen ? 25 : 30}
                    minSize={15}
                  >
                    <RightSidebarPanel />
                  </ResizablePanel>
                </>
              )}
            </ResizablePanelGroup>
          </ResizablePanel>

          <ResizableHandle />

          <ResizablePanel defaultSize={30} minSize={20}>
            <Tools />
          </ResizablePanel>
        </ResizablePanelGroup>
        <RightSidebar />
      </div>
      <Footer />
    </div>
  );
};

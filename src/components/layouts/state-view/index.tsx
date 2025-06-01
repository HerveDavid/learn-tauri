import React, { useEffect } from 'react';

import { Footer } from './footer';
import { Header } from './header';
import { LeftSidebar } from './left-sidebar';
import { RightSidebar } from './right-sidebar';
import { Tools } from './tools';

export const StateView: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
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
    <div className="h-screen bg-background text-foreground flex flex-col">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        <LeftSidebar />

        <div className="flex-1 flex flex-col min-w-0" ref={contentRef}>
          <div className="flex-1 bg-background overflow-hidden">
            <div className="h-full w-full">{children}</div>
          </div>

          <Tools />
        </div>

        <RightSidebar />
      </div>

      <Footer />
    </div>
  );
};

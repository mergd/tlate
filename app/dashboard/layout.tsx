"use client";

import { Authenticated, Unauthenticated } from "convex/react";
import { Button } from "@/components/ui/button";
import { TabbedSidebar } from "@/components/dashboard/TabbedSidebar";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);

  return (
    <>
      <Authenticated>
        <div className="h-screen bg-background flex">
          <PanelGroup direction="horizontal">
            {/* Sidebar */}
            <Panel 
              defaultSize={isSidebarCollapsed ? 3 : 20} 
              minSize={isSidebarCollapsed ? 3 : 15} 
              maxSize={isSidebarCollapsed ? 3 : 40}
              className="relative z-10"
              onMouseEnter={() => isSidebarCollapsed && setIsSidebarHovered(true)}
              onMouseLeave={() => isSidebarCollapsed && setIsSidebarHovered(false)}
            >
              <TabbedSidebar 
                isCollapsed={isSidebarCollapsed}
                onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                isHovered={isSidebarHovered}
              />
            </Panel>
            
            {!isSidebarCollapsed && (
              <PanelResizeHandle className="w-1 bg-border hover:bg-accent transition-colors" />
            )}
          
            {/* Main Content Area */}
            <Panel defaultSize={isSidebarCollapsed ? 97 : 80} minSize={60}>
              {!isChatOpen ? (
                /* Full Width Main Content */
                <div className="h-full overflow-hidden">
                  {children}
                </div>
              ) : (
                /* Split View with Chat */
                <PanelGroup direction="horizontal">
                  <Panel defaultSize={70} minSize={50}>
                    <div className="h-full overflow-hidden">
                      {children}
                    </div>
                  </Panel>
                  
                  <PanelResizeHandle className="w-2 bg-border hover:bg-accent transition-colors" />
                  
                  <Panel defaultSize={30} minSize={25} maxSize={50}>
                    <ChatInterface onClose={() => setIsChatOpen(false)} />
                  </Panel>
                </PanelGroup>
              )}
            </Panel>
          </PanelGroup>
        </div>
      </Authenticated>
      
      <Unauthenticated>
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="max-w-md w-full space-y-8 p-8">
            <div className="text-center">
              <h2 className="mt-6 text-3xl font-bold text-foreground">
                Welcome to TLate
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Professional document translation with AI
              </p>
            </div>
            <div className="space-y-4">
              <Button 
                onClick={() => window.location.href = "/signin"}
                className="w-full"
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </Unauthenticated>
    </>
  );
}
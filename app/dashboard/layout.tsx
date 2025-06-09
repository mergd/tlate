"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { Authenticated, Unauthenticated } from "convex/react";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { signOut } = useAuthActions();
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      <Authenticated>
        <div className="h-screen bg-background">
          <PanelGroup direction="horizontal">
            {/* Sidebar */}
            <Panel defaultSize={20} minSize={15} maxSize={30}>
              <Sidebar onToggleChat={() => setIsChatOpen(!isChatOpen)} />
            </Panel>
            
            <PanelResizeHandle className="w-2 bg-border hover:bg-accent transition-colors" />
            
            {/* Main Content */}
            <Panel defaultSize={isChatOpen ? 50 : 80}>
              <div className="h-full overflow-hidden">
                {children}
              </div>
            </Panel>
            
            {/* Chat Panel */}
            {isChatOpen && (
              <>
                <PanelResizeHandle className="w-2 bg-border hover:bg-accent transition-colors" />
                <Panel defaultSize={30} minSize={25} maxSize={40}>
                  <ChatInterface onClose={() => setIsChatOpen(false)} />
                </Panel>
              </>
            )}
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
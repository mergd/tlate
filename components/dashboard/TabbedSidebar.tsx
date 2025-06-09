"use client";

import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsContent } from "@/components/ui/tabs";
import { CommandPalette } from "@/components/ui/command-palette";
import { 
  FolderPlus, 
  Search, 
  Settings,
  ChevronLeft,
  ChevronRight,
  FolderOpen,
  MessageSquare
} from "lucide-react";
import { CreateProjectDialog } from "./CreateProjectDialog";
import { ProjectList } from "./ProjectList";
import { AIChatContent } from "../chat/AIChatContent";

interface TabbedSidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  isHovered?: boolean;
}

export function TabbedSidebar({ 
  isCollapsed = false, 
  onToggleCollapse, 
  isHovered = false 
}: TabbedSidebarProps) {
  const router = useRouter();
  const params = useParams();
  const [activeTab, setActiveTab] = useState("projects");
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  
  const showContent = !isCollapsed || isHovered;
  const shouldShowShadow = isCollapsed && isHovered;
  
  const projects = useQuery(api.projects.list);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey)) {
        switch (e.key) {
          case 'k':
            e.preventDefault();
            setIsCommandPaletteOpen(true);
            break;
          case 'l':
            e.preventDefault();
            setActiveTab("chat");
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const tabItems = [
    {
      value: "projects",
      label: showContent ? "Projects" : "",
      icon: <FolderOpen className="h-4 w-4" />
    },
    {
      value: "chat", 
      label: showContent ? "AI Chat" : "",
      icon: <MessageSquare className="h-4 w-4" />
    }
  ];

  return (
    <div 
      className={`h-full bg-background border-r border-border flex flex-col transition-all duration-300 ${
        shouldShowShadow ? 'shadow-lg' : ''
      }`}
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
        {/* Header */}
        <div className="px-3 py-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            {showContent && (
              <h1 className="text-lg font-serif font-medium text-foreground">TLate</h1>
            )}
            <div className="flex items-center gap-1">
              {onToggleCollapse && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onToggleCollapse}
                  className="h-7 w-7"
                >
                  {isCollapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
                </Button>
              )}
            </div>
          </div>
          
          {/* Search */}
          {showContent ? (
            <div className="mb-3">
              <Button
                variant="outline"
                className="w-full justify-start text-muted-foreground h-8"
                onClick={() => setIsCommandPaletteOpen(true)}
              >
                <Search className="h-3.5 w-3.5 mr-2" />
                <span className="flex-1 text-left">Search...</span>
                <span className="text-xs">⌘K</span>
              </Button>
            </div>
          ) : (
            <div className="mb-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCommandPaletteOpen(true)}
                className="h-8 w-8"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          {/* Tab Navigation */}
          {showContent ? (
            <TabsList
              items={tabItems}
              defaultValue={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            />
          ) : (
            <div className="flex flex-col gap-2">
              <Button
                variant={activeTab === "projects" ? "default" : "ghost"}
                size="icon"
                onClick={() => setActiveTab("projects")}
                className="h-8 w-8"
              >
                <FolderOpen className="h-4 w-4" />
              </Button>
              <Button
                variant={activeTab === "chat" ? "default" : "ghost"}
                size="icon"
                onClick={() => setActiveTab("chat")}
                className="h-8 w-8"
              >
                <MessageSquare className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-hidden">
          <TabsContent value="projects" className="h-full flex flex-col m-0 mt-0">
            {/* Actions */}
            <div className="px-3 py-3 border-b border-border">
              {showContent ? (
                <Button
                  onClick={() => setIsCreateProjectOpen(true)}
                  className="w-full justify-start h-8"
                  variant="outline"
                  size="sm"
                >
                  <FolderPlus className="h-3.5 w-3.5" />
                  <span className="ml-2 text-sm">New Project</span>
                </Button>
              ) : (
                <Button
                  onClick={() => setIsCreateProjectOpen(true)}
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                >
                  <FolderPlus className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>

            {/* Projects List */}
            <div className="flex-1 overflow-auto px-3">
              {showContent && (
                <div className="mb-2">
                  <h2 className="text-xs font-serif font-medium text-muted-foreground uppercase tracking-wider mb-2">Projects</h2>
                </div>
              )}
              <ProjectList projects={projects || []} isCollapsed={isCollapsed && !isHovered} />
            </div>

            {/* Footer */}
            <div className="px-3 py-3 border-t border-border">
              {showContent ? (
                <Button
                  variant="ghost"
                  className="w-full justify-start h-8"
                  size="sm"
                  onClick={() => router.push("/settings")}
                >
                  <Settings className="h-3.5 w-3.5" />
                  <span className="ml-2 text-sm">Settings</span>
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.push("/settings")}
                  className="h-8 w-8"
                >
                  <Settings className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          </TabsContent>

          <TabsContent value="chat" className="h-full m-0 mt-0">
            <AIChatContent
              documentId={params.documentId as string}
              projectId={params.projectId as string}
              isCollapsed={isCollapsed && !isHovered}
              showContent={showContent}
              isActiveTab={activeTab === "chat"}
            />
          </TabsContent>
        </div>
      </Tabs>

      <CreateProjectDialog
        open={isCreateProjectOpen}
        onOpenChange={setIsCreateProjectOpen}
      />
      
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onOpenChange={setIsCommandPaletteOpen}
      />
    </div>
  );
}
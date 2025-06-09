"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  FolderPlus, 
  Search, 
  MessageSquare, 
  Settings,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { CreateProjectDialog } from "./CreateProjectDialog";
import { ProjectList } from "./ProjectList";
import { useRouter } from "next/navigation";

interface SidebarProps {
  onToggleChat: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  isHovered?: boolean;
}

export function Sidebar({ onToggleChat, isCollapsed = false, onToggleCollapse, isHovered = false }: SidebarProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const showContent = !isCollapsed || isHovered;
  const shouldShowShadow = isCollapsed && isHovered;
  
  const projects = useQuery(api.projects.list);
  const searchResults = useQuery(
    api.projects.search, 
    searchQuery ? { query: searchQuery } : "skip"
  );

  const displayProjects = searchQuery ? searchResults : projects;

  return (
    <div 
      className={`h-full bg-background border-r border-border flex flex-col transition-all duration-300 ${
        shouldShowShadow ? 'shadow-lg' : ''
      }`}
    >
      {/* Header */}
      <div className="px-3 py-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          {showContent && (
            <h1 className="text-lg font-serif font-medium text-foreground">TLate</h1>
          )}
          <div className="flex items-center gap-1">
            {showContent && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleChat}
                className="h-7 w-7"
              >
                <MessageSquare className="h-3.5 w-3.5" />
              </Button>
            )}
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
        {showContent && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-8 text-sm"
            />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-3 py-3">
        <Button
          onClick={() => setIsCreateProjectOpen(true)}
          className={`${showContent ? 'w-full justify-start' : 'w-full justify-center'} h-8`}
          variant="outline"
          size="sm"
        >
          <FolderPlus className="h-3.5 w-3.5" />
          {showContent && <span className="ml-2 text-sm">New Project</span>}
        </Button>
      </div>

      {/* Projects List */}
      <div className="flex-1 overflow-auto px-3">
        {showContent && (
          <div className="mb-2">
            <h2 className="text-xs font-serif font-medium text-muted-foreground uppercase tracking-wider mb-2">Projects</h2>
          </div>
        )}
        <ProjectList projects={displayProjects || []} isCollapsed={isCollapsed && !isHovered} />
      </div>

      {/* Footer */}
      <div className="px-3 py-3 border-t border-border">
        <Button
          variant="ghost"
          className={`${showContent ? 'w-full justify-start' : 'w-full justify-center'} h-8`}
          size="sm"
          onClick={() => router.push("/settings")}
        >
          <Settings className="h-3.5 w-3.5" />
          {showContent && <span className="ml-2 text-sm">Settings</span>}
        </Button>
      </div>

      <CreateProjectDialog
        open={isCreateProjectOpen}
        onOpenChange={setIsCreateProjectOpen}
      />
    </div>
  );
}
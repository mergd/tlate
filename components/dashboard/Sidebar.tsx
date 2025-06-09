"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  FolderPlus, 
  FileText, 
  Search, 
  MessageSquare, 
  Settings,
  Plus
} from "lucide-react";
import { CreateProjectDialog } from "./CreateProjectDialog";
import { ProjectList } from "./ProjectList";

interface SidebarProps {
  onToggleChat: () => void;
}

export function Sidebar({ onToggleChat }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  
  const projects = useQuery(api.projects.list);
  const searchResults = useQuery(
    api.projects.search, 
    searchQuery ? { query: searchQuery } : "skip"
  );

  const displayProjects = searchQuery ? searchResults : projects;

  return (
    <div className="h-full bg-background border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-foreground">TLate</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleChat}
            className="h-8 w-8"
          >
            <MessageSquare className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 space-y-2">
        <Button
          onClick={() => setIsCreateProjectOpen(true)}
          className="w-full justify-start"
          variant="outline"
        >
          <FolderPlus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Projects List */}
      <div className="flex-1 overflow-auto">
        <ProjectList projects={displayProjects || []} />
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          className="w-full justify-start"
        >
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </div>

      <CreateProjectDialog
        open={isCreateProjectOpen}
        onOpenChange={setIsCreateProjectOpen}
      />
    </div>
  );
}
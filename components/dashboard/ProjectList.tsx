"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { 
  FolderOpen, 
  FileText, 
  MoreHorizontal,
  Plus
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface Project {
  _id: string;
  name: string;
  description?: string;
  sourceLanguage: string;
  targetLanguage: string;
  createdAt: number;
  updatedAt: number;
}

interface ProjectListProps {
  projects: Project[];
  isCollapsed?: boolean;
}

export function ProjectList({ projects, isCollapsed = false }: ProjectListProps) {
  const router = useRouter();
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());

  const toggleProject = (projectId: string) => {
    const newExpanded = new Set(expandedProjects);
    if (newExpanded.has(projectId)) {
      newExpanded.delete(projectId);
    } else {
      newExpanded.add(projectId);
    }
    setExpandedProjects(newExpanded);
  };

  if (!projects.length) {
    if (isCollapsed) {
      return (
        <div className="text-center text-muted-foreground py-4">
          <FolderOpen className="h-4 w-4 mx-auto opacity-50" />
        </div>
      );
    }
    return (
      <div className="text-center text-muted-foreground py-4">
        <FolderOpen className="h-6 w-6 mx-auto mb-2 opacity-50" />
        <p className="text-xs">No projects yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {projects.map((project) => (
        <ProjectItem
          key={project._id}
          project={project}
          isExpanded={expandedProjects.has(project._id) && !isCollapsed}
          onToggle={() => toggleProject(project._id)}
          onNavigate={(path) => router.push(path)}
          isCollapsed={isCollapsed}
        />
      ))}
    </div>
  );
}

interface ProjectItemProps {
  project: Project;
  isExpanded: boolean;
  onToggle: () => void;
  onNavigate: (path: string) => void;
  isCollapsed?: boolean;
}

function ProjectItem({ project, isExpanded, onToggle, onNavigate, isCollapsed = false }: ProjectItemProps) {
  const documents = useQuery(api.documents.listByProject, { projectId: project._id as Id<"projects"> });

  return (
    <div className="group">
      <div
        className={`flex items-center justify-between p-2 rounded-md hover:bg-accent cursor-pointer ${
          isCollapsed ? 'justify-center' : ''
        }`}
        onClick={isCollapsed ? () => onNavigate(`/dashboard/projects/${project._id}`) : onToggle}
      >
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-2 flex-1 min-w-0'}`}>
          <FolderOpen className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground truncate">
                {project.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {project.sourceLanguage} → {project.targetLanguage}
              </p>
            </div>
          )}
        </div>
        
        {!isCollapsed && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100">
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onNavigate(`/dashboard/projects/${project._id}`)}>
                Open Project
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onNavigate(`/dashboard/projects/${project._id}/settings`)}>
                Settings
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {isExpanded && (
        <div className="ml-6 space-y-1">
          {documents?.map((doc) => (
            <div
              key={doc._id}
              className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent cursor-pointer group/doc"
              onClick={() => onNavigate(`/dashboard/projects/${project._id}/documents/${doc._id}`)}
            >
              <FileText className="h-3 w-3 text-muted-foreground" />
              <span className="text-sm text-foreground truncate flex-1">
                {doc.title}
              </span>
            </div>
          ))}
          
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start h-8 text-xs"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate(`/dashboard/projects/${project._id}/new-document`);
            }}
          >
            <Plus className="h-3 w-3 mr-1" />
            New Document
          </Button>
        </div>
      )}
    </div>
  );
}
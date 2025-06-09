"use client";

import { use } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileText, 
  Plus, 
  Settings, 
  Languages,
  Clock,
  ArrowLeft
} from "lucide-react";
import { useRouter } from "next/navigation";

interface ProjectPageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const project = useQuery(api.projects.get, { 
    id: resolvedParams.projectId as Id<"projects"> 
  });
  const documents = useQuery(api.documents.listByProject, { 
    projectId: resolvedParams.projectId as Id<"projects"> 
  });

  if (project === undefined || documents === undefined) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading project...</p>
        </div>
      </div>
    );
  }

  if (project === null) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground mb-2">Project not found</h2>
          <p className="text-muted-foreground mb-4">The project you&apos;re looking for doesn&apos;t exist.</p>
          <Button onClick={() => router.push("/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/dashboard")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{project.name}</h1>
              <p className="text-muted-foreground flex items-center mt-1">
                <Languages className="h-4 w-4 mr-2" />
                {project.sourceLanguage} → {project.targetLanguage}
              </p>
              {project.description && (
                <p className="text-muted-foreground mt-2">{project.description}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => router.push(`/dashboard/projects/${resolvedParams.projectId}/new-document`)}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Document
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push(`/dashboard/projects/${resolvedParams.projectId}/settings`)}
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Documents
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{documents?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                Documents in this project
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Created
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Date(project.createdAt).toLocaleDateString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Project creation date
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Last Updated
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Date(project.updatedAt).toLocaleDateString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Most recent activity
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Documents */}
        <Card>
          <CardHeader>
            <CardTitle>Documents</CardTitle>
            <CardDescription>
              Manage your translation documents for this project
            </CardDescription>
          </CardHeader>
          <CardContent>
            {documents && documents.length > 0 ? (
              <div className="space-y-3">
                {documents.map((document) => (
                  <div
                    key={document._id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                    onClick={() => router.push(`/dashboard/projects/${resolvedParams.projectId}/documents/${document._id}`)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <FileText className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">{document.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          Updated {new Date(document.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">
                        {document.currentVersionId ? 'Has content' : 'Empty'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No documents yet
                </h3>
                <p className="text-muted-foreground mb-4">
                  Create your first document to start translating
                </p>
                <Button
                  onClick={() => router.push(`/dashboard/projects/${resolvedParams.projectId}/new-document`)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Document
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
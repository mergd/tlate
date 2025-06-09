"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText } from "lucide-react";

interface NewDocumentPageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export default function NewDocumentPage({ params }: NewDocumentPageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  
  const project = useQuery(api.projects.get, { 
    id: resolvedParams.projectId as Id<"projects"> 
  });
  const createDocument = useMutation(api.documents.create);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isCreating) return;

    setIsCreating(true);
    try {
      const documentId = await createDocument({
        title: title.trim(),
        projectId: resolvedParams.projectId as Id<"projects">,
        content: "# " + title.trim() + "\n\nStart writing your document here...",
      });
      
      router.push(`/dashboard/projects/${resolvedParams.projectId}/documents/${documentId}`);
    } catch (error) {
      console.error("Failed to create document:", error);
    } finally {
      setIsCreating(false);
    }
  };

  if (project === undefined) {
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
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/dashboard/projects/${resolvedParams.projectId}`)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Project
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">New Document</h1>
            <p className="text-muted-foreground">Create a new document in {project.name}</p>
          </div>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Document Details
            </CardTitle>
            <CardDescription>
              Enter the details for your new translation document.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Document Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter document title"
                  required
                  autoFocus
                />
              </div>
              
              <div className="space-y-2">
                <Label>Project</Label>
                <div className="p-3 bg-muted rounded-md">
                  <p className="font-medium text-foreground">{project.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {project.sourceLanguage} → {project.targetLanguage}
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(`/dashboard/projects/${resolvedParams.projectId}`)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!title.trim() || isCreating}
                >
                  {isCreating ? "Creating..." : "Create Document"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
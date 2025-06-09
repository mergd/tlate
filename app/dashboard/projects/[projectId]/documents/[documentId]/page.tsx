"use client";

import { use } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { DocumentEditor } from "@/components/editor/DocumentEditor";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Settings, History } from "lucide-react";
import { useRouter } from "next/navigation";

interface DocumentPageProps {
  params: Promise<{
    projectId: string;
    documentId: string;
  }>;
}

export default function DocumentPage({ params }: DocumentPageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const document = useQuery(api.documents.get, { 
    id: resolvedParams.documentId as Id<"documents"> 
  });
  const project = useQuery(api.projects.get, { 
    id: resolvedParams.projectId as Id<"projects"> 
  });

  if (document === undefined || project === undefined) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading document...</p>
        </div>
      </div>
    );
  }

  if (document === null || project === null) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground mb-2">Document not found</h2>
          <p className="text-muted-foreground mb-4">The document you&apos;re looking for doesn&apos;t exist.</p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-border p-4">
        <div className="flex items-center justify-between">
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
              <h1 className="text-xl font-bold text-foreground">{document.title}</h1>
              <p className="text-sm text-muted-foreground">
                {project.name} • {project.sourceLanguage} → {project.targetLanguage}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/dashboard/projects/${resolvedParams.projectId}/documents/${resolvedParams.documentId}/versions`)}
            >
              <History className="h-4 w-4 mr-2" />
              Versions
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/dashboard/projects/${resolvedParams.projectId}/documents/${resolvedParams.documentId}/settings`)}
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1">
        <DocumentEditor
          documentId={resolvedParams.documentId}
          initialContent={document.currentVersion?.content || ''}
          initialTranslatedContent={document.currentVersion?.translatedContent || ''}
          onSave={(content, translatedContent) => {
            console.log('Document saved:', { content, translatedContent });
          }}
        />
      </div>
    </div>
  );
}
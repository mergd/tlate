"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { DocumentEditor } from "@/components/editor/DocumentEditor";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Settings, History } from "lucide-react";
import { useRouter } from "next/navigation";

interface DocumentPageProps {
  params: {
    projectId: string;
    documentId: string;
  };
}

export default function DocumentPage({ params }: DocumentPageProps) {
  const router = useRouter();
  const document = useQuery(api.documents.get, { 
    id: params.documentId as any 
  });
  const project = useQuery(api.projects.get, { 
    id: params.projectId as any 
  });

  if (document === undefined || project === undefined) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading document...</p>
        </div>
      </div>
    );
  }

  if (document === null || project === null) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Document not found</h2>
          <p className="text-gray-600 mb-4">The document you're looking for doesn't exist.</p>
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
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/dashboard/projects/${params.projectId}`)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Project
            </Button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{document.title}</h1>
              <p className="text-sm text-gray-500">
                {project.name} • {project.sourceLanguage} → {project.targetLanguage}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/dashboard/projects/${params.projectId}/documents/${params.documentId}/versions`)}
            >
              <History className="h-4 w-4 mr-2" />
              Versions
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/dashboard/projects/${params.projectId}/documents/${params.documentId}/settings`)}
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
          documentId={params.documentId}
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
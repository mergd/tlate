"use client";

import { use, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { DocumentEditor } from "@/components/editor/DocumentEditor";
import { EditableTitle } from "@/components/editor/EditableTitle";
import { DocumentVersionsDialog } from "@/components/editor/DocumentVersionsDialog";
import { DocumentSettingsDialog } from "@/components/editor/DocumentSettingsDialog";
import { DictionaryPanel } from "@/components/dictionary/DictionaryPanel";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Settings, History, BookOpen } from "lucide-react";
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
  const [isVersionsDialogOpen, setIsVersionsDialogOpen] = useState(false);
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);
  const [isDictionaryOpen, setIsDictionaryOpen] = useState(false);
  
  const document = useQuery(api.documents.get, { 
    id: resolvedParams.documentId as Id<"documents"> 
  });
  const project = useQuery(api.projects.get, { 
    id: resolvedParams.projectId as Id<"projects"> 
  });
  
  const updateDocument = useMutation(api.documents.update);

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
              <ArrowLeft className="h-3.5 w-3.5 mr-1" />
              Back
            </Button>
            <div>
              <EditableTitle
                title={document.title}
                onSave={(newTitle) => updateDocument({ 
                  id: document._id, 
                  title: newTitle 
                })}
                className="text-xl font-bold text-foreground"
                placeholder="Untitled Document"
              />
              <p className="text-sm text-muted-foreground">
                {project.name} • {project.sourceLanguage} → {project.targetLanguage}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDictionaryOpen(!isDictionaryOpen)}
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Dictionary
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsVersionsDialogOpen(true)}
            >
              <History className="h-4 w-4 mr-2" />
              Versions
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSettingsDialogOpen(true)}
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex">
        {/* Dictionary Panel */}
        {isDictionaryOpen && (
          <div className="w-80 border-r border-border overflow-y-auto">
            <DictionaryPanel 
              projectId={resolvedParams.projectId}
              className="m-4"
            />
          </div>
        )}
        
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

      {/* Dialogs */}
      <DocumentVersionsDialog
        open={isVersionsDialogOpen}
        onOpenChange={setIsVersionsDialogOpen}
        documentId={resolvedParams.documentId}
        onSelectVersion={(versionId) => {
          // TODO: Implement version restoration
          console.log('Restore version:', versionId);
        }}
      />

      <DocumentSettingsDialog
        open={isSettingsDialogOpen}
        onOpenChange={setIsSettingsDialogOpen}
        documentId={resolvedParams.documentId}
      />
    </div>
  );
}
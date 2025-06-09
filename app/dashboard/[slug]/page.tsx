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

interface SlugPageProps {
  params: Promise<{
    slug: string;
  }>;
}

function parseSlug(slug: string): { projectId: string; documentId?: string } {
  // Handle URLs like: project-id+document-id or just project-id
  const parts = slug.split('+');
  return {
    projectId: parts[0],
    documentId: parts[1]
  };
}

export default function SlugPage({ params }: SlugPageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { projectId, documentId } = parseSlug(resolvedParams.slug);
  
  const [isVersionsDialogOpen, setIsVersionsDialogOpen] = useState(false);
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);
  const [isDictionaryOpen, setIsDictionaryOpen] = useState(false);
  
  const project = useQuery(api.projects.get, { 
    id: projectId as Id<"projects"> 
  });
  
  const document = useQuery(
    api.documents.get,
    documentId ? { id: documentId as Id<"documents"> } : "skip"
  );
  
  const documents = useQuery(api.documents.listByProject, {
    projectId: projectId as Id<"projects">
  });
  
  const updateDocument = useMutation(api.documents.update);

  if (project === undefined || (documentId && document === undefined)) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (project === null || (documentId && document === null)) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground mb-2">Not found</h2>
          <p className="text-muted-foreground mb-4">The item you&apos;re looking for doesn&apos;t exist.</p>
          <Button onClick={() => router.push('/dashboard')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // If no document ID, show project view with document list
  if (!documentId) {
    return (
      <div className="h-full flex flex-col">
        {/* Project Header */}
        <div className="border-b border-border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/dashboard')}
              >
                <ArrowLeft className="h-3.5 w-3.5 mr-1" />
                Dashboard
              </Button>
              <div>
                <h1 className="text-xl font-bold text-foreground">{project.name}</h1>
                <p className="text-sm text-muted-foreground">
                  {project.sourceLanguage} → {project.targetLanguage}
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
            </div>
          </div>
        </div>

        {/* Project Content */}
        <div className="flex-1 flex">
          {isDictionaryOpen && (
            <div className="w-80 border-r border-border overflow-y-auto">
              <DictionaryPanel 
                projectId={projectId}
                className="m-4"
              />
            </div>
          )}
          
          <div className="flex-1 p-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-lg font-serif font-medium mb-4">Documents</h2>
              
              {documents && documents.length > 0 ? (
                <div className="grid gap-4">
                  {documents.map((doc) => (
                    <div
                      key={doc._id}
                      className="border border-border rounded-lg p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => router.push(`/dashboard/${projectId}+${doc._id}`)}
                    >
                      <h3 className="font-medium">{doc.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Updated {new Date(doc.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">No documents yet</p>
                  <Button onClick={() => router.push(`/dashboard/${projectId}/new-document`)}>
                    Create First Document
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Document view
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/dashboard/${projectId}`)}
            >
              <ArrowLeft className="h-3.5 w-3.5 mr-1" />
              Back
            </Button>
            <div>
              <EditableTitle
                title={document?.title || 'Untitled Document'}
                onSave={(newTitle) => updateDocument({ 
                  id: document!._id, 
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
              projectId={projectId}
              className="m-4"
            />
          </div>
        )}
        
        {/* Editor */}
        <div className="flex-1">
          <DocumentEditor
            documentId={documentId}
            initialContent={document?.currentVersion?.content || ''}
            initialTranslatedContent={document?.currentVersion?.translatedContent || ''}
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
        documentId={documentId}
        onSelectVersion={(versionId) => {
          // TODO: Implement version restoration
          console.log('Restore version:', versionId);
        }}
      />

      <DocumentSettingsDialog
        open={isSettingsDialogOpen}
        onOpenChange={setIsSettingsDialogOpen}
        documentId={documentId}
      />
    </div>
  );
}
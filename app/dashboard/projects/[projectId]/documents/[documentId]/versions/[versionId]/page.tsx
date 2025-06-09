"use client";

import { use } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DocumentEditor } from "@/components/editor/DocumentEditor";
import { 
  ArrowLeft, 
  Clock, 
  GitBranch,
  MessageSquare,
  RotateCcw
} from "lucide-react";
import { useRouter } from "next/navigation";

interface VersionDetailPageProps {
  params: Promise<{
    projectId: string;
    documentId: string;
    versionId: string;
  }>;
}

export default function VersionDetailPage({ params }: VersionDetailPageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const document = useQuery(api.documents.get, { 
    id: resolvedParams.documentId as Id<"documents"> 
  });
  const version = useQuery(api.documentVersions.get, { 
    id: resolvedParams.versionId as Id<"documentVersions"> 
  });

  if (document === undefined || version === undefined) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading version...</p>
        </div>
      </div>
    );
  }

  if (document === null || version === null) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground mb-2">Version not found</h2>
          <p className="text-muted-foreground mb-4">The version you&apos;re looking for doesn&apos;t exist.</p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const isCurrentVersion = document.currentVersionId === version._id;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/dashboard/projects/${resolvedParams.projectId}/documents/${resolvedParams.documentId}/versions`)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Versions
            </Button>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold text-foreground">
                  Version {version.versionNumber}
                </h1>
                {isCurrentVersion && (
                  <Badge variant="secondary">Current</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{document.title}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {!isCurrentVersion && (
              <Button
                variant="outline"
                onClick={() => {
                  // TODO: Implement restore functionality
                  console.log('Restore version:', version._id);
                }}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Restore Version
              </Button>
            )}
            <Button
              onClick={() => router.push(`/dashboard/projects/${resolvedParams.projectId}/documents/${resolvedParams.documentId}`)}
            >
              Edit Current
            </Button>
          </div>
        </div>

        {/* Version Info */}
        <div className="flex items-center space-x-4 mt-4 text-sm text-muted-foreground">
          <span className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {new Date(version.createdAt).toLocaleString()}
          </span>
          {version.aiModel && (
            <span className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-1" />
              Translated with {version.aiModel}
            </span>
          )}
          <span className="flex items-center">
            <GitBranch className="h-4 w-4 mr-1" />
            Version {version.versionNumber}
          </span>
        </div>

        {version.comment && (
          <div className="mt-3 p-3 bg-info/10 rounded-lg">
            <p className="text-sm text-info-foreground">
              <strong>Comment:</strong> {version.comment}
            </p>
          </div>
        )}

        {version.instructions && (
          <div className="mt-3 p-3 bg-success/10 rounded-lg">
            <p className="text-sm text-success-foreground">
              <strong>Translation Instructions:</strong> {version.instructions}
            </p>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1">
        <DocumentEditor
          documentId={resolvedParams.documentId}
          initialContent={version.content}
          initialTranslatedContent={version.translatedContent || ''}
          readonly={true}
        />
      </div>
    </div>
  );
}
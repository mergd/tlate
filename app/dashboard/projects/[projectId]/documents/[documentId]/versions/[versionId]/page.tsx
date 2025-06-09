"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DocumentEditor } from "@/components/editor/DocumentEditor";
import { 
  ArrowLeft, 
  Clock, 
  FileText, 
  GitBranch,
  MessageSquare,
  RotateCcw
} from "lucide-react";
import { useRouter } from "next/navigation";

interface VersionDetailPageProps {
  params: {
    projectId: string;
    documentId: string;
    versionId: string;
  };
}

export default function VersionDetailPage({ params }: VersionDetailPageProps) {
  const router = useRouter();
  const document = useQuery(api.documents.get, { 
    id: params.documentId as any 
  });
  const version = useQuery(api.documentVersions.get, { 
    id: params.versionId as any 
  });

  if (document === undefined || version === undefined) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading version...</p>
        </div>
      </div>
    );
  }

  if (document === null || version === null) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Version not found</h2>
          <p className="text-gray-600 mb-4">The version you're looking for doesn't exist.</p>
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
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/dashboard/projects/${params.projectId}/documents/${params.documentId}/versions`)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Versions
            </Button>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold text-gray-900">
                  Version {version.versionNumber}
                </h1>
                {isCurrentVersion && (
                  <Badge variant="secondary">Current</Badge>
                )}
              </div>
              <p className="text-sm text-gray-500">{document.title}</p>
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
              onClick={() => router.push(`/dashboard/projects/${params.projectId}/documents/${params.documentId}`)}
            >
              Edit Current
            </Button>
          </div>
        </div>

        {/* Version Info */}
        <div className="flex items-center space-x-4 mt-4 text-sm text-gray-600">
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
          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Comment:</strong> {version.comment}
            </p>
          </div>
        )}

        {version.instructions && (
          <div className="mt-3 p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-green-800">
              <strong>Translation Instructions:</strong> {version.instructions}
            </p>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1">
        <DocumentEditor
          documentId={params.documentId}
          initialContent={version.content}
          initialTranslatedContent={version.translatedContent || ''}
          readonly={true}
        />
      </div>
    </div>
  );
}
"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Clock, 
  FileText, 
  Eye,
  GitBranch,
  MessageSquare
} from "lucide-react";
import { useRouter } from "next/navigation";

interface VersionsPageProps {
  params: {
    projectId: string;
    documentId: string;
  };
}

export default function VersionsPage({ params }: VersionsPageProps) {
  const router = useRouter();
  const document = useQuery(api.documents.get, { 
    id: params.documentId as any 
  });
  const versions = useQuery(api.documentVersions.listByDocument, { 
    documentId: params.documentId as any 
  });

  if (document === undefined || versions === undefined) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading versions...</p>
        </div>
      </div>
    );
  }

  if (document === null) {
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
    <div className="h-full overflow-auto">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/dashboard/projects/${params.projectId}/documents/${params.documentId}`)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Document
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Version History</h1>
              <p className="text-gray-600">{document.title}</p>
            </div>
          </div>
        </div>

        {/* Versions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <GitBranch className="h-5 w-5 mr-2" />
              Document Versions
            </CardTitle>
            <CardDescription>
              View and manage different versions of your document
            </CardDescription>
          </CardHeader>
          <CardContent>
            {versions && versions.length > 0 ? (
              <div className="space-y-4">
                {versions.map((version, index) => (
                  <div
                    key={version._id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FileText className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium text-gray-900">
                            Version {version.versionNumber}
                          </h3>
                          {document.currentVersionId === version._id && (
                            <Badge variant="secondary">Current</Badge>
                          )}
                          {index === 0 && (
                            <Badge variant="outline">Latest</Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {new Date(version.createdAt).toLocaleString()}
                          </span>
                          {version.aiModel && (
                            <span className="flex items-center">
                              <MessageSquare className="h-3 w-3 mr-1" />
                              {version.aiModel}
                            </span>
                          )}
                        </div>
                        {version.comment && (
                          <p className="text-sm text-gray-600 mt-1">
                            {version.comment}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/dashboard/projects/${params.projectId}/documents/${params.documentId}/versions/${version._id}`)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      {document.currentVersionId !== version._id && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // TODO: Implement restore functionality
                            console.log('Restore version:', version._id);
                          }}
                        >
                          Restore
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <GitBranch className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No versions yet
                </h3>
                <p className="text-gray-500 mb-4">
                  Save your document to create the first version
                </p>
                <Button
                  onClick={() => router.push(`/dashboard/projects/${params.projectId}/documents/${params.documentId}`)}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Edit Document
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
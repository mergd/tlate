"use client";

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { History, Clock } from 'lucide-react';

interface DocumentVersionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documentId: string;
  onSelectVersion?: (versionId: string) => void;
}

export function DocumentVersionsDialog({
  open,
  onOpenChange,
  documentId,
  onSelectVersion
}: DocumentVersionsDialogProps) {
  const versions = useQuery(api.documentVersions.list, {
    documentId: documentId as Id<"documents">
  });

  const document = useQuery(api.documents.get, {
    id: documentId as Id<"documents">
  });

  if (versions === undefined || document === undefined) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Document Versions
            </DialogTitle>
            <DialogDescription>
              Loading version history...
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Document Versions
          </DialogTitle>
          <DialogDescription>
            View and manage document versions for &quot;{document?.title}&quot;
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {versions && versions.length > 0 ? (
            versions.map((version) => (
              <Card key={version._id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <Badge variant={version._id === document?.currentVersionId ? "default" : "secondary"}>
                        Version {version.versionNumber}
                      </Badge>
                      {version._id === document?.currentVersionId && (
                        <Badge variant="outline">Current</Badge>
                      )}
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {new Date(version.createdAt).toLocaleDateString()} at{' '}
                        {new Date(version.createdAt).toLocaleTimeString()}
                      </div>
                    </div>
                    
                    {version.comment && (
                      <p className="text-sm text-muted-foreground">{version.comment}</p>
                    )}
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{version.content.length} characters</span>
                      {version.translatedContent && (
                        <span>{version.translatedContent.length} translated characters</span>
                      )}
                      {version.aiModel && (
                        <span>AI: {version.aiModel}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {version._id !== document?.currentVersionId && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          onSelectVersion?.(version._id);
                          onOpenChange(false);
                        }}
                      >
                        Restore
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        // TODO: Implement version comparison/preview
                        console.log('Preview version:', version._id);
                      }}
                    >
                      Preview
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-8">
              <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No versions yet</h3>
              <p className="text-muted-foreground">
                Versions will appear here when you save changes to your document.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
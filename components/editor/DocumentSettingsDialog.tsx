"use client";

import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Settings, Save, Trash2 } from 'lucide-react';

interface DocumentSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documentId: string;
}

export function DocumentSettingsDialog({
  open,
  onOpenChange,
  documentId
}: DocumentSettingsDialogProps) {
  const document = useQuery(api.documents.get, {
    id: documentId as Id<"documents">
  });

  const project = useQuery(api.projects.get, {
    id: document?.projectId as Id<"projects">
  });

  const updateDocument = useMutation(api.documents.update);
  const deleteDocument = useMutation(api.documents.remove);

  const [title, setTitle] = useState('');
  const [instructions, setInstructions] = useState('');
  const [preferredModel, setPreferredModel] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Initialize form when document loads
  useState(() => {
    if (document) {
      setTitle(document.title);
      // TODO: Get these from document version or settings
      setInstructions('');
      setPreferredModel('');
    }
  });

  const handleSave = async () => {
    if (!document) return;
    
    setIsSaving(true);
    try {
      await updateDocument({
        id: document._id,
        title: title.trim(),
        // TODO: Save other settings
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to save document settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!document || !confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
      return;
    }
    
    setIsDeleting(true);
    try {
      await deleteDocument({ id: document._id });
      onOpenChange(false);
      // TODO: Navigate back to project
    } catch (error) {
      console.error('Failed to delete document:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (document === undefined || project === undefined) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Document Settings
            </DialogTitle>
            <DialogDescription>
              Loading document settings...
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
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Document Settings
          </DialogTitle>
          <DialogDescription>
            Configure settings for &quot;{document?.title}&quot;
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Settings */}
          <Card className="p-4 space-y-4">
            <h3 className="font-serif font-medium">Basic Settings</h3>
            
            <div className="space-y-2">
              <Label htmlFor="title">Document Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter document title"
              />
            </div>

            <div className="space-y-2">
              <Label>Project</Label>
              <div className="text-sm text-muted-foreground">
                {project?.name} ({project?.sourceLanguage} → {project?.targetLanguage})
              </div>
            </div>
          </Card>

          {/* Translation Settings */}
          <Card className="p-4 space-y-4">
            <h3 className="font-serif font-medium">Translation Settings</h3>
            
            <div className="space-y-2">
              <Label htmlFor="instructions">Translation Instructions</Label>
              <Textarea
                id="instructions"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Provide specific instructions for AI translation (e.g., tone, style, terminology)"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Preferred AI Model</Label>
              <Select value={preferredModel} onValueChange={setPreferredModel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select preferred model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4">GPT-4</SelectItem>
                  <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                  <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                  <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          {/* Danger Zone */}
          <Card className="p-4 space-y-4 border-destructive/20">
            <h3 className="font-serif font-medium text-destructive">Danger Zone</h3>
            <p className="text-sm text-muted-foreground">
              Permanently delete this document and all its versions.
            </p>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {isDeleting ? 'Deleting...' : 'Delete Document'}
            </Button>
          </Card>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
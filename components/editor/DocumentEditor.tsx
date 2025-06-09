"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Quote, 
  Code, 
  Heading1, 
  Heading2, 
  Heading3,
  Undo,
  Redo,
  Save,
  Languages
} from 'lucide-react';
import { useState, useCallback, useEffect } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

interface DocumentEditorProps {
  documentId: string;
  initialContent?: string;
  initialTranslatedContent?: string;
  onSave?: (content: string, translatedContent?: string) => void;
  readonly?: boolean;
}

export function DocumentEditor({ 
  documentId, 
  initialContent = '', 
  initialTranslatedContent = '',
  onSave,
  readonly = false 
}: DocumentEditorProps) {
  const [activeTab, setActiveTab] = useState<'source' | 'translated'>('source');
  const [isSaving, setIsSaving] = useState(false);
  
  const createVersion = useMutation(api.documentVersions.create);

  const sourceEditor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Start writing your document...',
      }),
      CharacterCount,
    ],
    content: initialContent,
    editable: !readonly,
    onUpdate: () => {
      // Content updated
    },
  });

  const translatedEditor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Translation will appear here...',
      }),
      CharacterCount,
    ],
    content: initialTranslatedContent,
    editable: !readonly,
    onUpdate: () => {
      // Translated content updated
    },
  });

  const handleSave = useCallback(async () => {
    if (!sourceEditor || isSaving) return;

    setIsSaving(true);
    try {
      await createVersion({
        documentId: documentId as Id<"documents">,
        content: sourceEditor.getHTML(),
        translatedContent: translatedEditor?.getHTML() || undefined,
      });
      
      onSave?.(sourceEditor.getHTML(), translatedEditor?.getHTML());
    } catch (error) {
      console.error('Failed to save document:', error);
    } finally {
      setIsSaving(false);
    }
  }, [sourceEditor, translatedEditor, documentId, createVersion, onSave, isSaving]);

  const handleTranslate = useCallback(async () => {
    // Placeholder for AI translation
    if (!sourceEditor || !translatedEditor) return;
    
    const sourceContent = sourceEditor.getText();
    // In a real implementation, this would call an AI service
    const mockTranslation = `[TRANSLATED] ${sourceContent}`;
    
    translatedEditor.commands.setContent(mockTranslation);
  }, [sourceEditor, translatedEditor]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleSave]);

  if (!sourceEditor) {
    return <div>Loading editor...</div>;
  }

  const activeEditor = activeTab === 'source' ? sourceEditor : translatedEditor;

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Toolbar */}
      <div className="border-b border-border p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Button
              variant={activeTab === 'source' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('source')}
            >
              Source
            </Button>
            <Button
              variant={activeTab === 'translated' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('translated')}
            >
              Translation
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              onClick={handleTranslate}
              variant="outline"
              size="sm"
              disabled={readonly}
            >
              <Languages className="h-4 w-4 mr-2" />
              Translate
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving || readonly}
              size="sm"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>

        {/* Editor toolbar */}
        {activeEditor && !readonly && (
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => activeEditor.chain().focus().undo().run()}
              disabled={!activeEditor.can().undo()}
            >
              <Undo className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => activeEditor.chain().focus().redo().run()}
              disabled={!activeEditor.can().redo()}
            >
              <Redo className="h-4 w-4" />
            </Button>
            
            <Separator orientation="vertical" className="h-6" />
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => activeEditor.chain().focus().toggleHeading({ level: 1 }).run()}
              data-active={activeEditor.isActive('heading', { level: 1 })}
              className="data-[active=true]:bg-accent"
            >
              <Heading1 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => activeEditor.chain().focus().toggleHeading({ level: 2 }).run()}
              data-active={activeEditor.isActive('heading', { level: 2 })}
              className="data-[active=true]:bg-accent"
            >
              <Heading2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => activeEditor.chain().focus().toggleHeading({ level: 3 }).run()}
              data-active={activeEditor.isActive('heading', { level: 3 })}
              className="data-[active=true]:bg-accent"
            >
              <Heading3 className="h-4 w-4" />
            </Button>
            
            <Separator orientation="vertical" className="h-6" />
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => activeEditor.chain().focus().toggleBold().run()}
              data-active={activeEditor.isActive('bold')}
              className="data-[active=true]:bg-accent"
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => activeEditor.chain().focus().toggleItalic().run()}
              data-active={activeEditor.isActive('italic')}
              className="data-[active=true]:bg-accent"
            >
              <Italic className="h-4 w-4" />
            </Button>
            
            <Separator orientation="vertical" className="h-6" />
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => activeEditor.chain().focus().toggleBulletList().run()}
              data-active={activeEditor.isActive('bulletList')}
              className="data-[active=true]:bg-accent"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => activeEditor.chain().focus().toggleOrderedList().run()}
              data-active={activeEditor.isActive('orderedList')}
              className="data-[active=true]:bg-accent"
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => activeEditor.chain().focus().toggleBlockquote().run()}
              data-active={activeEditor.isActive('blockquote')}
              className="data-[active=true]:bg-accent"
            >
              <Quote className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => activeEditor.chain().focus().toggleCode().run()}
              data-active={activeEditor.isActive('code')}
              className="data-[active=true]:bg-accent"
            >
              <Code className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Editor Content */}
      <div className="flex-1 relative">
        {activeTab === 'source' && (
          <div className="h-full">
            <EditorContent 
              editor={sourceEditor} 
              className="h-full prose prose-lg max-w-none p-6 focus:outline-none [&_.ProseMirror]:h-full [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-full"
            />
          </div>
        )}
        
        {activeTab === 'translated' && (
          <div className="h-full">
            <EditorContent 
              editor={translatedEditor} 
              className="h-full prose prose-lg max-w-none p-6 focus:outline-none [&_.ProseMirror]:h-full [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-full"
            />
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="border-t border-border px-6 py-2 text-sm text-muted-foreground flex justify-between">
        <span>
          {activeEditor?.storage.characterCount?.characters() || 0} characters, {' '}
          {activeEditor?.storage.characterCount?.words() || 0} words
        </span>
        <span>
          {readonly ? 'Read-only' : 'Press Cmd+S to save'}
        </span>
      </div>
    </div>
  );
}
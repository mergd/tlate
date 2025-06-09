"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Undo,
  Redo,
  Save,
  Languages,
  Copy,
} from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface DocumentEditorProps {
  documentId: string;
  initialContent?: string;
  initialTranslatedContent?: string;
  onSave?: (content: string, translatedContent?: string) => void;
  readonly?: boolean;
}

export function DocumentEditor({
  documentId,
  initialContent = "",
  initialTranslatedContent = "",
  onSave,
  readonly = false,
}: DocumentEditorProps) {
  // Removed tabs mode - only using side-by-side view
  const [isSaving, setIsSaving] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);

  const createVersion = useMutation(api.documentVersions.create);

  const sourceEditor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({
        placeholder: "Start writing your document...",
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
      Underline,
      Placeholder.configure({
        placeholder: "Translation will appear here...",
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
      console.error("Failed to save document:", error);
    } finally {
      setIsSaving(false);
    }
  }, [
    sourceEditor,
    translatedEditor,
    documentId,
    createVersion,
    onSave,
    isSaving,
  ]);

  const handleTranslate = useCallback(async () => {
    if (!sourceEditor || !translatedEditor) return;

    setIsTranslating(true);
    const sourceContent = sourceEditor.getText();

    // Simulate AI translation with better mock
    setTimeout(() => {
      const sentences = sourceContent.split(/[.!?]+/).filter((s) => s.trim());
      const translatedSentences = sentences.map((sentence) => {
        // Simple mock translation - in real app this would call OpenAI/Google Translate
        return sentence.trim() ? `[Translated: ${sentence.trim()}]` : sentence;
      });

      const mockTranslation =
        translatedSentences.join(". ").replace(/\.\s*$/, "") + ".";
      translatedEditor.commands.setContent(`<p>${mockTranslation}</p>`);
      setIsTranslating(false);
    }, 1500);
  }, [sourceEditor, translatedEditor]);

  const copyTranslation = useCallback(() => {
    if (!translatedEditor) return;
    const text = translatedEditor.getText();
    navigator.clipboard.writeText(text);
  }, [translatedEditor]);

  // Power user keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        switch (e.key) {
          case "s":
            e.preventDefault();
            handleSave();
            break;
          case "t":
            e.preventDefault();
            handleTranslate();
            break;
          case "c":
            if (e.shiftKey) {
              e.preventDefault();
              copyTranslation();
            }
            break;
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleSave, handleTranslate, copyTranslation]);

  if (!sourceEditor) {
    return <div>Loading editor...</div>;
  }

  const renderToolbar = (editor: NonNullable<typeof sourceEditor>) => (
    <div className="flex items-center space-x-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
      >
        <Undo className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
      >
        <Redo className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="h-6" />

      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
        data-active={editor.isActive("bold")}
        className="data-[active=true]:bg-accent"
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        data-active={editor.isActive("italic")}
        className="data-[active=true]:bg-accent"
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        data-active={editor.isActive("underline")}
        className="data-[active=true]:bg-accent"
      >
        <UnderlineIcon className="h-4 w-4" />
      </Button>
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Main Toolbar */}
      <div className="border-b border-border p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-serif font-medium text-foreground">
              Document Editor
            </h2>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              onClick={copyTranslation}
              variant="outline"
              size="sm"
              disabled={readonly || !translatedEditor?.getText()}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy Translation
            </Button>
            <Button
              onClick={handleTranslate}
              variant="outline"
              size="sm"
              disabled={readonly || isTranslating || !sourceEditor?.getText()}
            >
              <Languages className="h-4 w-4 mr-2" />
              {isTranslating ? "Translating..." : "Translate"}
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving || readonly}
              size="sm"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 relative">
        <div className="h-full flex">
          {/* Source Editor */}
          <div className="flex-1 flex flex-col border-r border-border">
            <div className="border-b border-border p-3 bg-muted/30">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-serif font-medium text-foreground">
                  Source
                </h3>
                <div className="text-xs text-muted-foreground">
                  {sourceEditor?.storage.characterCount?.words() || 0} words
                </div>
              </div>
              {!readonly && renderToolbar(sourceEditor)}
            </div>
            <div className="flex-1">
              <EditorContent
                editor={sourceEditor}
                className="h-full prose prose-sm max-w-none p-4 focus:outline-none [&_.ProseMirror]:h-full [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-full"
              />
            </div>
          </div>

          {/* Translated Editor */}
          <div className="flex-1 flex flex-col">
            <div className="border-b border-border p-3 bg-muted/30">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-serif font-medium text-foreground">
                  Translation
                </h3>
                <div className="text-xs text-muted-foreground">
                  {translatedEditor?.storage.characterCount?.words() || 0} words
                </div>
              </div>
              {!readonly && translatedEditor && renderToolbar(translatedEditor)}
            </div>
            <div className="flex-1">
              <EditorContent
                editor={translatedEditor}
                className="h-full prose prose-sm max-w-none p-4 focus:outline-none [&_.ProseMirror]:h-full [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="border-t border-border px-6 py-2 text-xs text-muted-foreground flex justify-between">
        <div className="flex items-center space-x-4">
          <span>
            Source: {sourceEditor?.storage.characterCount?.characters() || 0}{" "}
            chars, {sourceEditor?.storage.characterCount?.words() || 0} words
          </span>
          <span>
            Translation:{" "}
            {translatedEditor?.storage.characterCount?.characters() || 0} chars,{" "}
            {translatedEditor?.storage.characterCount?.words() || 0} words
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <span>⌘+S Save</span>
          <span>⌘+T Translate</span>
          <span>⌘+Shift+C Copy Translation</span>
        </div>
      </div>
    </div>
  );
}

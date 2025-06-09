"use client";

import { useState, useRef, useEffect } from 'react';
import { useChat } from 'ai/react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  X, 
  Send, 
  Sparkles, 
  Copy, 
  ThumbsUp, 
  ThumbsDown,
  BookOpen,
  Minimize2,
  Maximize2
} from 'lucide-react';

interface AIChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  documentId?: string;
  projectId?: string;
  className?: string;
}

export function AIChatPanel({ 
  isOpen, 
  onClose, 
  documentId, 
  projectId,
  className = "fixed right-0 top-0 h-full w-96 z-50"
}: AIChatPanelProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [showDictionary, setShowDictionary] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch context data
  const document = useQuery(
    api.documents.get,
    documentId ? { id: documentId as Id<"documents"> } : "skip"
  );
  
  const project = useQuery(
    api.projects.get,
    projectId ? { id: projectId as Id<"projects"> } : "skip"
  );
  
  const dictionary = useQuery(
    api.projectDictionaries.get,
    projectId ? { projectId: projectId as Id<"projects"> } : "skip"
  );

  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat({
    api: '/api/chat',
    body: {
      context: {
        document: document ? {
          title: document.title,
          content: document.currentVersion?.content,
          translatedContent: document.currentVersion?.translatedContent
        } : null,
        project: project ? {
          name: project.name,
          sourceLanguage: project.sourceLanguage,
          targetLanguage: project.targetLanguage
        } : null,
        dictionary: dictionary?.entries || []
      }
    }
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit(e as React.FormEvent);
    }
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const clearChat = () => {
    setMessages([]);
  };

  if (!isOpen) return null;

  return (
    <Card className={`${className} flex flex-col shadow-2xl border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          <h3 className="font-serif font-medium text-foreground">AI Assistant</h3>
          {document && (
            <Badge variant="outline" className="text-xs">
              {document.title}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 w-6 p-0"
            onClick={() => setShowDictionary(!showDictionary)}
            title="Toggle Dictionary"
          >
            <BookOpen className="h-3.5 w-3.5" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 w-6 p-0"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            {isMinimized ? <Maximize2 className="h-3.5 w-3.5" /> : <Minimize2 className="h-3.5 w-3.5" />}
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0">
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Dictionary Panel */}
          {showDictionary && dictionary?.entries && dictionary.entries.length > 0 && (
            <>
              <div className="p-3 bg-muted/30 border-b border-border">
                <h4 className="text-sm font-medium text-foreground mb-2">Project Dictionary</h4>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {dictionary.entries.map((entry, index) => (
                    <div key={index} className="text-xs">
                      <span className="font-medium">{entry.source}</span>
                      <span className="text-muted-foreground"> → </span>
                      <span>{entry.target}</span>
                      {entry.context && (
                        <span className="text-muted-foreground ml-2">({entry.context})</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <Sparkles className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground mb-2">
                  Ask me anything about your translation
                </p>
                <p className="text-xs text-muted-foreground">
                  I can help with language questions, writing, and editing
                </p>
                {document && (
                  <div className="mt-4 space-y-2">
                    <p className="text-xs text-muted-foreground">Quick actions:</p>
                    <div className="flex flex-wrap gap-1 justify-center">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => {
                          const message = "Improve the writing style of this document";
                          handleInputChange({ target: { value: message } } as React.ChangeEvent<HTMLTextAreaElement>);
                        }}
                      >
                        Improve writing
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => {
                          const message = "Check for translation consistency";
                          handleInputChange({ target: { value: message } } as React.ChangeEvent<HTMLTextAreaElement>);
                        }}
                      >
                        Check consistency
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg px-3 py-2 group relative ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    
                    {message.role === "assistant" && (
                      <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-5 w-5 p-0"
                          onClick={() => copyMessage(message.content)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
                          <ThumbsUp className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
                          <ThumbsDown className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg px-3 py-2 max-w-[85%]">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border">
            <form onSubmit={handleSubmit} className="space-y-2">
              <div className="relative">
                <Textarea
                  ref={textareaRef}
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about translations, writing, or document editing..."
                  className="min-h-[60px] max-h-[120px] resize-none pr-12 text-sm"
                />
                <Button
                  type="submit"
                  size="sm"
                  className="absolute bottom-2 right-2 h-7 w-7 p-0"
                  disabled={!input.trim() || isLoading}
                >
                  <Send className="h-3.5 w-3.5" />
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  Press ⌘+Enter to send
                </p>
                {messages.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearChat}
                    className="h-6 text-xs"
                  >
                    Clear chat
                  </Button>
                )}
              </div>
            </form>
          </div>
        </>
      )}
    </Card>
  );
}
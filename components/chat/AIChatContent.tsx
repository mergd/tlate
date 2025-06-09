"use client";

import { useState, useRef, useEffect } from 'react';
import { useChat } from 'ai/react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Send, 
  Sparkles, 
  Copy, 
  ThumbsUp, 
  ThumbsDown,
  BookOpen,
  RotateCcw,
  Trash2
} from 'lucide-react';

interface AIChatContentProps {
  documentId?: string;
  projectId?: string;
  isCollapsed: boolean;
  showContent: boolean;
  isActiveTab?: boolean;
}

export function AIChatContent({ 
  documentId, 
  projectId,
  isCollapsed,
  showContent,
  isActiveTab = false
}: AIChatContentProps) {
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
    if (!isCollapsed && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isCollapsed]);

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

  if (!showContent) {
    // Collapsed view - show floating panel only when this tab is active
    return (
      <div className="h-full relative">
        <div className="h-full flex flex-col items-center justify-center p-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse mb-2"></div>
          {messages.length > 0 && (
            <Badge variant="secondary" className="text-xs px-1 py-0">
              {messages.length}
            </Badge>
          )}
        </div>
        
        {/* Fixed width floating panel - only show when chat tab is active */}
        {isActiveTab && (
          <div className="absolute left-full top-0 h-full w-96 bg-background border border-border shadow-2xl z-50">
          <div className="h-full flex flex-col">
            {/* Chat Header */}
            <div className="p-3 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  <h3 className="font-serif font-medium text-foreground text-sm">AI Assistant</h3>
                </div>
                
                <div className="flex items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 p-0"
                    onClick={() => setShowDictionary(!showDictionary)}
                    title="Toggle Dictionary"
                  >
                    <BookOpen className="h-3 w-3" />
                  </Button>
                  {messages.length > 0 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0"
                      onClick={clearChat}
                      title="Clear Chat"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
              
              {document && (
                <div className="mt-2">
                  <Badge variant="outline" className="text-xs">
                    {document.title}
                  </Badge>
                </div>
              )}
            </div>

            {/* Dictionary Panel */}
            {showDictionary && dictionary?.entries && dictionary.entries.length > 0 && (
              <div className="p-3 bg-muted/30 border-b border-border">
                <h4 className="text-xs font-medium text-foreground mb-2">Project Dictionary</h4>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {dictionary.entries.map((entry, index) => (
                    <div key={index} className="text-xs">
                      <span className="font-medium">{entry.source}</span>
                      <span className="text-muted-foreground"> → </span>
                      <span>{entry.target}</span>
                      {entry.context && (
                        <div className="text-muted-foreground text-xs mt-0.5">
                          {entry.context}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {messages.length === 0 ? (
                <div className="text-center py-6">
                  <Sparkles className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground mb-2">
                    Ask me about your translation
                  </p>
                  <p className="text-xs text-muted-foreground/70">
                    I can help with language questions and editing
                  </p>
                  {document && (
                    <div className="mt-3 space-y-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-6 text-xs w-full"
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
                        className="h-6 text-xs w-full"
                        onClick={() => {
                          const message = "Check for translation consistency";
                          handleInputChange({ target: { value: message } } as React.ChangeEvent<HTMLTextAreaElement>);
                        }}
                      >
                        Check consistency
                      </Button>
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
                      className={`max-w-[90%] rounded-lg px-2 py-1.5 group relative ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground"
                      }`}
                    >
                      <p className="text-xs whitespace-pre-wrap leading-relaxed">{message.content}</p>
                      
                      {message.role === "assistant" && (
                        <div className="flex items-center gap-1 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0"
                            onClick={() => copyMessage(message.content)}
                          >
                            <Copy className="h-2.5 w-2.5" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                            <ThumbsUp className="h-2.5 w-2.5" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                            <ThumbsDown className="h-2.5 w-2.5" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                            <RotateCcw className="h-2.5 w-2.5" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg px-2 py-1.5 max-w-[90%]">
                    <div className="flex items-center space-x-1">
                      <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                      <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-border">
              <form onSubmit={handleSubmit} className="space-y-2">
                <div className="relative">
                  <Textarea
                    ref={textareaRef}
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about translations..."
                    className="min-h-[50px] max-h-[100px] resize-none pr-8 text-xs"
                    rows={2}
                  />
                  <Button
                    type="submit"
                    size="sm"
                    className="absolute bottom-1 right-1 h-6 w-6 p-0"
                    disabled={!input.trim() || isLoading}
                  >
                    <Send className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Press ⌘+Enter to send • ⌘+L to open
                </p>
              </form>
            </div>
          </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Chat Header */}
      <div className="p-3 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <h3 className="font-serif font-medium text-foreground text-sm">AI Assistant</h3>
          </div>
          
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0"
              onClick={() => setShowDictionary(!showDictionary)}
              title="Toggle Dictionary"
            >
              <BookOpen className="h-3 w-3" />
            </Button>
            {messages.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0"
                onClick={clearChat}
                title="Clear Chat"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
        
        {document && (
          <div className="mt-2">
            <Badge variant="outline" className="text-xs">
              {document.title}
            </Badge>
          </div>
        )}
      </div>

      {/* Dictionary Panel */}
      {showDictionary && dictionary?.entries && dictionary.entries.length > 0 && (
        <div className="p-3 bg-muted/30 border-b border-border">
          <h4 className="text-xs font-medium text-foreground mb-2">Project Dictionary</h4>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {dictionary.entries.map((entry, index) => (
              <div key={index} className="text-xs">
                <span className="font-medium">{entry.source}</span>
                <span className="text-muted-foreground"> → </span>
                <span>{entry.target}</span>
                {entry.context && (
                  <div className="text-muted-foreground text-xs mt-0.5">
                    {entry.context}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center py-6">
            <Sparkles className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
            <p className="text-xs text-muted-foreground mb-2">
              Ask me about your translation
            </p>
            <p className="text-xs text-muted-foreground/70">
              I can help with language questions and editing
            </p>
            {document && (
              <div className="mt-3 space-y-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-6 text-xs w-full"
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
                  className="h-6 text-xs w-full"
                  onClick={() => {
                    const message = "Check for translation consistency";
                    handleInputChange({ target: { value: message } } as React.ChangeEvent<HTMLTextAreaElement>);
                  }}
                >
                  Check consistency
                </Button>
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
                className={`max-w-[90%] rounded-lg px-2 py-1.5 group relative ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                <p className="text-xs whitespace-pre-wrap leading-relaxed">{message.content}</p>
                
                {message.role === "assistant" && (
                  <div className="flex items-center gap-1 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0"
                      onClick={() => copyMessage(message.content)}
                    >
                      <Copy className="h-2.5 w-2.5" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                      <ThumbsUp className="h-2.5 w-2.5" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                      <ThumbsDown className="h-2.5 w-2.5" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                      <RotateCcw className="h-2.5 w-2.5" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-lg px-2 py-1.5 max-w-[90%]">
              <div className="flex items-center space-x-1">
                <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-border">
        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="relative">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask about translations..."
              className="min-h-[50px] max-h-[100px] resize-none pr-8 text-xs"
              rows={2}
            />
            <Button
              type="submit"
              size="sm"
              className="absolute bottom-1 right-1 h-6 w-6 p-0"
              disabled={!input.trim() || isLoading}
            >
              <Send className="h-3 w-3" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Press ⌘+Enter to send • ⌘+L to open
          </p>
        </form>
      </div>
    </div>
  );
}
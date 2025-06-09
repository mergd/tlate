"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Send, Bot, User } from "lucide-react";

interface ChatInterfaceProps {
  onClose: () => void;
}

export function ChatInterface({ onClose }: ChatInterfaceProps) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Array<{
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: number;
  }>>([
    {
      id: "1",
      role: "assistant" as const,
      content: "Hi! I'm your AI assistant. I can help you with translations, document editing, and answer questions about your projects. How can I help you today?",
      timestamp: Date.now(),
    }
  ]);

  const handleSend = () => {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      role: "user" as const,
      content: message,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage("");

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant" as const,
        content: "I'm a placeholder response. The AI integration will be implemented in the next phase of development.",
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, assistantMessage]);
    }, 1000);
  };

  return (
    <div className="h-full bg-background border-l border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bot className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-foreground">AI Assistant</h2>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground"
              }`}
            >
              <div className="flex items-start space-x-2">
                {msg.role === "assistant" && (
                  <Bot className="h-4 w-4 mt-1 text-primary" />
                )}
                <div className="flex-1">
                  <p className="text-sm">{msg.content}</p>
                </div>
                {msg.role === "user" && (
                  <User className="h-4 w-4 mt-1 text-primary-foreground" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex space-x-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask me anything about your documents..."
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
          />
          <Button onClick={handleSend} disabled={!message.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
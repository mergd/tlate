"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { CursorChat } from "./CursorChat";

export function FloatingChatButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-40"
        size="icon"
      >
        <MessageSquare className="h-5 w-5" />
        <span className="sr-only">Open chat</span>
      </Button>

      {/* Chat Interface */}
      <CursorChat isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
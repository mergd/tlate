"use client";

import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';

interface EditableTitleProps {
  title: string;
  onSave: (newTitle: string) => void;
  className?: string;
  placeholder?: string;
}

export function EditableTitle({ 
  title, 
  onSave, 
  className = "text-xl font-bold text-foreground",
  placeholder = "Untitled Document"
}: EditableTitleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(title);
  const [isHovered, setIsHovered] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    const trimmedValue = value.trim();
    if (trimmedValue && trimmedValue !== title) {
      onSave(trimmedValue);
    } else {
      setValue(title); // Reset to original if invalid
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setValue(title);
      setIsEditing(false);
    }
  };

  const handleBlur = () => {
    handleSave();
  };

  if (isEditing) {
    return (
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        className={`${className} border-none shadow-none p-0 h-auto font-bold`}
        placeholder={placeholder}
      />
    );
  }

  return (
    <h1
      className={`${className} cursor-pointer transition-colors ${
        isHovered ? 'text-foreground/80' : 'text-foreground'
      }`}
      onClick={() => setIsEditing(true)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title="Click to edit"
    >
      {title || placeholder}
    </h1>
  );
}
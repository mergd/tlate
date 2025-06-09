"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  FolderOpen, 
  Plus, 
  Settings, 
  MessageSquare,
  BookOpen,
  Languages,
  Sparkles
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Command {
  id: string;
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  action: () => void;
  category: 'navigation' | 'actions' | 'search' | 'recent';
  shortcut?: string;
  badge?: string;
}

export function CommandPalette({ isOpen, onOpenChange }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();

  const projects = useQuery(api.projects.list);
  const searchResults = useQuery(
    api.projects.search,
    query.length > 1 ? { query } : "skip"
  );

  const staticCommands: Command[] = [
    {
      id: 'new-project',
      title: 'New Project',
      subtitle: 'Create a new translation project',
      icon: <Plus className="h-4 w-4" />,
      action: () => {
        router.push('/dashboard');
        onOpenChange(false);
        // Trigger new project dialog
      },
      category: 'actions',
      shortcut: '⌘+N'
    },
    {
      id: 'settings',
      title: 'Settings',
      subtitle: 'Manage your account and preferences',
      icon: <Settings className="h-4 w-4" />,
      action: () => {
        router.push('/settings');
        onOpenChange(false);
      },
      category: 'navigation',
      shortcut: '⌘+,'
    },
    {
      id: 'ai-chat',
      title: 'AI Chat',
      subtitle: 'Open AI assistant',
      icon: <MessageSquare className="h-4 w-4" />,
      action: () => {
        onOpenChange(false);
        // Trigger AI chat focus
      },
      category: 'actions',
      shortcut: '⌘+L'
    },
    {
      id: 'dictionary',
      title: 'Project Dictionary',
      subtitle: 'Manage translation terms',
      icon: <BookOpen className="h-4 w-4" />,
      action: () => {
        onOpenChange(false);
        // Open dictionary panel
      },
      category: 'actions'
    },
    {
      id: 'translate',
      title: 'Translate Document',
      subtitle: 'Run AI translation on current document',
      icon: <Languages className="h-4 w-4" />,
      action: () => {
        onOpenChange(false);
        // Trigger translation
      },
      category: 'actions',
      shortcut: '⌘+T'
    }
  ];

  const projectCommands: Command[] = (projects || []).map(project => ({
    id: `project-${project._id}`,
    title: project.name,
    subtitle: `${project.sourceLanguage} → ${project.targetLanguage}`,
    icon: <FolderOpen className="h-4 w-4" />,
    action: () => {
      router.push(`/dashboard/${project._id}`);
      onOpenChange(false);
    },
    category: 'search' as const,
    badge: project.sourceLanguage
  }));

  const searchCommands: Command[] = (searchResults || []).map(project => ({
    id: `search-${project._id}`,
    title: project.name,
    subtitle: `Search result • ${project.sourceLanguage} → ${project.targetLanguage}`,
    icon: <Search className="h-4 w-4" />,
    action: () => {
      router.push(`/dashboard/${project._id}`);
      onOpenChange(false);
    },
    category: 'search' as const
  }));

  const allCommands = [
    ...staticCommands,
    ...(query.length > 1 ? searchCommands : projectCommands)
  ];

  const filteredCommands = allCommands.filter(command => {
    if (query.length <= 1) return true;
    return command.title.toLowerCase().includes(query.toLowerCase()) ||
           command.subtitle?.toLowerCase().includes(query.toLowerCase());
  });

  const groupedCommands = filteredCommands.reduce((acc, command) => {
    if (!acc[command.category]) {
      acc[command.category] = [];
    }
    acc[command.category].push(command);
    return acc;
  }, {} as Record<string, Command[]>);

  const handleSelect = useCallback((command: Command) => {
    command.action();
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => prev === 0 ? filteredCommands.length - 1 : prev - 1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        handleSelect(filteredCommands[selectedIndex]);
      }
    }
  }, [filteredCommands, selectedIndex, handleSelect]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const categoryLabels = {
    navigation: 'Navigation',
    actions: 'Actions',
    search: query.length > 1 ? 'Search Results' : 'Projects',
    recent: 'Recent'
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        <div className="flex items-center border-b border-border px-4 py-3">
          <Search className="h-4 w-4 text-muted-foreground mr-3" />
          <Input
            placeholder="Search projects, commands, or actions..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="border-0 shadow-none focus-visible:ring-0 text-sm"
            autoFocus
          />
          <Badge variant="outline" className="ml-auto text-xs">
            ⌘+K
          </Badge>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {Object.entries(groupedCommands).map(([category, commands]) => (
            <div key={category} className="py-2">
              <div className="px-4 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {categoryLabels[category as keyof typeof categoryLabels]}
              </div>
              <div className="space-y-1 px-2">
                {commands.map((command) => {
                  const globalIndex = filteredCommands.findIndex(c => c.id === command.id);
                  const isSelected = globalIndex === selectedIndex;
                  
                  return (
                    <div
                      key={command.id}
                      className={`flex items-center justify-between rounded-md px-2 py-2 cursor-pointer transition-colors ${
                        isSelected ? 'bg-accent text-accent-foreground' : 'hover:bg-muted/50'
                      }`}
                      onClick={() => handleSelect(command)}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="flex-shrink-0">
                          {command.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">
                            {command.title}
                          </div>
                          {command.subtitle && (
                            <div className="text-xs text-muted-foreground truncate">
                              {command.subtitle}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {command.badge && (
                          <Badge variant="secondary" className="text-xs">
                            {command.badge}
                          </Badge>
                        )}
                        {command.shortcut && (
                          <Badge variant="outline" className="text-xs">
                            {command.shortcut}
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {filteredCommands.length === 0 && (
            <div className="py-8 text-center">
              <Sparkles className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                No results found for &quot;{query}&quot;
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Try searching for projects, documents, or commands
              </p>
            </div>
          )}
        </div>

        <div className="border-t border-border px-4 py-2 text-xs text-muted-foreground bg-muted/30">
          Use ↑↓ to navigate • Enter to select • Esc to close
        </div>
      </DialogContent>
    </Dialog>
  );
}
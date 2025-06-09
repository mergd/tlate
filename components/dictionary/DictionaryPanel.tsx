"use client";

import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BookOpen, Plus, Edit, Trash2, Save, X } from 'lucide-react';

interface DictionaryPanelProps {
  projectId: string;
  className?: string;
}

interface DictionaryEntry {
  source: string;
  target: string;
  context?: string;
  createdAt: number;
}

export function DictionaryPanel({ projectId, className = "" }: DictionaryPanelProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newEntry, setNewEntry] = useState({ source: '', target: '', context: '' });

  const dictionary = useQuery(api.projectDictionaries.get, {
    projectId: projectId as Id<"projects">
  });

  const addEntry = useMutation(api.projectDictionaries.addEntry);
  const updateEntry = useMutation(api.projectDictionaries.updateEntry);
  const removeEntry = useMutation(api.projectDictionaries.removeEntry);

  const handleAddEntry = async () => {
    if (!newEntry.source.trim() || !newEntry.target.trim()) return;

    try {
      await addEntry({
        projectId: projectId as Id<"projects">,
        source: newEntry.source,
        target: newEntry.target,
        context: newEntry.context || undefined,
      });
      setNewEntry({ source: '', target: '', context: '' });
      setIsAddingNew(false);
    } catch (error) {
      console.error('Failed to add dictionary entry:', error);
    }
  };

  const handleCancelAdd = () => {
    setNewEntry({ source: '', target: '', context: '' });
    setIsAddingNew(false);
  };

  const handleUpdateEntry = async (index: number, entry: DictionaryEntry) => {
    try {
      await updateEntry({
        projectId: projectId as Id<"projects">,
        entryIndex: index,
        source: entry.source,
        target: entry.target,
        context: entry.context || undefined,
      });
      setEditingIndex(null);
    } catch (error) {
      console.error('Failed to update dictionary entry:', error);
    }
  };

  const handleRemoveEntry = async (index: number) => {
    if (!confirm('Are you sure you want to remove this dictionary entry?')) return;

    try {
      await removeEntry({
        projectId: projectId as Id<"projects">,
        entryIndex: index,
      });
    } catch (error) {
      console.error('Failed to remove dictionary entry:', error);
    }
  };

  return (
    <div className={`p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-serif font-medium flex items-center gap-2">
          <BookOpen className="h-4 w-4" />
          Project Dictionary
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsAddingNew(true)}
          disabled={isAddingNew}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Entry
        </Button>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {/* Add new entry form */}
        {isAddingNew && (
          <div className="p-3 border border-primary/20 rounded-md bg-muted/10">
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Input
                  value={newEntry.source}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, source: e.target.value }))}
                  placeholder="Source term"
                  className="text-sm"
                  autoFocus
                />
                <Input
                  value={newEntry.target}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, target: e.target.value }))}
                  placeholder="Target term"
                  className="text-sm"
                />
              </div>
              <Input
                value={newEntry.context}
                onChange={(e) => setNewEntry(prev => ({ ...prev, context: e.target.value }))}
                placeholder="Context (optional)"
                className="text-sm"
              />
              <div className="flex justify-end gap-1">
                <Button variant="ghost" size="sm" onClick={handleCancelAdd} className="h-7 px-2">
                  <X className="h-3 w-3" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleAddEntry} 
                  className="h-7 px-2"
                  disabled={!newEntry.source.trim() || !newEntry.target.trim()}
                >
                  <Save className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {dictionary?.entries?.map((entry, index) => (
          <DictionaryEntryItem
            key={index}
            entry={entry}
            isEditing={editingIndex === index}
            onEdit={() => setEditingIndex(index)}
            onSave={(updatedEntry) => handleUpdateEntry(index, updatedEntry)}
            onCancel={() => setEditingIndex(null)}
            onRemove={() => handleRemoveEntry(index)}
          />
        )) || []}

        {(!dictionary?.entries || dictionary.entries.length === 0) && !isAddingNew && (
          <div className="text-center py-8 text-muted-foreground">
            <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No dictionary entries yet</p>
            <p className="text-xs">Add terms to improve translation consistency</p>
          </div>
        )}
      </div>
    </div>
  );
}

interface DictionaryEntryItemProps {
  entry: DictionaryEntry;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (entry: DictionaryEntry) => void;
  onCancel: () => void;
  onRemove: () => void;
}

function DictionaryEntryItem({
  entry,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onRemove
}: DictionaryEntryItemProps) {
  const [editedEntry, setEditedEntry] = useState(entry);

  if (isEditing) {
    return (
      <div className="p-3 border border-primary/20 rounded-md bg-muted/10">
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <Input
              value={editedEntry.source}
              onChange={(e) => setEditedEntry(prev => ({ ...prev, source: e.target.value }))}
              placeholder="Source term"
              className="text-sm"
            />
            <Input
              value={editedEntry.target}
              onChange={(e) => setEditedEntry(prev => ({ ...prev, target: e.target.value }))}
              placeholder="Target term"
              className="text-sm"
            />
          </div>
          <Input
            value={editedEntry.context || ''}
            onChange={(e) => setEditedEntry(prev => ({ ...prev, context: e.target.value }))}
            placeholder="Context"
            className="text-sm"
          />
          <div className="flex justify-end gap-1">
            <Button variant="ghost" size="sm" onClick={onCancel} className="h-7 px-2">
              <X className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onSave(editedEntry)} className="h-7 px-2">
              <Save className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 group hover:bg-muted/50 rounded-md transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium truncate">{entry.source}</span>
            <span className="text-muted-foreground">→</span>
            <span className="truncate">{entry.target}</span>
          </div>
          {entry.context && (
            <p className="text-xs text-muted-foreground mt-1 truncate">
              {entry.context}
            </p>
          )}
        </div>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="sm" onClick={onEdit} className="h-6 w-6 p-0">
            <Edit className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onRemove} className="h-6 w-6 p-0">
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
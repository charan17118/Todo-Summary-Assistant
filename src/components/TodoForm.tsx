
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Todo } from './TodoItem';

interface TodoFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (todo: Omit<Todo, 'id' | 'createdAt'>) => void;
  editingTodo: Todo | null;
}

const TodoForm: React.FC<TodoFormProps> = ({ open, onClose, onSubmit, editingTodo }) => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  // Reset form when closing or when editingTodo changes
  useEffect(() => {
    if (editingTodo) {
      setTitle(editingTodo.title);
      setPriority(editingTodo.priority);
    } else {
      setTitle('');
      setPriority('medium');
    }
  }, [editingTodo, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;
    
    onSubmit({
      title: trimmedTitle,
      priority,
      completed: editingTodo ? editingTodo.completed : false,
    });
    
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editingTodo ? 'Edit Todo' : 'Add New Todo'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Task</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              autoFocus
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select 
              value={priority} 
              onValueChange={(value) => setPriority(value as 'low' | 'medium' | 'high')}
            >
              <SelectTrigger id="priority">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {editingTodo ? 'Save Changes' : 'Add Todo'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TodoForm;

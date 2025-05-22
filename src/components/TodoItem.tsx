
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Trash, Edit } from 'lucide-react';

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
}

interface TodoItemProps {
  todo: Todo;
  onDelete: (id: string) => void;
  onEdit: (todo: Todo) => void;
  onToggleComplete: (id: string, completed: boolean) => void;
}

const priorityColors = {
  low: 'bg-todo-green/10 text-todo-green border-todo-green/30',
  medium: 'bg-todo-yellow/10 text-todo-yellow border-todo-yellow/30',
  high: 'bg-todo-red/10 text-todo-red border-todo-red/30',
};

const TodoItem: React.FC<TodoItemProps> = ({ todo, onDelete, onEdit, onToggleComplete }) => {
  return (
    <Card className="todo-item p-4 mb-3 hover:shadow-md transition-all duration-200 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <Checkbox 
            id={`todo-${todo.id}`} 
            checked={todo.completed}
            onCheckedChange={(checked) => onToggleComplete(todo.id, checked as boolean)}
          />
          <div className="flex-1">
            <label 
              htmlFor={`todo-${todo.id}`}
              className={`text-md font-medium cursor-pointer ${todo.completed ? 'line-through text-muted-foreground' : ''}`}
            >
              {todo.title}
            </label>
            <div className="flex items-center gap-2 mt-1">
              <span 
                className={`text-xs px-2 py-0.5 rounded-full border ${priorityColors[todo.priority]}`}
              >
                {todo.priority}
              </span>
              <span className="text-xs text-muted-foreground">
                {new Date(todo.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => onEdit(todo)}
            className="h-8 w-8"
          >
            <Edit size={16} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onDelete(todo.id)}
            className="h-8 w-8 text-destructive hover:bg-destructive/10"
          >
            <Trash size={16} />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default TodoItem;

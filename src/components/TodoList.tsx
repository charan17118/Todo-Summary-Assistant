
import React from 'react';
import TodoItem, { Todo } from './TodoItem';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TodoListProps {
  todos: Todo[];
  onDeleteTodo: (id: string) => void;
  onEditTodo: (todo: Todo) => void;
  onToggleComplete: (id: string, completed: boolean) => void;
}

const TodoList: React.FC<TodoListProps> = ({ todos, onDeleteTodo, onEditTodo, onToggleComplete }) => {
  // Group todos by completion status
  const pendingTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);
  
  // Sort todos by priority (high first) and then by creation date (newest first)
  const sortTodos = (todoList: Todo[]) => {
    const priorityValues = { high: 3, medium: 2, low: 1 };
    return [...todoList].sort((a, b) => {
      if (a.priority !== b.priority) {
        return priorityValues[b.priority] - priorityValues[a.priority];
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  };
  
  const sortedPendingTodos = sortTodos(pendingTodos);
  const sortedCompletedTodos = sortTodos(completedTodos);

  if (todos.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center h-60 text-center">
        <CardContent className="pt-10">
          <div className="text-4xl mb-4">📋</div>
          <p className="text-xl font-medium mb-2">No todos yet</p>
          <p className="text-muted-foreground">Add your first todo to get started</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-320px)]">
      <div className="pr-4">
        {sortedPendingTodos.length > 0 && (
          <>
            <h3 className="font-medium text-sm text-muted-foreground mb-2 ml-1">
              PENDING ({pendingTodos.length})
            </h3>
            {sortedPendingTodos.map(todo => (
              <TodoItem 
                key={todo.id}
                todo={todo}
                onDelete={onDeleteTodo}
                onEdit={onEditTodo}
                onToggleComplete={onToggleComplete}
              />
            ))}
          </>
        )}
        
        {sortedCompletedTodos.length > 0 && (
          <>
            <h3 className="font-medium text-sm text-muted-foreground mb-2 ml-1 mt-4">
              COMPLETED ({completedTodos.length})
            </h3>
            {sortedCompletedTodos.map(todo => (
              <TodoItem 
                key={todo.id}
                todo={todo}
                onDelete={onDeleteTodo}
                onEdit={onEditTodo}
                onToggleComplete={onToggleComplete}
              />
            ))}
          </>
        )}
      </div>
    </ScrollArea>
  );
};

export default TodoList;

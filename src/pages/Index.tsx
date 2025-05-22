
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import TodoList from '@/components/TodoList';
import TodoForm from '@/components/TodoForm';
import SummaryPanel from '@/components/SummaryPanel';
import { Todo } from '@/components/TodoItem';
import { loadTodos, addTodo, updateTodo, deleteTodo, toggleTodoCompleted } from '@/services/todoService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';

const Index = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(true);

  // Load todos from Supabase on initial render
  useEffect(() => {
    const fetchTodos = async () => {
      setLoading(true);
      try {
        const data = await loadTodos();
        setTodos(data);
      } catch (error) {
        console.error("Failed to load todos:", error);
        toast.error("Failed to load todos");
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, []);

  const handleAddTodo = async (todoData: Omit<Todo, 'id' | 'createdAt'>) => {
    if (editingTodo) {
      // Updating existing todo
      const updated = {
        ...editingTodo,
        title: todoData.title,
        priority: todoData.priority,
      };
      
      const updatedTodo = await updateTodo(updated);
      if (updatedTodo) {
        setTodos(todos.map(todo => todo.id === updatedTodo.id ? updatedTodo : todo));
        toast.success("Todo updated successfully");
      } else {
        toast.error("Failed to update todo");
      }
      setEditingTodo(null);
    } else {
      // Adding new todo
      const newTodo = await addTodo(todoData.title, todoData.priority);
      if (newTodo) {
        setTodos([newTodo, ...todos]);
        toast.success("Todo added successfully");
      } else {
        toast.error("Failed to add todo");
      }
    }
  };

  const handleDeleteTodo = async (id: string) => {
    const success = await deleteTodo(id);
    if (success) {
      setTodos(todos.filter(todo => todo.id !== id));
      toast.success("Todo deleted successfully");
    } else {
      toast.error("Failed to delete todo");
    }
  };

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
    setIsFormOpen(true);
  };

  const handleToggleComplete = async (id: string, completed: boolean) => {
    const updatedTodo = await toggleTodoCompleted(id, completed);
    if (updatedTodo) {
      setTodos(todos.map(todo => todo.id === id ? updatedTodo : todo));
    } else {
      toast.error("Failed to update todo status");
    }
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingTodo(null);
  };

  // Calculate counts for tab badges
  const pendingCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.filter(todo => todo.completed).length;

  return (
    <div className="container py-8 max-w-4xl animate-fade-in">
      <header className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">Todo Manager</h1>
        <p className="text-muted-foreground">Manage your tasks and get AI-powered summaries</p>
      </header>

      <div className="grid grid-cols-1 gap-8">
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Your Tasks</h2>
            <Button onClick={() => setIsFormOpen(true)} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Todo
            </Button>
          </div>

          <Card className="mb-6">
            <CardContent className="pt-6">
              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : (
                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-4">
                    <TabsTrigger value="all">
                      All ({todos.length})
                    </TabsTrigger>
                    <TabsTrigger value="pending">
                      Pending ({pendingCount})
                    </TabsTrigger>
                    <TabsTrigger value="completed">
                      Completed ({completedCount})
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="all">
                    <TodoList 
                      todos={todos} 
                      onDeleteTodo={handleDeleteTodo} 
                      onEditTodo={handleEditTodo}
                      onToggleComplete={handleToggleComplete} 
                    />
                  </TabsContent>
                  
                  <TabsContent value="pending">
                    <TodoList 
                      todos={todos.filter(todo => !todo.completed)} 
                      onDeleteTodo={handleDeleteTodo} 
                      onEditTodo={handleEditTodo}
                      onToggleComplete={handleToggleComplete} 
                    />
                  </TabsContent>
                  
                  <TabsContent value="completed">
                    <TodoList 
                      todos={todos.filter(todo => todo.completed)} 
                      onDeleteTodo={handleDeleteTodo} 
                      onEditTodo={handleEditTodo}
                      onToggleComplete={handleToggleComplete} 
                    />
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
          </Card>

          <SummaryPanel todos={todos} />
        </div>
      </div>

      <TodoForm 
        open={isFormOpen} 
        onClose={closeForm} 
        onSubmit={handleAddTodo}
        editingTodo={editingTodo}
      />
    </div>
  );
};

export default Index;

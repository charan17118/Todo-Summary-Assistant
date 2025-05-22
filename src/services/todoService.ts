
import { Todo } from "@/components/TodoItem";

// In a real app, these would interact with your backend API
// For now, we'll use localStorage to persist data

const STORAGE_KEY = "todo-app-data";

// Helper to generate a unique ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Load todos from localStorage
export const loadTodos = (): Todo[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error loading todos from localStorage:", error);
    return [];
  }
};

// Save todos to localStorage
export const saveTodos = (todos: Todo[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch (error) {
    console.error("Error saving todos to localStorage:", error);
  }
};

// Add a new todo
export const addTodo = (
  title: string,
  priority: "low" | "medium" | "high",
  completed: boolean = false
): Todo => {
  const newTodo: Todo = {
    id: generateId(),
    title,
    priority,
    completed,
    createdAt: new Date(),
  };
  
  const todos = loadTodos();
  saveTodos([...todos, newTodo]);
  return newTodo;
};

// Update an existing todo
export const updateTodo = (updatedTodo: Todo): Todo => {
  const todos = loadTodos();
  const updatedTodos = todos.map((todo) =>
    todo.id === updatedTodo.id ? { ...updatedTodo } : todo
  );
  saveTodos(updatedTodos);
  return updatedTodo;
};

// Delete a todo
export const deleteTodo = (id: string): void => {
  const todos = loadTodos();
  const updatedTodos = todos.filter((todo) => todo.id !== id);
  saveTodos(updatedTodos);
};

// Toggle the completed status of a todo
export const toggleTodoCompleted = (id: string, completed: boolean): Todo => {
  const todos = loadTodos();
  let updatedTodo: Todo | null = null;
  
  const updatedTodos = todos.map((todo) => {
    if (todo.id === id) {
      updatedTodo = { ...todo, completed };
      return updatedTodo;
    }
    return todo;
  });
  
  saveTodos(updatedTodos);
  return updatedTodo!;
};

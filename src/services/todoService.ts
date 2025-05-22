
import { Todo } from "@/components/TodoItem";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client with fallbacks and console warnings for debugging
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if the environment variables are available
if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase environment variables. Please check your .env file.");
}

// Create the Supabase client with more robust error handling
const supabase = createClient(
  supabaseUrl || 'https://placeholder-url.supabase.co', 
  supabaseKey || 'placeholder-key'
);

// Helper to generate a unique ID (fallback if needed)
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Load todos from Supabase
export const loadTodos = async (): Promise<Todo[]> => {
  try {
    if (!supabaseUrl || !supabaseKey) {
      console.error("Supabase credentials missing. Using empty todos array as fallback.");
      return [];
    }
    
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order('createdAt', { ascending: false });
      
    if (error) {
      console.error("Error loading todos from Supabase:", error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Error loading todos:", error);
    return [];
  }
};

// Save a todo to Supabase
export const saveTodo = async (todo: Omit<Todo, 'id' | 'createdAt'>): Promise<Todo | null> => {
  try {
    if (!supabaseUrl || !supabaseKey) {
      console.error("Supabase credentials missing. Cannot save todo.");
      return null;
    }
    
    const newTodo = {
      ...todo,
      createdAt: new Date(),
    };
    
    const { data, error } = await supabase
      .from('todos')
      .insert(newTodo)
      .select()
      .single();
      
    if (error) {
      console.error("Error saving todo to Supabase:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Error saving todo:", error);
    return null;
  }
};

// Add a new todo
export const addTodo = async (
  title: string,
  priority: "low" | "medium" | "high",
  completed: boolean = false
): Promise<Todo | null> => {
  return await saveTodo({
    title,
    priority,
    completed
  });
};

// Update an existing todo
export const updateTodo = async (updatedTodo: Todo): Promise<Todo | null> => {
  try {
    if (!supabaseUrl || !supabaseKey) {
      console.error("Supabase credentials missing. Cannot update todo.");
      return null;
    }
    
    const { data, error } = await supabase
      .from('todos')
      .update({
        title: updatedTodo.title,
        priority: updatedTodo.priority,
        completed: updatedTodo.completed
      })
      .eq('id', updatedTodo.id)
      .select()
      .single();
      
    if (error) {
      console.error("Error updating todo in Supabase:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Error updating todo:", error);
    return null;
  }
};

// Delete a todo
export const deleteTodo = async (id: string): Promise<boolean> => {
  try {
    if (!supabaseUrl || !supabaseKey) {
      console.error("Supabase credentials missing. Cannot delete todo.");
      return false;
    }
    
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error("Error deleting todo from Supabase:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error deleting todo:", error);
    return false;
  }
};

// Toggle the completed status of a todo
export const toggleTodoCompleted = async (id: string, completed: boolean): Promise<Todo | null> => {
  try {
    if (!supabaseUrl || !supabaseKey) {
      console.error("Supabase credentials missing. Cannot toggle todo completion.");
      return null;
    }
    
    const { data, error } = await supabase
      .from('todos')
      .update({ completed })
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error("Error updating todo completion status in Supabase:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Error toggling todo completion:", error);
    return null;
  }
};

// Generate summary with LLM and send to Slack
export const generateAndSendSummary = async (): Promise<{ success: boolean; message: string }> => {
  try {
    if (!supabaseUrl || !supabaseKey) {
      console.error("Supabase credentials missing. Cannot generate summary.");
      return { 
        success: false, 
        message: "Missing Supabase credentials. Please check your environment variables." 
      };
    }
    
    const { data, error } = await supabase.functions.invoke('summarize-todos');
    
    if (error) {
      console.error("Error generating summary:", error);
      return { 
        success: false, 
        message: `Failed to generate summary: ${error.message}` 
      };
    }
    
    return data || { 
      success: true, 
      message: "Summary generated and sent to Slack successfully!" 
    };
  } catch (error: any) {
    console.error("Error in summary generation:", error);
    return { 
      success: false, 
      message: `An unexpected error occurred: ${error?.message || 'Unknown error'}` 
    };
  }
};


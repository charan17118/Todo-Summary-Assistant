
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDown, MessageSquare, Send, Loader2 } from 'lucide-react';
import { Todo } from './TodoItem';
import { toast } from "sonner";
import { generateAndSendSummary } from '@/services/todoService';

interface SummaryPanelProps {
  todos: Todo[];
}

const SummaryPanel: React.FC<SummaryPanelProps> = ({ todos }) => {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [slackSending, setSlackSending] = useState(false);

  const pendingTodos = todos.filter(todo => !todo.completed);

  const handleGenerateAndSendSummary = async () => {
    setLoading(true);
    setSummary(null);
    
    try {
      const result = await generateAndSendSummary();
      
      if (result.success) {
        setSummary(result.message);
        toast.success("Summary sent to Slack successfully!");
      } else {
        toast.error(result.message || "Failed to generate and send summary");
      }
    } catch (error) {
      toast.error("An error occurred while generating the summary");
      console.error("Error generating summary:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageSquare size={20} className="mr-2" /> Todo Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        {summary ? (
          <div className="bg-muted p-4 rounded-md text-sm animate-fade-in">
            {summary}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            {todos.length === 0 ? (
              <p>Add some todos to generate a summary</p>
            ) : (
              <>
                <p>Generate a summary of your pending tasks</p>
                <ArrowDown className="mx-auto mt-2 animate-pulse-soft" size={20} />
              </>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between flex-col sm:flex-row gap-2">
        <Button 
          onClick={handleGenerateAndSendSummary} 
          disabled={loading || pendingTodos.length === 0}
          className="w-full sm:w-auto"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating & Sending...
            </>
          ) : (
            <>
              Generate & Send to Slack
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SummaryPanel;

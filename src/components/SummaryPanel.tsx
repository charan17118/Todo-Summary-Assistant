
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDown, MessageSquare, Send, Loader2 } from 'lucide-react';
import { Todo } from './TodoItem';
import { toast } from "sonner";

interface SummaryPanelProps {
  todos: Todo[];
}

const SummaryPanel: React.FC<SummaryPanelProps> = ({ todos }) => {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [slackSending, setSlackSending] = useState(false);

  const pendingTodos = todos.filter(todo => !todo.completed);

  const generateSummary = async () => {
    // In a real implementation, this would call your backend API
    setLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Example summary - in real app this would come from the LLM
      const fakeSummary = pendingTodos.length > 0 
        ? `You have ${pendingTodos.length} pending tasks. ${pendingTodos.length > 2 ? 'Focus on completing the high priority items first.' : 'They should be manageable to complete soon.'} ${pendingTodos.filter(t => t.priority === 'high').length > 0 ? 'There are some high priority items that need your attention.' : 'Most items are not high priority.'}`
        : "Great job! You've completed all your tasks. Time to add new goals.";
      
      setSummary(fakeSummary);
    } catch (error) {
      toast.error("Failed to generate summary");
      console.error("Error generating summary:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const sendToSlack = async () => {
    if (!summary) return;
    
    setSlackSending(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Summary sent to Slack successfully!");
    } catch (error) {
      toast.error("Failed to send to Slack");
      console.error("Error sending to Slack:", error);
    } finally {
      setSlackSending(false);
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
          onClick={generateSummary} 
          disabled={loading || pendingTodos.length === 0}
          className="w-full sm:w-auto"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : 'Generate Summary'}
        </Button>
        
        <Button 
          variant="outline" 
          onClick={sendToSlack} 
          disabled={!summary || slackSending}
          className="w-full sm:w-auto"
        >
          {slackSending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send size={16} className="mr-2" />
              Send to Slack
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SummaryPanel;

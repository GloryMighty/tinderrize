import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "@/integrations/supabase/client";
import { UserCredits } from "./UserCredits";

export const ChatAssistant = ({ onScoreUpdate }: { onScoreUpdate: (score: number) => void }) => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsLoading(true);
    try {
      // Check user credits first
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "Please sign in to use this feature.",
          variant: "destructive",
        });
        return;
      }

      const { data: credits } = await supabase
        .from('user_credits')
        .select('tokens')
        .eq('id', user.id)
        .single();

      if (!credits || credits.tokens < 1) {
        toast({
          title: "Insufficient tokens",
          description: "Please upgrade to continue using this feature.",
          variant: "destructive",
        });
        return;
      }

      const { data: { secrets } } = await supabase.functions.invoke('get-secret', {
        body: { name: 'GEMINI_API_KEY' }
      });
      
      const genAI = new GoogleGenerativeAI(secrets.value);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

      const prompt = `You are RizzMaster, world-class guru of Dating, a Tinderizzer AI.
Analyze user message: "${message}". Improve user's message for dating purposes. Answer in 10 strings max.
Personalize his message, assess engagement on the scale from 1 to 10. Check for humor/wit and evaluate confidence of the message. 
Look for originality and ensure relevance.
Consider message context, check grammar and spelling, be careful though, as it might fit the context.
Provide the overall "rizz's" assessment. 
Highlight strengths of the rizz.

Identify areas to improve and suggest concrete changes that will help user to improve his verse. 

It's crucial that your answer should contain only 10 strings of text analysis, no longer than 8 words per string. 
In the end of your analysis provide Rizz Score (0-100). Format score as: SCORE: [number]. 

In your response don't use ", [, {, and so on. But your Rizz Score should be on the scale to 100. 
It's extremely important that in your answer you don't use any additional symbols, besides commas and periods.
`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Deduct token after successful API call
      await supabase
        .from('user_credits')
        .update({ tokens: credits.tokens - 1 })
        .eq('id', user.id);

      // Extract score from the response
      const scoreMatch = text.match(/SCORE:\s*(\d+)/);
      if (scoreMatch && scoreMatch[1]) {
        const score = parseInt(scoreMatch[1], 10);
        if (score >= 0 && score <= 100) {
          onScoreUpdate(score);
        }
      }

      toast({
        title: "AI Feedback",
        description: text,
      });
    } catch (error) {
      console.error("Error getting AI feedback:", error);
      toast({
        title: "Error",
        description: "Failed to get AI feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 w-full max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">AI Chat Assistant</h2>
        <UserCredits />
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          placeholder="Type your initial rizz..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="min-h-[100px]"
        />
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
          disabled={isLoading}
        >
          {isLoading ? "Getting Feedback..." : "Tinderrize"}
        </Button>
      </form>
    </Card>
  );
};
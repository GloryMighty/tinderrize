import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { GoogleGenerativeAI, DynamicRetrievalMode } from "@google/generative-ai";
import { supabase } from "@/integrations/supabase/client";

// Config for ChatAssistant component
const generationConfig = {
  temperature: 0,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 800,
  responseMimeType: "text/plain",
};

export const ChatAssistant = ({ onScoreUpdate }: { onScoreUpdate: (score: number) => void }) => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsLoading(true);
    try {
      const { data: { secrets } } = await supabase.functions.invoke('get-secret', {
        body: { name: 'GEMINI_API_KEY' }
      });
      
      const genAI = new GoogleGenerativeAI(secrets.value);
      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash-exp",
        tools: [
          {
            googleSearch: {  // Changed from googleSearchRetrieval
              enable_search: true,
            },
          },
        ],
      });

      const chatSession = model.startChat({
        generationConfig,
        history: [
          {
            role: "user",
            parts: [{ text: message }],
          }
        ],
      });

      const prompt = `You are RizzMaster, world-class guru of Dating, a Tinderizzer AI.
Analyze user message in ${message}. 
Improve user's message for dating purposes. Answer in 10 strings max.
Personalize his message, assess engagement on the scale from 1 to 10. Check for humor/wit and evaluate confidence of the message. 
Look for originality and ensure relevance.
Consider message context, check grammar and spelling, be careful though, as it might fit the context.
Provide the overall "rizz's" assessment. 
Highlight strengths of the rizz.

Identify areas to improve and suggest concrete changes that will help user to improve his verse. 

It's crucial that your answer should contain only 10 strings of text analysis, no longer than 8 words per string. 
In the end of your analysis provide "Rizz Score" (0-100). Format score as: "SCORE: [number]"
`;

      const result = await chatSession.sendMessage(prompt);
      const response = result.response;
      const text = response.text();

      // Extract score from the response
      const scoreMatch = text.match(/SCORE:\s*(\d+)/);
      if (scoreMatch && scoreMatch[1]) {
        const score = parseInt(scoreMatch[1], 10);
        if (score >= 0 && score <= 100) {
          onScoreUpdate(score);
        }
      }

      toast({
        title: "Keep improving",
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
      <h2 className="text-xl font-semibold mb-4">AI Chat Assistant</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          placeholder="Your rizz is here..."
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

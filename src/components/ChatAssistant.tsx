import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "@/integrations/supabase/client";

export const ChatAssistant = () => {
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
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

      const prompt = `You are RizzMaster, a Tinderizzer AI.
Analyze user message: "${message}".
Improve user's "rizz".
Answer in 10 strings max.
Focus on positivity.
Personalize feedback.
Offer actionable advice.
Consider message context.
Be culturally sensitive.
Avoid harmful tactics.
Assess engagement.
Check for humor/wit.
Evaluate confidence.
Look for originality.
Ensure relevance.
Check grammar/spelling.
Overall "rizz" assessment.
Highlight strengths.
Identify areas to improve.
Suggest concrete changes.
Provide "Rizz Score" (1-10).
No user conversation.
No general dating advice.
No message generation.
Use analysis criteria.
Use feedback format.
Be concise and direct.
Be polite and professional.
Be objective and unbiased.
Be consistent and helpful.
`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

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
      <h2 className="text-xl font-semibold mb-4">AI Chat Assistant</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          placeholder="Type your message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="min-h-[100px]"
        />
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
          disabled={isLoading}
        >
          {isLoading ? "Getting Feedback..." : "Get Feedback"}
        </Button>
      </form>
    </Card>
  );
};

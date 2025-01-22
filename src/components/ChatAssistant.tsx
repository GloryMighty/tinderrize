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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "Please sign in to use this feature.",
          variant: "destructive",
        });
        return;
      }

      // In development, skip token check
      if (import.meta.env.DEV) {
        const { data: { secrets } } = await supabase.functions.invoke('get-secret', {
          body: { name: 'GEMINI_API_KEY' }
        });
        
        const genAI = new GoogleGenerativeAI(secrets.value);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

        const prompt = `You're the world class dating guru. Your taslk is to analyse user's inputs and how applicable they are to the user's matches:

User's preferences:
- Rizz Style: ${preferences?.rizz_style || 'casual'}
- Match Height: ${preferences?.height || 'Not specified'} cm
- Match Age: ${preferences?.age || 'Not specified'} years
- Match Body Type: ${preferences?.body_type || 'Not specified'}
- Match Lifestyle: ${preferences?.lifestyle || 'Not specified'}
- Relationship Goal: ${preferences?.relationship_goal || 'Not specified'}

Analyze user message: "${message}". Improve user's message for dating purposes. Answer in 10 strings max.
Personalize his message, assess engagement on the scale from 1 to 10. Check for humor/wit and evaluate confidence of the message. 
Personalize his message based on the match preferences above.
Assess engagement on the scale from 1 to 10. Check for humor/wit and evaluate confidence of the message. 
Look for originality and ensure relevance.
Consider message context, check grammar and spelling, be careful though, as it might fit the context.
Provide the overall "rizz's" assessment. 

In your response don't use ", [, {, and so on. But your Rizz Score should be on the scale to 100. 
It's extremely important that in your answer you don't use any additional symbols, besides commas and periods.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

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
        return;
      }

      // Production token check logic
      const { data: credits } = await supabase
        .from('user_credits')
        .select('tokens')
        .eq('id', user.id)
        .maybeSingle();

      if (!credits) {
        const { data: newCredits } = await supabase
          .from('user_credits')
          .insert({ id: user.id, tokens: 10 })
          .select('tokens')
          .single();

        if (!newCredits || newCredits.tokens < 1) {
          toast({
            title: "Insufficient tokens",
            description: "Please upgrade to continue using this feature.",
            variant: "destructive",
          });
          return;
        }
      } else if (credits.tokens < 1) {
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

      const prompt = `You're the world class dating guru. Your taslk is to analyse user's inputs and how applicable they are to the user's matches:

User's preferences:
- Rizz Style: ${preferences?.rizz_style || 'casual'}
- Match Height: ${preferences?.height || 'Not specified'} cm
- Match Age: ${preferences?.age || 'Not specified'} years
- Match Body Type: ${preferences?.body_type || 'Not specified'}
- Match Lifestyle: ${preferences?.lifestyle || 'Not specified'}
- Relationship Goal: ${preferences?.relationship_goal || 'Not specified'}

Analyze user message: "${message}". Improve user's message for dating purposes. Answer in 10 strings max.
Personalize his message, assess engagement on the scale from 1 to 10. Check for humor/wit and evaluate confidence of the message. 
Personalize his message based on the match preferences above.
Assess engagement on the scale from 1 to 10. Check for humor/wit and evaluate confidence of the message. 
Look for originality and ensure relevance.
Consider message context, check grammar and spelling, be careful though, as it might fit the context.
Provide the overall "rizz's" assessment. 

In your response don't use ", [, {, and so on. But your Rizz Score should be on the scale to 100. 
It's extremely important that in your answer you don't use any additional symbols, besides commas and periods.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Deduct token after successful API call (only in production)
      const { error: updateError } = await supabase
        .from('user_credits')
        .update({ tokens: credits ? credits.tokens - 1 : 9 })
        .eq('id', user.id);

      if (updateError) {
        console.error("Error updating credits:", updateError);
      }

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
    <Card className="p-6 w-full max-w-2xl mx-auto bg-white/5 backdrop-blur-sm border-primary/10 shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">AI Chat Assistant</h2>
        {!import.meta.env.DEV && <UserCredits />}
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Textarea
          placeholder="Type your initial rizz..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="min-h-[120px] bg-white/10 border-primary/20 focus:border-primary/40 placeholder:text-gray-400"
        />
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90 transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
          disabled={isLoading}
        >
          {isLoading ? "Getting Feedback..." : "Tinderrize"}
        </Button>
      </form>
    </Card>
  );
};

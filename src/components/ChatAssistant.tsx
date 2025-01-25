import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "@/integrations/supabase/client";
import { UserCredits } from "./UserCredits";

interface UserPreferences {
  rizz_style?: string;
  height?: number;
  age?: number;
  body_type?: string;
  lifestyle?: string;
  relationship_goal?: string;
}

interface ChatHistory {
  role: "user" | "assistant";
  content: string;
}

// Define the generation config for the model
const GENERATION_CONFIG = {
  temperature: 0.5,
  topP: 0.8,
  topK: 40,
  maxOutputTokens: 1000,
};

const SYSTEM_PROMPT = `You are Tinderizzer, an expert dating coach specializing in message analysis and improvement.
You help users craft better messages based on their match's preferences and characteristics.

IMPORTANT: Your response MUST strictly follow this format, using exactly these section headers:

<Tinderizzer thoughts> 
A brief, 1-2 sentence analysis focusing on the message's key strengths and areas for improvement. 
Emphasize that you understand the match's preferences and the analysis is structured from it.

 <Improved>
A single improved version of the message, tailored to the match's preferences.

Humor: [Score 1-10]
Confidence: [Score 1-10]
Authenticity: [Score 1-10]
Match Alignment: [Score 1-10] (how well it aligns with match preferences)

RIZZ SCORE: [0-100]

Rules:
1. Use ONLY the section headers above
2. Keep responses concise and actionable
3. Base improvements on match preferences
4. Use only periods and commas for punctuation
5. Ensure the improved version maintains user's original intent`;

export const ChatAssistant = ({ onScoreUpdate }: { onScoreUpdate: (score: number) => void }) => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const { toast } = useToast();

  // Fetch user preferences on component mount
  useEffect(() => {
    const fetchPreferences = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('user_preferences')
          .select('*')
          .eq('id', user.id)
          .single();
        setPreferences(data);
      }
    };
    fetchPreferences();
  }, []);

  const getPrompt = (userMessage: string, history: ChatHistory[]) => {
    const matchContext = preferences ? `
MATCH CONTEXT
Style Preference: ${preferences.rizz_style || 'Not specified'}
Height: ${preferences.height ? preferences.height + 'cm' : 'Not specified'}
Age: ${preferences.age ? preferences.age + ' years' : 'Not specified'}
Body Type: ${preferences.body_type || 'Not specified'}
Lifestyle: ${preferences.lifestyle || 'Not specified'}
Relationship Goal: ${preferences.relationship_goal || 'Not specified'}

Consider these match preferences carefully when analyzing and improving the message.` : '';

    const historyContext = history.length > 0 ? 
      "\nPREVIOUS INTERACTIONS:\n" + history.slice(-2).map(msg => 
        `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
      ).join('\n') : '';

    return `${SYSTEM_PROMPT}

${matchContext}
${historyContext}

MESSAGE TO ANALYZE: ${userMessage}

Provide your analysis and improvements following the exact format specified above.`;
  };

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

        const prompt = getPrompt(message, chatHistory);
        
        const result = await model.generateContent({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: GENERATION_CONFIG,
        });

        const responseText = result.response.text();
        
        // Update chat history
        setChatHistory(prev => [
          ...prev,
          { role: "user", content: message },
          { role: "assistant", content: responseText }
        ]);

        // Parse score with more specific regex
        const scoreMatch = responseText.match(/RIZZ SCORE:\s*(\d{1,3})/);
        if (scoreMatch && scoreMatch[1]) {
          const score = parseInt(scoreMatch[1], 10);
          if (score >= 0 && score <= 100) {
            onScoreUpdate(score);
          }
        }

        toast({
          title: "Analysis Complete",
          description: responseText,
          duration: 10000,
        });

        setMessage("");
        return;
      }

      // Production flow
      const { data: credits } = await supabase
        .from('user_credits')
        .select('tokens')
        .eq('id', user.id)
        .maybeSingle();

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
      const prompt = getPrompt(message, chatHistory);

      const result = await model.generateContent({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: GENERATION_CONFIG
      });

      const responseText = result.response.text();

      // Deduct token after successful response
      const { error: updateError } = await supabase
        .from('user_credits')
        .update({ tokens: credits.tokens - 1 })
        .eq('id', user.id);

      if (updateError) {
        console.error("Error updating credits:", updateError);
      }

      // Update chat history
      setChatHistory(prev => [
        ...prev,
        { role: "user", content: message },
        { role: "assistant", content: responseText }
      ]);

      // Parse score with more specific regex
      const scoreMatch = responseText.match(/RIZZ SCORE:\s*(\d{1,3})/);
      if (scoreMatch && scoreMatch[1]) {
        const score = parseInt(scoreMatch[1], 10);
        if (score >= 0 && score <= 100) {
          onScoreUpdate(score);
        }
      }

      toast({
        title: "Analysis Complete",
        description: responseText,
        duration: 10000,
      });

      setMessage("");
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
        <h2 className="text-2xl font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Tinderrizer</h2>
        {!import.meta.env.DEV && <UserCredits />}
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Textarea
          placeholder="Type your rizz..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="min-h-[120px] bg-white/10 border-primary/20 focus:border-primary/40 placeholder:text-gray-400"
        />
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90 transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
          disabled={isLoading}
        >
          {isLoading ? "Analysing..." : "Tinderrize"}
        </Button>
      </form>
    </Card>
  );
};

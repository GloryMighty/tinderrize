import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "@/integrations/supabase/client";
import { ChatInput } from "./ChatInput";
import { ChatMessage as ChatMessageType } from "@/types/chat";
import { ChatHistory } from "./ChatHistory";
import { ChatHeader } from "./ChatHeader";
import { PreferencesPanel } from "./PreferencesPanel";

interface UserPreferences {
  rizz_style?: string;
  height?: number;
  age?: number;
  body_type?: string;
  lifestyle?: string;
  relationship_goal?: string;
}

export const ChatAssistant = ({ onScoreUpdate }: { onScoreUpdate: (score: number) => void }) => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [rizzStyle, setRizzStyle] = useState("casual");
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const { toast } = useToast();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage: ChatMessageType = {
      role: 'user',
      content: message,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    
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

        const chat = model.startChat({
          history: messages.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
          }))
        });

        const prompt = `You are RizzMaster, world-class guru of Dating, a Tinderizzer AI.
User's preferences:
- Rizz Style: ${preferences?.rizz_style || rizzStyle}
- Match Height: ${preferences?.height || 'Not specified'} cm
- Match Age: ${preferences?.age || 'Not specified'} years
- Match Body Type: ${preferences?.body_type || 'Not specified'}
- Match Lifestyle: ${preferences?.lifestyle || 'Not specified'}
- Relationship Goal: ${preferences?.relationship_goal || 'Not specified'}

Analyze user message: "${message}". Improve user's message for dating purposes.`;

        const result = await chat.sendMessage(prompt);
        const response = await result.response;
        const text = response.text();

        const scoreMatch = text.match(/SCORE:\s*(\d+)/);
        if (scoreMatch && scoreMatch[1]) {
          const score = parseInt(scoreMatch[1], 10);
          if (score >= 0 && score <= 100) {
            onScoreUpdate(score);
          }
        }

        const aiMessage: ChatMessageType = {
          role: 'assistant',
          content: text,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiMessage]);
        setMessage("");
        return;
      }

      // Production token check logic
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

      // Create chat with history
      const chat = model.startChat({
        history: messages.map(msg => ({
          role: msg.role,
          parts: [msg.content]
        }))
      });

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
It's extremely important that in your answer you don't use any additional symbols, besides commas and periods.`;

      const result = await chat.sendMessage(prompt);
      const response = await result.response;
      const text = response.text();

      // Deduct token after successful API call (only in production)
      const { error: updateError } = await supabase
        .from('user_credits')
        .update({ tokens: credits.tokens - 1 })
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

      // Add AI response to chat
      const aiMessage: ChatMessageType = {
        role: 'assistant',
        content: text,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
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
    <Card className="h-full p-6 bg-gradient-to-b from-white/5 to-primary/5 backdrop-blur-sm border-primary/10 shadow-xl overflow-hidden flex flex-col">
      <ChatHeader />
      <PreferencesPanel 
        rizzStyle={rizzStyle}
        onRizzStyleChange={setRizzStyle}
      />
      <ChatHistory messages={messages} />
      <ChatInput
        message={message}
        setMessage={setMessage}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </Card>
  );
};
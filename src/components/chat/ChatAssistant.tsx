import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ChatInput } from "./ChatInput";
import { ChatHistory } from "./ChatHistory";
import { ChatHeader } from "./ChatHeader";
import { generateAIResponse } from "@/utils/aiChat";
import { usePreferences } from "@/hooks/usePreferences";
import { ChatMessage } from "@/types/chat";
import { FeedbackButton } from "../FeedbackButton";

interface ChatAssistantProps {
  onScoreUpdate: (score: number) => void;
  onFirstMessage?: () => void;
  onTypingStateChange?: (typing: boolean) => void;
}

export const ChatAssistant = ({ 
  onScoreUpdate, 
  onFirstMessage,
  onTypingStateChange 
}: ChatAssistantProps) => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const { preferences } = usePreferences();
  const { toast } = useToast();
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    onTypingStateChange?.(message.length > 0);
  }, [message, onTypingStateChange]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    if (!hasInteracted) {
      setHasInteracted(true);
      onFirstMessage?.();
    }

    const userMessage: ChatMessage = {
      role: 'user',
      content: message,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setMessage("");
    
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

        const text = await generateAIResponse(message, preferences, messages, secrets);

        // Parse score with more specific regex
        const scoreMatch = text.match(/RIZZ SCORE:\s*(\d{1,3})/);
        if (scoreMatch && scoreMatch[1]) {
          const score = parseInt(scoreMatch[1], 10);
          if (score >= 0 && score <= 100) {
            onScoreUpdate(score);
          }
        }

        const aiMessage: ChatMessage = {
          role: 'assistant',
          content: text,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiMessage]);
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

      const text = await generateAIResponse(message, preferences, messages, secrets);

      // Deduct token after successful API call
      const { error: updateError } = await supabase
        .from('user_credits')
        .update({ tokens: credits.tokens - 1 })
        .eq('id', user.id);

      if (updateError) {
        console.error("Error updating credits:", updateError);
      }

      // Parse score with more specific regex
      const scoreMatch = text.match(/RIZZ SCORE:\s*(\d{1,3})/);
      if (scoreMatch && scoreMatch[1]) {
        const score = parseInt(scoreMatch[1], 10);
        if (score >= 0 && score <= 100) {
          onScoreUpdate(score);
        }
      }

      const aiMessage: ChatMessage = {
        role: 'assistant',
        content: text,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);

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
      <Card className={`h-full p-6 bg-gradient-to-b from-white/5 to-primary/5 backdrop-blur-sm 
                     border-primary/10 shadow-xl overflow-hidden flex flex-col
                     transition-all duration-500 ease-in-out`}>
      <ChatHeader />
      <ChatHistory messages={messages} />
      <ChatInput
        message={message}
        setMessage={setMessage}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
      <FeedbackButton formUrl="https://forms.gle/kGgRBkF3HNSRZy728" />
    </Card>
  );
};
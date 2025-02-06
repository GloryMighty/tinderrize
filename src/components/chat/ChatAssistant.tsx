import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ChatInput } from "./ChatInput";
import { ChatHistory } from "./ChatHistory";
import { ChatHeader } from "./ChatHeader";
import { handleAIResponse } from "@/utils/aiChat";
import { usePreferences } from "@/hooks/usePreferences";
import { ChatMessage } from "@/types/chat";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    onFirstMessage?.();
    onTypingStateChange?.(true);

    const userMessage: ChatMessage = {
      role: 'user',
      content: message,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setMessage("");
    
    setIsLoading(true);
    try {
      const text = await handleAIResponse(
        message,
        preferences,
        messages,
        onScoreUpdate,
        import.meta.env.DEV
      );

      const aiMessage: ChatMessage = {
        role: 'assistant',
        content: text,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);

      toast({
        title: "Analysis Complete",
        description: text,
        duration: 10000,
      });
    } catch (error) {
      console.error("Error getting AI feedback:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get AI feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      onTypingStateChange?.(false);
    }
  };

  return (
    <Card className="h-full p-6 bg-gradient-to-b from-white/5 to-primary/5 backdrop-blur-sm 
                     border-primary/10 shadow-xl overflow-hidden flex flex-col">
      <ChatHeader />
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
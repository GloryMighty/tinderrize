import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

interface ChatInputProps {
  message: string;
  setMessage: (message: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export const ChatInput = ({ message, setMessage, onSubmit, isLoading }: ChatInputProps) => {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (message.trim()) {
        onSubmit(e as unknown as React.FormEvent);
      }
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="relative">
        <Textarea
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          className="min-h-[40px] bg-white/10 border-primary/20 focus:border-primary/40 placeholder:text-gray-400 pr-12 resize-none 
                    dark:bg-gray-400/50 dark:border-gray-700 dark:focus:border-primary/40
                    backdrop-blur-sm transition-all duration-300"
        />
        <Button
          type="submit"
          size="icon"
          className="absolute bottom-4 right-4 bg-primary/20 hover:bg-primary/30 
                     dark:bg-primary/50 dark:hover:bg-primary/50
                     transition-all duration-300"
          disabled={isLoading}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};

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
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="relative">
        <Textarea
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="min-h-[120px] bg-white/10 border-primary/20 focus:border-primary/40 placeholder:text-gray-400 pr-12 resize-none"
        />
        <Button
          type="submit"
          size="icon"
          className="absolute bottom-4 right-4 bg-primary/20 hover:bg-primary/30"
          disabled={isLoading}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};
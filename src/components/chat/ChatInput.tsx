import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ChatInputProps {
  message: string;
  setMessage: (message: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export const ChatInput = ({ message, setMessage, onSubmit, isLoading }: ChatInputProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Textarea
        placeholder="Type your initial rizz..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="min-h-[120px] bg-white/10 border-primary/20 focus:border-primary/40 placeholder:text-gray-400 resize-none"
      />
      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90 transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
        disabled={isLoading}
      >
        {isLoading ? "Getting Feedback..." : "Tinderrize"}
      </Button>
    </form>
  );
};
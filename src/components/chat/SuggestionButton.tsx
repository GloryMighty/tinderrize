import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";

interface SuggestionButtonProps {
  suggestion: string;
}

export const SuggestionButton = ({ suggestion }: SuggestionButtonProps) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(suggestion);
      toast.success("Copied to clipboard!", {
        duration: 1200 // 1.2 seconds duration
      });
    } catch (err) {
      toast.error("Failed to copy text", {
        duration: 1200 // 1.2 seconds duration
      });
    }
  };

  return (
    <Button
      onClick={handleCopy}
      className="w-full max-w-md mx-auto mb-4 bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90 group relative overflow-hidden"
    >
      <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
      <span className="font-medium">Tinderizzer's Suggestion</span>
    </Button>
  );
};

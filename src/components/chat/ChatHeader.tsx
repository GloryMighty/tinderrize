import { UserCredits } from "../UserCredits";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ChatHeaderProps {
  suggestion?: string;
}

export const ChatHeader = ({ suggestion }: ChatHeaderProps) => {
  const { toast } = useToast();

  const handleCopy = async () => {
    if (suggestion) {
      try {
        await navigator.clipboard.writeText(suggestion);
        toast({
          title: "Copied to clipboard!",
          duration: 2000
        });
      } catch (err) {
        toast({
          title: "Failed to copy text",
          variant: "destructive",
          duration: 2000
        });
      }
    }
  };

  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          AI Chat Assistant
        </h2>
        {!import.meta.env.DEV && <UserCredits />}
      </div>
      
      {suggestion && (
        <Button
          onClick={handleCopy}
          variant="outline"
          className="w-full bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 flex items-center gap-2"
        >
          <Copy className="h-4 w-4" />
          Copy Suggestion
        </Button>
      )}
    </div>
  );
};
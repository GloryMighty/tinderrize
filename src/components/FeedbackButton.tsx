import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";

interface FeedbackButtonProps {
  formUrl: string;
}

export const FeedbackButton = ({ formUrl }: FeedbackButtonProps) => {
  return (
    <Button
      asChild
      variant="outline"
      className="w-full max-w-xs mx-auto mt-4 justify-center rounded-full border-primary/50 hover:bg-primary/10 text-sm"
    >
      <a
        href={formUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 w-full justify-center"
      >
        <HelpCircle className="w-4 h-4" />
        Send Feedback
      </a>
    </Button>
  );
}; 
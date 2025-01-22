import { ChatMessage as ChatMessageType } from "@/types/chat";
import { cn } from "@/lib/utils";

export const ChatMessage = ({ message }: { message: ChatMessageType }) => {
  return (
    <div className={cn(
      "mb-4 p-4 rounded-lg max-w-[80%]",
      message.role === 'user' 
        ? "ml-auto bg-primary/10 text-primary-foreground" 
        : "mr-auto bg-secondary/10 text-secondary-foreground"
    )}>
      <div className="text-sm font-medium mb-1">
        {message.role === 'user' ? 'You' : 'AI Assistant'}
      </div>
      <div className="text-sm whitespace-pre-wrap">{message.content}</div>
    </div>
  );
};
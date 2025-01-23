import { ChatMessage as ChatMessageType } from "@/types/chat";
import { cn } from "@/lib/utils";
import { ChatAvatar } from "./ChatAvatar";

export const ChatMessage = ({ message }: { message: ChatMessageType }) => {
  const isAssistant = message.role === 'assistant';
  
  return (
    <div className={cn(
      "flex items-start gap-3 mb-4",
      isAssistant ? "flex-row" : "flex-row-reverse"
    )}>
      <ChatAvatar role={message.role} />
      <div className={cn(
        "p-4 rounded-lg max-w-[80%]",
        isAssistant 
          ? "bg-secondary/10 text-secondary-foreground" 
          : "bg-primary/10 text-primary-foreground"
      )}>
        <div className="text-sm font-bold mb-1 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          {isAssistant ? 'Tinderizzer' : 'You'}
        </div>
        <div className="text-sm whitespace-pre-wrap">{message.content}</div>
      </div>
    </div>
  );
};
import { ChatMessage as ChatMessageType } from "@/types/chat";
import { cn } from "@/lib/utils";
import { ChatAvatar } from "./ChatAvatar";
import { SuggestionButton } from "./SuggestionButton";
import { parseAiResponse } from "@/utils/parseAiResponse";

export const ChatMessage = ({ message }: { message: ChatMessageType }) => {
  const isAssistant = message.role === 'assistant';
  const improvedVersion = isAssistant ? parseAiResponse(message.content) : null;
  
  return (
    <div className="space-y-4">
      {improvedVersion && (
        <SuggestionButton suggestion={improvedVersion} />
      )}
      <div className={cn(
        "flex items-start gap-3",
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
    </div>
  );
};
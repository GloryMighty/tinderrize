import { ChatMessage as ChatMessageType } from "@/types/chat";
import { ChatMessage } from "./ChatMessage";

interface ChatHistoryProps {
  messages: ChatMessageType[];
}

export const ChatHistory = ({ messages }: ChatHistoryProps) => {
  return (
    <div className="flex-1 overflow-y-auto mb-6 px-4 space-y-4 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
      {messages.map((msg, index) => (
        <ChatMessage key={index} message={msg} />
      ))}
      {messages.length === 0 && (
        <div className="text-center text-muted-foreground p-4">
          Start the conversation by sending a message...
        </div>
      )}
    </div>
  );
};
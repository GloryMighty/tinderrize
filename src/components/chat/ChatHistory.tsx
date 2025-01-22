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
    </div>
  );
};
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, User } from "lucide-react";

interface ChatAvatarProps {
  role: 'user' | 'assistant';
}

export const ChatAvatar = ({ role }: ChatAvatarProps) => {
  return (
    <Avatar className={`${role === 'assistant' ? 'bg-primary/10' : 'bg-secondary/10'} h-8 w-8`}>
      <AvatarFallback>
        {role === 'assistant' ? (
          <Bot className="h-4 w-4 text-primary" />
        ) : (
          <User className="h-4 w-4 text-secondary" />
        )}
      </AvatarFallback>
    </Avatar>
  );
};
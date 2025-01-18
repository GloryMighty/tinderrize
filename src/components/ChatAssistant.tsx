import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export const ChatAssistant = () => {
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    toast({
      title: "AI Feedback",
      description: "Your message looks good! Try adding a question to engage them more.",
    });
  };

  return (
    <Card className="p-6 w-full max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">AI Chat Assistant</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          placeholder="Type your message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="min-h-[100px]"
        />
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
        >
          Get Feedback
        </Button>
      </form>
    </Card>
  );
};
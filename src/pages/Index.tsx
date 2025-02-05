
import { useState } from "react";
import { Header } from "@/components/Header";
import { ChatAssistant } from "@/components/chat/ChatAssistant";
import { ParticleBackground } from "@/components/ParticleBackground";

const Index = () => {
  const [rizzScore, setRizzScore] = useState<number>(30);
  const [isTyping, setIsTyping] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const handleFirstMessage = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
    }
  };

  const handleScoreUpdate = (score: number) => {
    setRizzScore(score);
    setIsTyping(false);
  };

  const handleTypingStateChange = (typing: boolean) => {
    setIsTyping(typing);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1A1F2C] via-[#2C2F3E] to-[#1A1F2C] relative overflow-hidden">
      <ParticleBackground />
      <Header rizzScore={rizzScore} />
      <main className="container py-2 px-4 sm:px-6 h-[calc(100vh-5rem)] relative">
        <div className="w-full h-full">
          <ChatAssistant 
            onScoreUpdate={handleScoreUpdate} 
            onFirstMessage={handleFirstMessage}
            onTypingStateChange={handleTypingStateChange}
          />
        </div>
      </main>
    </div>
  );
};

export default Index;

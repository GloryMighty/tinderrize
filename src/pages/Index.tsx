import { useState } from "react";
import { Header } from "@/components/Header";
import { RizzScore } from "@/components/RizzScore";
import { ChatAssistant } from "@/components/chat/ChatAssistant";

const Index = () => {
  const [rizzScore, setRizzScore] = useState<number | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const handleFirstMessage = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
    }
  };

  const handleScoreUpdate = (score: number) => {
    setRizzScore(score);
    setIsCollapsed(false); // Make sure the score is visible when updated
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1A1F2C] via-[#2C2F3E] to-[#1A1F2C]">
      <Header />
      <div className="container py-6">
        <div className={`transition-all duration-300 ease-in-out ${
          !rizzScore ? "opacity-0 h-0" : "opacity-100"
        }`}>
          <RizzScore score={rizzScore || 0} />
        </div>
      </div>
      <main className={`container py-4 space-y-4 px-4 sm:px-6 transition-all duration-300 ${
        isCollapsed ? "h-[calc(100vh-4rem)]" : "h-[calc(100vh-16rem)]"
      }`}>
        <div className="w-full h-full">
          <ChatAssistant onScoreUpdate={handleScoreUpdate} onFirstMessage={handleFirstMessage} />
        </div>
      </main>
    </div>
  );
};

export default Index;
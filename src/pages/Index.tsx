import { useState } from "react";
import { Header } from "@/components/Header";
import { RizzScore } from "@/components/RizzScore";
import { ChatAssistant } from "@/components/chat/ChatAssistant";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

const Index = () => {
  const [rizzScore, setRizzScore] = useState(75);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const handleFirstMessage = () => {
    if (!hasInteracted) {
      setIsCollapsed(true);
      setHasInteracted(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1A1F2C] via-[#2C2F3E] to-[#1A1F2C]">
      <Header />
      <div className="container py-6">
        <div className={`transition-all duration-300 ease-in-out ${
          isCollapsed ? "opacity-0 h-0" : "opacity-100"
        }`}>
          <RizzScore score={rizzScore} />
        </div>
      </div>
      <main className={`container py-4 space-y-4 px-4 sm:px-6 transition-all duration-300 ${
        isCollapsed ? "h-[calc(100vh-4rem)]" : "h-[calc(100vh-16rem)]"
      }`}>
        <div className="w-full h-full">
          <ChatAssistant onScoreUpdate={setRizzScore} onFirstMessage={handleFirstMessage} />
        </div>
      </main>
    </div>
  );
};

export default Index;
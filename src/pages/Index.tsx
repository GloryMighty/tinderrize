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

  // Callback when first message is sent
  const handleFirstMessage = () => {
    if (!hasInteracted) {
      setIsCollapsed(true);
      setHasInteracted(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1A1F2C] via-[#2C2F3E] to-[#1A1F2C]">
      <div
        className={`transition-all duration-300 ease-in-out ${
          isCollapsed ? "h-12 hover:h-auto cursor-pointer group" : ""
        }`}
        onClick={() => hasInteracted && setIsCollapsed(!isCollapsed)}
      >
        <Header />
        <div className={`container transition-all duration-300 ${
          isCollapsed ? "opacity-0 group-hover:opacity-100" : "opacity-100"
        }`}>
          <RizzScore score={rizzScore} />
        </div>
        {hasInteracted && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-4 top-3 text-muted-foreground"
            onClick={(e) => {
              e.stopPropagation();
              setIsCollapsed(!isCollapsed);
            }}
          >
            {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </Button>
        )}
      </div>
      <main className={`container py-4 space-y-4 px-4 sm:px-6 transition-all duration-300 ${
        isCollapsed ? "h-[calc(100vh-3rem)]" : "h-[calc(100vh-12rem)]"
      }`}>
        <div className="w-full h-full">
          <ChatAssistant onScoreUpdate={setRizzScore} onFirstMessage={handleFirstMessage} />
        </div>
      </main>
    </div>
  );
};

export default Index;
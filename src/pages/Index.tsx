import { useState } from "react";
import { Header } from "@/components/Header";
import { RizzScore } from "@/components/RizzScore";
import { ChatAssistant } from "@/components/chat/ChatAssistant";

const Index = () => {
  const [rizzScore, setRizzScore] = useState(75);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1A1F2C] via-[#2C2F3E] to-[#1A1F2C]">
      <Header />
      <main className="container py-4 space-y-4 px-4 sm:px-6">
        <div className="w-full">
          <RizzScore score={rizzScore} />
        </div>
        <div className="w-full h-[calc(100vh-12rem)]">
          <ChatAssistant onScoreUpdate={setRizzScore} />
        </div>
      </main>
    </div>
  );
};

export default Index;
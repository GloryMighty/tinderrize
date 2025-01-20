import { useState } from "react";
import { Header } from "@/components/Header";
import { RizzScore } from "@/components/RizzScore";
import { ChatAssistant } from "@/components/ChatAssistant";
import { RizzApproaches } from "@/components/RizzApproaches";

const Index = () => {
  const [rizzScore, setRizzScore] = useState(75); // Default score

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container py-8 space-y-8">
        <RizzApproaches />
        <div className="grid gap-8 md:grid-cols-[1fr_2fr]">
          <RizzScore score={rizzScore} />
          <ChatAssistant onScoreUpdate={setRizzScore} />
        </div>
      </main>
    </div>
  );
};

export default Index;
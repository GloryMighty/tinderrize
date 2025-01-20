import { useState } from "react";
import { Header } from "@/components/Header";
import { RizzScore } from "@/components/RizzScore";
import { ChatAssistant } from "@/components/ChatAssistant";
import { RizzApproaches } from "@/components/RizzApproaches";

const Index = () => {
  const [rizzScore, setRizzScore] = useState(75);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6 space-y-6">
        <RizzApproaches />
        <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
          <RizzScore score={rizzScore} />
          <ChatAssistant onScoreUpdate={setRizzScore} />
        </div>
      </main>
    </div>
  );
};

export default Index;
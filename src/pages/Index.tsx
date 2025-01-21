import { useState } from "react";
import { Header } from "@/components/Header";
import { RizzScore } from "@/components/RizzScore";
import { ChatAssistant } from "@/components/ChatAssistant";
import { RizzApproaches } from "@/components/RizzApproaches";

const Index = () => {
  const [rizzScore, setRizzScore] = useState(75);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background/90">
      <Header />
      <main className="container py-8 space-y-8 px-4 sm:px-6">
        <RizzApproaches />
        <div className="grid gap-8 md:grid-cols-[1fr_2fr] items-start">
          <div className="sticky top-8">
            <RizzScore score={rizzScore} />
          </div>
          <ChatAssistant onScoreUpdate={setRizzScore} />
        </div>
      </main>
    </div>
  );
};

export default Index;
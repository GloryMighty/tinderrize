import { useState } from "react";
import { Header } from "@/components/Header";
import { RizzScore } from "@/components/RizzScore";
import { ChatAssistant } from "@/components/ChatAssistant";

const Index = () => {
  const [rizzScore, setRizzScore] = useState(75); // Default score

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container py-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Level Up Your Dating Game
          </h1>
          <p className="text-gray-600">
            Get AI-powered feedback to improve your messages and boost your dating success
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-[1fr_2fr]">
          <RizzScore score={rizzScore} />
          <ChatAssistant onScoreUpdate={setRizzScore} />
        </div>
      </main>
    </div>
  );
};

export default Index;
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Heart, HeartCrack } from "lucide-react";

export const RizzScore = ({ score = 75 }: { score?: number }) => {
  const getScoreStatus = () => {
    if (score >= 80) return {
      icon: <Heart className="w-8 h-8 text-primary animate-bounce" fill="#FF4B91" />,
      message: "Your rizz game is on fire! Keep that energy going! 🔥",
      color: "text-primary"
    };
    if (score >= 50) return {
      icon: <Heart className="w-8 h-8 text-primary animate-pulse" fill="#FF4B91" />,
      message: "Your rizz is looking good! Keep improving to reach the next level.",
      color: "text-primary"
    };
    return {
      icon: <HeartCrack className="w-8 h-8 text-destructive animate-shake" />,
      message: "Your rizz needs some work. Let's level up your game!",
      color: "text-destructive"
    };
  };

  const status = getScoreStatus();

  return (
    <Card className="p-6 w-full max-w-sm mx-auto transform hover:scale-105 transition-transform duration-300">
      <h2 className="text-xl font-semibold mb-4 flex items-center justify-center gap-2">
        Your Rizz Score
        {status.icon}
      </h2>
      <div className="space-y-4">
        <Progress 
          value={score} 
          className="h-3 bg-muted"
          indicatorClassName={score >= 50 ? "bg-primary animate-pulse" : "bg-destructive"}
        />
        <p className={`text-center text-4xl font-bold ${status.color} animate-fade-in`}>
          {score}
        </p>
        <p className="text-sm text-gray-500 text-center animate-fade-in">
          {status.message}
        </p>
      </div>
    </Card>
  );
};
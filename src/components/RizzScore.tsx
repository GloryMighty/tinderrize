import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Heart, HeartCrack, Sparkles } from "lucide-react";

export const RizzScore = ({ score = 75 }: { score?: number }) => {
  const getScoreStatus = () => {
    if (score >= 80) return {
      icon: <Heart className="w-8 h-8 text-primary animate-bounce" fill="#FF4B91" />,
      message: "Your rizz game is on fire! Keep that energy going! 🔥",
      color: "text-primary",
      bgGradient: "from-primary/20 via-secondary/20 to-accent/20"
    };
    if (score >= 50) return {
      icon: <Sparkles className="w-8 h-8 text-secondary animate-pulse" />,
      message: "Your rizz is looking good! Keep improving to reach the next level.",
      color: "text-secondary",
      bgGradient: "from-secondary/20 via-accent/20 to-primary/20"
    };
    return {
      icon: <HeartCrack className="w-8 h-8 text-destructive animate-shake" />,
      message: "Your rizz needs some work. Let's level up your game!",
      color: "text-destructive",
      bgGradient: "from-destructive/20 via-destructive/10 to-background"
    };
  };

  const status = getScoreStatus();

  return (
    <Card className={`p-4 w-full transform transition-all duration-300 bg-gradient-to-r ${status.bgGradient} backdrop-blur-lg border-primary/10`}>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Your Rizz Score
          </h2>
          {status.icon}
        </div>
        <div className="flex-1 w-full sm:w-auto max-w-md">
          <Progress 
            value={score} 
            className="h-3 bg-background/50"
            indicatorClassName={`${score >= 80 ? 'bg-gradient-to-r from-primary via-secondary to-accent animate-pulse' : 
              score >= 50 ? 'bg-gradient-to-r from-secondary to-accent' : 'bg-destructive'}`}
          />
        </div>
        <p className={`text-center text-4xl font-bold ${status.color} animate-fade-in`}>
          {score}
        </p>
      </div>
      <p className="text-sm text-muted-foreground text-center sm:text-right mt-2 animate-fade-in">
        {status.message}
      </p>
    </Card>
  );
};
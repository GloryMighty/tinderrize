
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Heart, HeartCrack, Sparkles } from "lucide-react";

export const RizzScore = ({ score = 75 }: { score?: number }) => {
  const getScoreStatus = () => {
    if (score >= 80) return {
      icon: <Heart className="w-4 h-4 text-primary" fill="#FF4B91" />,
      message: "Your rizz game is on fire! 🔥",
      color: "text-primary",
      bgGradient: "from-primary/20 via-secondary/20 to-accent/20"
    };
    if (score >= 50) return {
      icon: <Sparkles className="w-4 h-4 text-secondary" />,
      message: "Your rizz is looking good!",
      color: "text-secondary",
      bgGradient: "from-secondary/20 via-accent/20 to-primary/20"
    };
    return {
      icon: <HeartCrack className="w-4 h-4 text-destructive" />,
      message: "Your rizz needs work!",
      color: "text-destructive",
      bgGradient: "from-destructive/20 via-destructive/10 to-background"
    };
  };

  const status = getScoreStatus();

  return (
    <Card className={`relative p-2 w-full transform transition-all duration-300 bg-gradient-to-r ${status.bgGradient} backdrop-blur-lg border-primary/10`}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Rizz Score
          </h2>
          {status.icon}
        </div>
        <div className="flex-1 max-w-[100px]">
          <Progress 
            value={score} 
            className="h-2 bg-background/50"
            indicatorClassName={`${score >= 80 ? 'bg-gradient-to-r from-primary via-secondary to-accent' : 
              score >= 50 ? 'bg-gradient-to-r from-secondary to-accent' : 'bg-destructive'}`}
          />
        </div>
        <p className={`text-center text-lg font-bold ${status.color}`}>
          {score}
        </p>
      </div>
    </Card>
  );
};

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export const RizzScore = ({ score = 75 }: { score?: number }) => {
  return (
    <Card className="p-6 w-full max-w-sm mx-auto">
      <h2 className="text-xl font-semibold mb-4">Your Rizz Score</h2>
      <div className="space-y-4">
        <Progress value={score} className="h-3" />
        <p className="text-center text-3xl font-bold text-primary">{score}</p>
        <p className="text-sm text-gray-500 text-center">
          Your rizz is looking good! Keep improving to reach the next level.
        </p>
      </div>
    </Card>
  );
};
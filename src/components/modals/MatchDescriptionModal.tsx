import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface MatchDescriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const bodyTypes = ["skinny", "bbl", "thick", "slim thick", "snack"];

const lifestyles = [
  { value: "humor", label: "Humor & Internet 🤣" },
  { value: "food", label: "Food & Drink 🌮🍎☕🍷" },
  { value: "wellness", label: "Wellness & Self-Care 🧘🛋️🧴😴📵" },
  { value: "active", label: "Active Lifestyle 💃🏃‍♀️🏃🧘‍♀️🥾🏀⚽" },
  { value: "creative", label: "Creative Arts 🧶🎨✍️📸✂️" },
  { value: "social", label: "Social Scene 🍻🎶🎤" },
  { value: "entertainment", label: "Entertainment 🎬📚🎮🎵" },
  { value: "travel", label: "Travel & Adventure ✈️" },
  { value: "animals", label: "Animals 🐾" },
  { value: "values", label: "Values & Social Justice ⚖️🫂" },
  { value: "connections", label: "Deep Connections 🤔❤️‍🔥" },
];

const relationshipGoals = [
  { value: "long-term", label: "Long-Term 💍" },
  { value: "short-term", label: "Short-Term ⏳" },
  { value: "one-night", label: "One-Night Stand 🌙" },
  { value: "unknown", label: "I don't know 🤷" },
];

export const MatchDescriptionModal = ({ open, onOpenChange }: MatchDescriptionModalProps) => {
  const [height, setHeight] = useState([170]);
  const [age, setAge] = useState([25]);
  const [bodyType, setBodyType] = useState("");
  const [lifestyle, setLifestyle] = useState("");
  const [relationshipGoal, setRelationshipGoal] = useState("");
  const [matchName, setMatchName] = useState("");
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          id: user.id,
          height: height[0],
          age: age[0],
          body_type: bodyType,
          lifestyle,
          relationship_goal: relationshipGoal,
          match_name: matchName,
        }, { onConflict: 'id' });

      if (error) throw error;
      onOpenChange(false);
      toast({
        title: "Success",
        description: "Your preferences have been saved!",
      });
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast({
        title: "Error",
        description: "Failed to save preferences. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-background/95 backdrop-blur-sm border-primary/10">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Describe Your Match
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Match Name</label>
            <Input
              value={matchName}
              onChange={(e) => setMatchName(e.target.value)}
              placeholder="Enter your match's name"
              className="bg-white/10 backdrop-blur-sm border-primary/20"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Height: {height}cm</label>
            <Slider
              min={140}
              max={220}
              step={1}
              value={height}
              onValueChange={setHeight}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Age: {age} years</label>
            <Slider
              min={18}
              max={80}
              step={1}
              value={age}
              onValueChange={setAge}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Body Type</label>
            <Select value={bodyType} onValueChange={setBodyType}>
              <SelectTrigger className="w-full bg-white/10 backdrop-blur-sm border-primary/20 hover:bg-white/20 transition-all duration-300">
                <SelectValue placeholder="Select body type" />
              </SelectTrigger>
              <SelectContent className="bg-background/95 backdrop-blur-sm border-primary/20">
                {bodyTypes.map((type) => (
                  <SelectItem 
                    key={type} 
                    value={type}
                    className="hover:bg-primary/10 transition-all duration-300"
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Lifestyle</label>
            <Select value={lifestyle} onValueChange={setLifestyle}>
              <SelectTrigger className="w-full bg-white/10 backdrop-blur-sm border-primary/20 hover:bg-white/20 transition-all duration-300">
                <SelectValue placeholder="Select lifestyle" />
              </SelectTrigger>
              <SelectContent className="bg-background/95 backdrop-blur-sm border-primary/20">
                {lifestyles.map((style) => (
                  <SelectItem 
                    key={style.value} 
                    value={style.value}
                    className="hover:bg-primary/10 transition-all duration-300"
                  >
                    {style.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Relationship Goals</label>
            <Select value={relationshipGoal} onValueChange={setRelationshipGoal}>
              <SelectTrigger className="w-full bg-white/10 backdrop-blur-sm border-primary/20 hover:bg-white/20 transition-all duration-300">
                <SelectValue placeholder="Select relationship goal" />
              </SelectTrigger>
              <SelectContent className="bg-background/95 backdrop-blur-sm border-primary/20">
                {relationshipGoals.map((goal) => (
                  <SelectItem 
                    key={goal.value} 
                    value={goal.value}
                    className="hover:bg-primary/10 transition-all duration-300"
                  >
                    {goal.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleSave}
            className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all duration-300 mt-4"
          >
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
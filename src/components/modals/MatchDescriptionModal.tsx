import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

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
              <SelectTrigger>
                <SelectValue placeholder="Select body type" />
              </SelectTrigger>
              <SelectContent>
                {bodyTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Lifestyle</label>
            <Select value={lifestyle} onValueChange={setLifestyle}>
              <SelectTrigger>
                <SelectValue placeholder="Select lifestyle" />
              </SelectTrigger>
              <SelectContent>
                {lifestyles.map((style) => (
                  <SelectItem key={style.value} value={style.value}>
                    {style.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Relationship Goals</label>
            <Select value={relationshipGoal} onValueChange={setRelationshipGoal}>
              <SelectTrigger>
                <SelectValue placeholder="Select relationship goal" />
              </SelectTrigger>
              <SelectContent>
                {relationshipGoals.map((goal) => (
                  <SelectItem key={goal.value} value={goal.value}>
                    {goal.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
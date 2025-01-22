import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RizzStyleModal } from "../modals/RizzStyleModal";
import { MatchDescriptionModal } from "../modals/MatchDescriptionModal";

interface PreferencesPanelProps {
  rizzStyle: string;
  onRizzStyleChange: (style: string) => void;
}

export const PreferencesPanel = ({ rizzStyle, onRizzStyleChange }: PreferencesPanelProps) => {
  const [isRizzStyleModalOpen, setIsRizzStyleModalOpen] = useState(false);
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);

  return (
    <div className="flex items-center gap-4 mb-6 p-4 rounded-lg bg-background/50 backdrop-blur-sm border border-primary/10">
      <div className="flex-1">
        <Select value={rizzStyle} onValueChange={(value) => {
          onRizzStyleChange(value);
          setIsRizzStyleModalOpen(true);
        }}>
          <SelectTrigger className="w-[200px] bg-white/10 backdrop-blur-sm border-primary/20">
            <SelectValue placeholder="Select rizz style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="casual">Casual 😊</SelectItem>
            <SelectItem value="sassy">Sassy 😏</SelectItem>
            <SelectItem value="toxic">Toxic Boy 😈</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Button
        variant="outline"
        onClick={() => setIsMatchModalOpen(true)}
        className="bg-white/10 backdrop-blur-sm border-primary/20"
      >
        Edit Match Preferences
      </Button>

      <RizzStyleModal
        open={isRizzStyleModalOpen}
        onOpenChange={setIsRizzStyleModalOpen}
      />
      
      <MatchDescriptionModal
        open={isMatchModalOpen}
        onOpenChange={setIsMatchModalOpen}
      />
    </div>
  );
};
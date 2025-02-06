import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface HeaderStyleSelectorProps {
  rizzStyle: string;
  onStyleChange: (value: string) => void;
}

export const HeaderStyleSelector = ({ rizzStyle, onStyleChange }: HeaderStyleSelectorProps) => {
  return (
    <Select value={rizzStyle} onValueChange={onStyleChange}>
      <SelectTrigger className="w-[200px] select-trigger">
        <SelectValue placeholder="Select rizz style" />
      </SelectTrigger>
      <SelectContent className="dropdown-content">
        <SelectItem value="casual">Casual 😊</SelectItem>
        <SelectItem value="sassy">Sassy 😏</SelectItem>
        <SelectItem value="toxic">Toxic Boy 😈</SelectItem>
      </SelectContent>
    </Select>
  );
};
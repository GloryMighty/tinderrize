import { Dialog, DialogContent } from "@/components/ui/dialog";
import { RizzApproaches } from "../RizzApproaches";

interface RizzStyleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const RizzStyleModal = ({ open, onOpenChange }: RizzStyleModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl bg-background/95 backdrop-blur-sm border-primary/10">
        <RizzApproaches />
      </DialogContent>
    </Dialog>
  );
};
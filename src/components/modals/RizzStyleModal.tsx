import { Dialog, DialogContent } from "@/components/ui/dialog";
import { RizzApproaches } from "../RizzApproaches";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface RizzStyleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const RizzStyleModal = ({ open, onOpenChange }: RizzStyleModalProps) => {
  const { toast } = useToast();

  const handleContinue = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('user_preferences')
        .upsert({ 
          id: user.id,
          rizz_style: localStorage.getItem('selectedRizzStyle') || 'casual'
        }, { onConflict: 'id' });

      if (error) throw error;
      onOpenChange(false);
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
      <DialogContent className="max-w-4xl bg-background/95 backdrop-blur-sm border-primary/10">
        <RizzApproaches />
        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleContinue}
            className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all duration-300"
          >
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Coins } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const UserCredits = () => {
  const [credits, setCredits] = useState<number | null>(null);

  useEffect(() => {
    const fetchCredits = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('user_credits')
          .select('tokens')
          .eq('id', user.id)
          .maybeSingle();
        
        if (data) {
          setCredits(data.tokens);
        } else {
          // Handle case where user has no credits record
          const { data: newCredits } = await supabase
            .from('user_credits')
            .insert({ id: user.id, tokens: 10 })
            .select('tokens')
            .single();
          
          if (newCredits) {
            setCredits(newCredits.tokens);
          }
        }
      }
    };

    fetchCredits();

    const subscription = supabase
      .channel('user_credits_changes')
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'user_credits' 
      }, fetchCredits)
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <Card className="p-4 flex items-center gap-2 bg-primary/5">
      <Coins className="w-5 h-5 text-primary" />
      <span className="font-medium">{credits !== null ? credits : '...'} tokens</span>
    </Card>
  );
};
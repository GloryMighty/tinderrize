import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Coins } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const UserCredits = () => {
  const [credits, setCredits] = useState<number | null>(null);

  useEffect(() => {
    // In development mode, show infinite tokens
    if (import.meta.env.DEV) {
      setCredits(Infinity);
      return;
    }

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
    <Card className="p-4 flex items-center gap-2 bg-white/10 backdrop-blur-sm border-primary/10 shadow-lg hover:shadow-xl transition-all duration-300">
      <Coins className="w-5 h-5 text-primary animate-pulse" />
      <span className="font-medium bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        {credits === Infinity ? '∞' : credits !== null ? credits : '...'} tokens
      </span>
    </Card>
  );
};
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserPreferences } from "@/types/preferences";

export const usePreferences = () => {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data } = await supabase
            .from('user_preferences')
            .select('*')
            .eq('id', user.id)
            .single();
          setPreferences(data);
        }
      } catch (error) {
        console.error("Error fetching preferences:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPreferences();
  }, []);

  return { preferences, loading };
};
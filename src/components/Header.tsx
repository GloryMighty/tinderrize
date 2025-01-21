import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

export const Header = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserEmail(session?.user?.email ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/landing");
  };

  return (
    <header className="w-full py-4 px-6 bg-background border-b">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Tinderizzer
          </h1>
        </div>
        <div className="flex items-center gap-4">
          {userEmail && (
            <span className="text-sm text-muted-foreground">{userEmail}</span>
          )}
          <ThemeToggle />
          <Button
            variant="ghost"
            className="text-gray-600 hover:text-primary dark:text-gray-300"
            onClick={handleSignOut}
          >
            Sign out
          </Button>
          <Button
            className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white"
            onClick={() => navigate("/upgrade")}
          >
            Upgrade
          </Button>
        </div>
      </div>
    </header>
  );
};
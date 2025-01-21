import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";

const Landing = () => {
  const navigate = useNavigate();
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<"sign_in" | "sign_up">("sign_up");

  // Listen for auth changes
  supabase.auth.onAuthStateChange((event) => {
    if (event === "SIGNED_IN") {
      navigate("/");
    }
  });

  const handleAuthClick = (mode: "sign_in" | "sign_up") => {
    setAuthMode(mode);
    setShowAuth(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        Tinderizzer
      </h1>
      <p className="text-xl mb-8 text-muted-foreground">Improve your game</p>
      <div className="flex flex-col gap-4 w-full max-w-xs">
        <Button
          size="lg"
          className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
          onClick={() => handleAuthClick("sign_up")}
        >
          Sign up
        </Button>
        <Button
          size="lg"
          variant="outline"
          onClick={() => handleAuthClick("sign_in")}
        >
          Sign in
        </Button>
      </div>

      <Dialog open={showAuth} onOpenChange={setShowAuth}>
        <DialogContent className="sm:max-w-[425px]">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: "rgb(var(--primary))",
                    brandAccent: "rgb(var(--primary-hover))",
                  },
                },
              },
            }}
            view={authMode}
            providers={[]}
            redirectTo={window.location.origin}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Landing;
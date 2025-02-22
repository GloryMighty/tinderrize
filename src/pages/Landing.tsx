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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#2D1B69] to-[#412C84] p-4">
      <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[#9b87f5] via-[#D946EF] to-[#7EE7F1] bg-clip-text text-transparent">
        Tinderizzer
      </h1>
      <p className="text-xl mb-8 text-white/90">Master the art of online dating – One message at a time!</p>
      <div className="flex flex-col gap-4 w-full max-w-xs">
        <Button
          size="lg"
          className="bg-gradient-to-r from-[#9b87f5] to-[#D946EF] hover:opacity-90 text-white"
          onClick={() => handleAuthClick("sign_up")}
        >
          Sign up
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="border-white/20 text-white hover:bg-white/10"
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
                    brand: "#9b87f5",
                    brandAccent: "#D946EF",
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
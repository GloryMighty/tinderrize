import { useState } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useTheme } from "@/hooks/use-theme";

export const AuthDialog = () => {
  const [open, setOpen] = useState(false);
  const { theme } = useTheme();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="text-gray-600 hover:text-primary">
          Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: theme === "dark" ? "dark" : "default",
          }}
          providers={[]}
          view="sign_up"
          showLinks={true}
          redirectTo={window.location.origin}
        />
      </DialogContent>
    </Dialog>
  );
};
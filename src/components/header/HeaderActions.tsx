import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface HeaderActionsProps {
  userEmail: string | null;
}

export const HeaderActions = ({ userEmail }: HeaderActionsProps) => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/landing");
  };

  return (
    <div className="flex items-center gap-4">
      <ThemeToggle />

      <Button
        className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white"
        onClick={() => navigate("/upgrade")}
      >
        Upgrade
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <User className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="dropdown-content w-56" align="end">
          {userEmail && (
            <DropdownMenuItem className="text-sm text-muted-foreground cursor-default">
              {userEmail}
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={() => navigate("/profile")}>
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleSignOut}>
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
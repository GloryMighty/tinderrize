import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RizzStyleModal } from "./modals/RizzStyleModal";
import { MatchDescriptionModal } from "./modals/MatchDescriptionModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "lucide-react";

export const Header = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [rizzStyle, setRizzStyle] = useState("casual");
  const [isRizzStyleModalOpen, setIsRizzStyleModalOpen] = useState(false);
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);

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
    <header className="w-full py-4 px-6 bg-gradient-to-b from-[#1A1F2C] to-[#2C2F3E] border-b border-primary/10 relative z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h1 
            className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent cursor-pointer"
            onClick={() => navigate("/")}
          >
            Tinderizzer
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <Select value={rizzStyle} onValueChange={(value) => {
            setRizzStyle(value);
            setIsRizzStyleModalOpen(true);
          }}>
            <SelectTrigger className="w-[200px] select-trigger">
              <SelectValue placeholder="Select rizz style" />
            </SelectTrigger>
            <SelectContent className="dropdown-content">
              <SelectItem value="casual">Casual 😊</SelectItem>
              <SelectItem value="sassy">Sassy 😏</SelectItem>
              <SelectItem value="toxic">Toxic Boy 😈</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={() => setIsMatchModalOpen(true)}
            className="select-trigger"
          >
            Your Match
          </Button>

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
      </div>

      <RizzStyleModal
        open={isRizzStyleModalOpen}
        onOpenChange={setIsRizzStyleModalOpen}
      />
      
      <MatchDescriptionModal
        open={isMatchModalOpen}
        onOpenChange={setIsMatchModalOpen}
      />
    </header>
  );
};
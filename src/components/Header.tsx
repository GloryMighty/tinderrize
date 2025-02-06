import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { RizzStyleModal } from "./modals/RizzStyleModal";
import { MatchDescriptionModal } from "./modals/MatchDescriptionModal";
import { RizzScore } from "./RizzScore";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { HeaderActions } from "./header/HeaderActions";
import { HeaderStyleSelector } from "./header/HeaderStyleSelector";

interface HeaderProps {
  rizzScore: number;
}

export const Header = ({ rizzScore }: HeaderProps) => {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [rizzStyle, setRizzStyle] = useState("casual");
  const [isRizzStyleModalOpen, setIsRizzStyleModalOpen] = useState(false);
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);
  const isMobile = useIsMobile();

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

  return (
    <header className="w-full py-4 px-6 bg-gradient-to-b from-[#1A1F2C] to-[#2C2F3E] border-b border-primary/10 relative z-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 md:gap-8">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Tinderizzer
            </h1>
            
            {isMobile ? (
              <div className="flex items-center gap-4">
                <div className="w-[150px]">
                  <RizzScore score={rizzScore} />
                </div>
                <SidebarTrigger />
              </div>
            ) : (
              <div className="w-[200px]">
                <RizzScore score={rizzScore} />
              </div>
            )}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <HeaderStyleSelector 
              rizzStyle={rizzStyle} 
              onStyleChange={(value) => {
                setRizzStyle(value);
                setIsRizzStyleModalOpen(true);
              }}
            />

            <Button
              variant="outline"
              onClick={() => setIsMatchModalOpen(true)}
              className="select-trigger"
            >
              Your Match
            </Button>

            <HeaderActions userEmail={userEmail} />
          </div>
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
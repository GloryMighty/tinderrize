import { AuthDialog } from "@/components/AuthDialog";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="w-full py-4 px-6 bg-background border-b">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Tinderizzer
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <AuthDialog />
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
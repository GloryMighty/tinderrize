import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const approaches = {
  casual: [
    "Hey, I noticed you like coffee too! What's your go-to order? ☕",
    "Your travel photos are amazing! Which place was your favorite?",
    "That book in your profile - I just finished it! What did you think about the ending?",
    "Your dog is adorable! I'm a huge dog person too 🐕",
    "Love your taste in music! Have you been to any good concerts lately?"
  ],
  sassy: [
    "I usually read bios first, but your smile made me forget how to read 😅",
    "Are you a parking ticket? Because you've got FINE written all over you 😏",
    "Is your name Google? Because you've got everything I've been searching for 🔍",
    "Do you like science? Because we've got chemistry ⚗️",
    "Are you a camera? Because every time I look at you, I smile 📸"
  ],
  toxic: [
    "I'm probably way out of your league, but I'll give you a chance 😌",
    "You're cute, but I've seen better. Coffee? ☕",
    "Not looking for anything serious, unless you're seriously amazing 💅",
    "I'm like a luxury car - high maintenance but worth it 🚗",
    "You must be tired from running through my mind all day... or maybe that's just your cardio routine 🏃‍♀️"
  ]
};

export const RizzApproaches = () => {
  const { toast } = useToast();
  const [selectedApproach, setSelectedApproach] = useState("casual");

  useEffect(() => {
    const fetchUserPreferences = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('user_preferences')
          .select('rizz_style')
          .eq('id', user.id)
          .maybeSingle();
        
        if (data?.rizz_style) {
          setSelectedApproach(data.rizz_style);
        }
      }
    };
    fetchUserPreferences();
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard!",
      description: "Now you can paste it in the chat below",
      className: "fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-white dark:bg-gray-800 shadow-lg rounded-lg",
      duration: 2000,
    });
  };

  const handleApproachChange = async (value: string) => {
    setSelectedApproach(value);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('user_preferences')
          .upsert({
            id: user.id,
            rizz_style: value
          }, { onConflict: 'id' });

        toast({
          title: "Style updated!",
          description: `Your rizz style is now set to ${value}`,
          duration: 2000,
        });
      }
    } catch (error) {
      console.error('Error updating rizz style:', error);
      toast({
        title: "Error",
        description: "Failed to update your rizz style",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mb-6 animate-fade-in relative z-30">
      <h2 className="text-2xl font-bold text-center mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        Choose Your Rizz Style
      </h2>
      
      <Tabs value={selectedApproach} className="w-full" onValueChange={handleApproachChange}>
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="casual" className="text-sm">
            Casual 😊
          </TabsTrigger>
          <TabsTrigger value="sassy" className="text-sm">
            Sassy 😏
          </TabsTrigger>
          <TabsTrigger value="toxic" className="text-sm">
            Toxic Boy 😈
          </TabsTrigger>
        </TabsList>

        {Object.entries(approaches).map(([approach, lines]) => (
          <TabsContent key={approach} value={approach} className="space-y-2">
            <div className="grid gap-2">
              {lines.map((line, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-background/80 backdrop-blur-sm shadow-sm border border-border hover:shadow-md transition-shadow"
                >
                  <p className="text-sm text-foreground flex-1">{line}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-2 hover:bg-primary hover:text-white"
                    onClick={() => copyToClipboard(line)}
                  >
                    Copy
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
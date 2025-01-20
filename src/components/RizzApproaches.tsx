import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard!",
      description: "Now you can paste it in the chat below",
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-8 animate-fade-in">
      <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        Choose Your Rizz Style
      </h2>
      
      <Tabs defaultValue="casual" className="w-full" onValueChange={setSelectedApproach}>
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="casual" className="text-lg">
            Casual 😊
          </TabsTrigger>
          <TabsTrigger value="sassy" className="text-lg">
            Sassy 😏
          </TabsTrigger>
          <TabsTrigger value="toxic" className="text-lg">
            Toxic Boy 😈
          </TabsTrigger>
        </TabsList>

        {Object.entries(approaches).map(([approach, lines]) => (
          <TabsContent key={approach} value={approach} className="space-y-4">
            <div className="grid gap-4">
              {lines.map((line, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <p className="text-gray-800 flex-1">{line}</p>
                  <Button
                    variant="ghost"
                    className="ml-4 hover:bg-primary hover:text-white"
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
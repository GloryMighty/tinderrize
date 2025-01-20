import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Pay as you go",
    price: "$5",
    description: "100 tokens",
    features: ["No monthly commitment", "Tokens never expire", "Perfect for occasional use"],
    popular: false
  },
  {
    name: "Monthly",
    price: "$9.99",
    description: "per month",
    features: ["Unlimited tokens", "Priority support", "New features first"],
    popular: true
  },
  {
    name: "Annual",
    price: "$60",
    description: "per year ($5/month)",
    features: ["Best value", "Unlimited tokens", "Priority support", "New features first"],
    popular: false
  }
];

const Upgrade = () => {
  const handleUpgrade = (plan: string) => {
    // TODO: Implement payment processing
    console.log(`Selected plan: ${plan}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Upgrade Your Rizz Game</h1>
          <p className="text-muted-foreground">Choose the plan that best fits your needs</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <Card key={plan.name} className={`p-6 relative ${plan.popular ? 'border-primary shadow-lg' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm">
                    Most Popular
                  </span>
                </div>
              )}
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                <div className="mb-2">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground"> {plan.description}</span>
                </div>
              </div>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button 
                className="w-full"
                variant={plan.popular ? "default" : "outline"}
                onClick={() => handleUpgrade(plan.name)}
              >
                Get Started
              </Button>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Upgrade;
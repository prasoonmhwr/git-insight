import React from "react";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const pricingPlans = [
  {
    name: "Standard",
    price: "$29/mo",
    features: [
      "150",
      "Basic Git repository integration",
      // "Meeting transcription & insights",
      "Email support",
    ],
  },
  {
    name: "Professional",
    price: "$79/mo",
    features: [
      "Advanced analytics & reports",
      "Priority Git repository integration",
      "Automated issue tracking",
      "Slack & Jira integration",
      "Priority support",
    ],
  },
];

const Pricing = () => {
  return (
    <div id="pricing" className="bg-slate-900 py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-200 mb-4">Pricing Plans</h2>
          <p className="text-slate-400">
            Choose a plan that fits your team’s needs and start optimizing your development workflow today.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className="bg-slate-800/50 backdrop-blur-lg rounded-lg border border-slate-700 p-6"
            >
              <h3 className="text-xl font-semibold text-slate-200 mb-2">{plan.name}</h3>
              <p className="text-blue-400 text-2xl font-bold mb-4">{plan.price}</p>
              <ul className="text-slate-400 space-y-2 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button variant="default" className="w-full">
                Get Started
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;

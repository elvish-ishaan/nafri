import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";


const PricingPage = () => {
  const plans = [
    {
      name: "Free",
      price: "$0/month",
      description: "A basic plan for testing and small-scale projects.",
      features: [
        "100 API requests per month",
        "Basic support",
        "Limited feature access",
      ],
      buttonText: "Choose Free",
    },
    {
      name: "Pro",
      price: "$29/month",
      description: "Perfect for growing businesses and startups.",
      features: [
        "10,000 API requests per month",
        "Priority support",
        "Access to premium features",
      ],
      buttonText: "Choose Pro",
    },
    {
      name: "Enterprise",
      price: "Custom pricing",
      description: "Tailored for enterprises with high demand.",
      features: [
        "Unlimited API requests",
        "Dedicated support",
        "Custom integrations",
        "Access to all features",
      ],
      buttonText: "Contact Us",
    },
  ];

  return (
    <div className="min-h-screen text-white py-10 px-5">
      <h1 className="text-4xl font-bold text-center mb-8">Pricing Plans</h1>
      <p className="text-center text-gray-400 mb-12">
        Choose a plan that best fits your needs and start integrating our API today.
      </p>

      <div className="flex flex-wrap justify-center gap-8">
        {plans.map((plan, index) => (
          <Card key={index} className="w-80 bg-muted">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-center">
                {plan.name}
              </CardTitle>
              <p className="text-xl text-center text-gray-400 mt-2">{plan.price}</p>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-center mb-4">{plan.description}</p>
              <ul className="space-y-2">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <span className="text-green-400 mr-2">✔</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="flex justify-center mt-4">
              <Button className="w-full">
                {plan.buttonText}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PricingPage;

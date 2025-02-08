"use client"

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const pricingPlans = [
  { storage: "10 GB", price: "₹100", description: "For light document & photo storage." },
  { storage: "50 GB", price: "₹400", description: "Mix of documents, photos & videos." },
  { storage: "100 GB", price: "₹700", description: "Large files, high-res photos & videos." },
  { storage: "1 TB", price: "₹5000", description: "For businesses & large projects." }
];

export default function PricingCards() {
  return (
    <div className="p-4 text-black rounded-xl shadow-md">
      <h1 className="text-3xl font-bold text-center mb-3 text-card-foreground">Pricing</h1>
      <p className="text-center text-muted-foreground mb-6">Choose the plan that fits your needs perfectly.</p>
      <div className="flex overflow-x-auto gap-6 pb-4 pr-6">
        {pricingPlans.map((plan, index) => (
          <Card key={index} className="border bg-muted rounded-3xl shadow-md p-6 hover:shadow-xl transition-transform min-w-[200px]">
            <CardHeader className="p-0 text-center">
              <CardTitle className="text-xl font-bold text-primary mb-1">{plan.storage}</CardTitle>
              <CardDescription className="text-gray-500 text-sm mb-3">{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-3">
              <div className="text-2xl font-extrabold my-5">{plan.price}</div>
              <Button className="w-full bg-black hover:bg-gray-800 text-white text-sm py-2 rounded-xl transition-colors"
              >
                Buy Now
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

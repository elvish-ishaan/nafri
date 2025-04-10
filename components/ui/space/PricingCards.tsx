"use client";

import React, { useState, Dispatch, SetStateAction } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Script from "next/script";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";

// Declare Razorpay globally
declare global {
  interface Window {
// eslint-disable-next-line @typescript-eslint/no-explicit-any
   Razorpay: any;
  }
}

const pricingPlans = [
  { storage: "10 GB", price: "₹100", description: "For light document & photo storage." },
  { storage: "50 GB", price: "₹400", description: "Mix of documents, photos & videos." },
  { storage: "100 GB", price: "₹700", description: "Large files, high-res photos & videos." },
  { storage: "1024 GB", price: "₹5000", description: "For businesses & large projects." },
];

interface userStorage {
  value: number;
  outOf: number;
}

 // eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function PricingCards ({userStorage, setUserStorage}:{
  userStorage: userStorage
  setUserStorage: Dispatch<SetStateAction<userStorage>>
}) {
  const { data: session } = useSession()
  const name:string | undefined | null = session?.user?.name ?? 'guest'
  const email:string | undefined | null = session?.user?.email
  const [currency] = useState("INR");
  const { toast } = useToast()

  const createOrderId = async (strPlan: string, PlnAmount: number) => {
    try {
      const response = await fetch("/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: PlnAmount * 100,
          plan: strPlan
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      return data.orderId;
    } catch (error) {
      console.error("Error creating order:", error);
      return null;
    }
  };

  const processPayment = async (strPlan: string, amount: number) => {
    try {
      const orderId = await createOrderId(strPlan, amount);
      if (!orderId || !window.Razorpay) return;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amount * 100,
        currency,
        name,
        description: "Payment for storage plan",
        order_id: orderId,
        notes: {
          plan: strPlan
        },
        handler: async (response: {
          razorpay_payment_id: string,
          razorpay_order_id:string,
          razorpay_signature: string,
        }) => {
          const data = {
            orderCreationId: orderId,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
          };
          const result = await fetch("/api/varify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });

          const res = await result.json();
           //show user taost for sucessful payment
           if(res.isOk){
            //update the user storage on client side also
            setUserStorage(userStorage => ({ ...userStorage, outOf: userStorage.outOf + Number(strPlan.split(' ')[0]) }));
            toast({
              title: 'Your Storage Has Been Upgraded'
             })
           }else{
            toast({
              title: 'Your Storage Could Not Be Upgraded',
              variant: 'destructive'
             })
           }
        },
        prefill: { name, email },
        theme: { color: "#000000" },
      };

      const paymentObject = new window.Razorpay(options);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      paymentObject.on("payment.failed", (response: any) => {
       toast({
        title: response.error.description,
        variant: 'destructive'
       })
      });
      paymentObject.open();
    } catch (error) {
      console.error("Payment error:", error);
    }
  };

  return (
    <div className="p-4 text-foreground rounded-xl shadow-md">
      <h1 className="text-3xl font-bold text-center mb-3 text-card-foreground">Pricing</h1>
      <p className="text-center text-muted-foreground mb-6">
        Choose the plan that fits your needs perfectly.
      </p>
      <div className="flex overflow-x-auto gap-6 pb-4 pr-6">
        {pricingPlans.map((plan, index) => (
          <Card
            key={index}
            className="border bg-muted rounded-3xl shadow-md p-6 hover:shadow-xl transition-transform min-w-[200px]"
          >
            <CardHeader className="p-0 text-center">
              <CardTitle className="text-xl font-bold text-primary mb-1">
                {plan.storage}
              </CardTitle>
              <CardDescription className="text-muted-foreground text-sm mb-3">
                {plan.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-3">
              <div className="text-2xl font-extrabold my-5">{plan.price}</div>
              <Button
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-sm py-2 rounded-xl transition-colors"
                onClick={() => {
                  const amount = Number(plan.price.replace("₹", ""))
                  processPayment(plan.storage, amount);
                }}
              >
                Buy Now
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => console.log("Razorpay script loaded")}
      />
    </div>
  );
}

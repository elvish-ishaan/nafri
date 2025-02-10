import Razorpay from 'razorpay';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

interface PayOptions {
    amount: string;
    currency: string;
    receipt: string;
    notes: {
        plan: string;
        userEmail: string | null | undefined;
    };
}

export const razorpay = new Razorpay({
 key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID! as string,
 key_secret: process.env.RAZORPAY_KEY_SECRET as string,
});

export async function POST(request: NextRequest) {
 const { amount, currency, plan } = (await request.json()) as {
  amount: string;
  currency: string;
  plan: string;
 };
 //getting user email
 const session = await getServerSession()

 const options: PayOptions = {
  amount: amount,
  currency: currency,
  receipt: 'rcp-test',
  notes: {
    plan: plan,
    userEmail: session?.user?.email
  }
 };
 const order = await razorpay.orders.create(options);
 console.log(order);
 return NextResponse.json({ orderId: order?.id }, { status: 200 });
}
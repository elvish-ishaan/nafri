import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { razorpay } from '@/lib/paymentConfig';
import { v4 as uuid } from 'uuid'

interface PayOptions {
    amount: string;
    currency: string;
    receipt: string;
    notes: {
        plan: string;
        userEmail: string | null | undefined;
    };
}


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
  receipt: `rcp-${uuid().split('-')[0]}`,
  notes: {
    plan: plan,
    userEmail: session?.user?.email
  }
 };
 //@ts-expect-error fix this
 // eslint-disable-next-line @typescript-eslint/no-explicit-any
 const order:any = await razorpay.orders.create(options);
 return NextResponse.json({ orderId: order?.id }, { status: 200 });
}
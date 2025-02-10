import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { razorpay } from '../order/route';
import prisma from '@/prisma/prismaClient';
import { getServerSession } from 'next-auth';

//util function GB -> Bytes
function gbToBytes(gb: number): number {
    if (typeof gb !== 'number') {
      throw new Error("Input must be a number.");
    }
  
    if (gb < 0) {
      throw new Error("Gigabytes cannot be negative.");
    }
  
    const BYTES_IN_GB = 1024 ** 3;
    return gb * BYTES_IN_GB;
  }

const generatedSignature = (
 razorpayOrderId: string,
 razorpayPaymentId: string
) => {
 const keySecret = process.env.RAZORPAY_KEY_SECRET as string;
 if (!keySecret) {
  throw new Error(
   'Razorpay key secret is not defined in environment variables.'
  );
 }
 const sig = crypto
  .createHmac('sha256', keySecret)
  .update(razorpayOrderId + '|' + razorpayPaymentId)
  .digest('hex');
 return sig;
};


export async function POST(request: NextRequest) {
 const { orderCreationId, razorpayPaymentId, razorpaySignature } =
  await request.json();
  console.log(orderCreationId, razorpayPaymentId, razorpaySignature, 'these are creds.........')

 const signature = generatedSignature(orderCreationId, razorpayPaymentId);
 if (signature !== razorpaySignature) {
  return NextResponse.json(
   { message: 'payment verification failed', isOk: false },
   { status: 400 }
  );
 }
 //get storage order details
 const order = await razorpay.orders.fetch(orderCreationId)
 const session = await getServerSession()

 //add db call to update the user storage
 try {
       await prisma.user.update({
        where: {
            email: session?.user?.email || '',
        },
        data: {
            totalSpace: {
                //@ts-expect-error why showing error here fix
                increment: gbToBytes(Number(order.notes?.plan?.split(' ')[0]))
            }
        }
     })
 } catch (error) {
    console.log(error, 'error in updating user storage at varification')
 }

 return NextResponse.json(
  { message: 'payment verified successfully', isOk: true },
  { status: 200 }
 );
}
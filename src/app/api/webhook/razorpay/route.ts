import { db } from "@/server/db";
import { NextRequest, NextResponse } from "next/server";
import crypto from 'crypto';
export const runtime = 'edge';
export async function POST(request: Request) {
    // Parse the raw body
    const body = await request.text();
    
    // Get Razorpay signature from headers
    const razorpaySignature = request.headers.get('x-razorpay-signature') as string;
    
    // Verify webhook signature
    try {
        // Create the expected signature
        const generatedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
            .update(body)
            .digest('hex');
        
        // Compare signatures
        if (generatedSignature !== razorpaySignature) {
            return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Signature verification failed' }, { status: 400 });
    }

    // Parse the webhook payload
    const payload = JSON.parse(body);

    // Check for payment successful event
    if (payload.event === 'payment.captured') {
        const paymentDetails = payload.payload.payment.entity;
        
        // Extract metadata from Razorpay payment notes
        const userId = paymentDetails.notes.userId;
        const credits = Number(paymentDetails.notes.credits);

        if (!userId || !credits) {
            return NextResponse.json({ error: "Missing userId or credits" }, { status: 400 });
        }

        // Create transaction and update user credits
        await db.transaction.create({ data: { userId, credits } });
        await db.user.update({
            where: { id: userId },
            data: {
                credits: {
                    increment: credits
                }
            }
        });

        return NextResponse.json({ message: 'Credits added successfully' }, { status: 200 });
    }

    // Default response for other events
    return NextResponse.json({ message: 'Webhook received' });
}
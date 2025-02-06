'use server'

import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import Razorpay from 'razorpay'

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!
})

export async function createCheckoutSession(credits: number) {
    const { userId } = await auth()
    if (!userId) {
        throw new Error('Unauthorized')
    }

    const amount = Math.round((credits / 50) * 100)

    const options = {
        amount: amount, 
        currency: "USD",
        receipt: `credits_${userId}`,
        notes: {
            userId: userId,
            credits: credits,
            successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/create`,
            cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/billing`
        }
    }
   
    try {
        const order = await razorpay.orders.create(options)
        return order
    } catch (error) {
        console.log(error)
        throw new Error('Failed to create Razorpay order')
    }
}
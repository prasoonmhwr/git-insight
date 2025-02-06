'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Slider } from '@/components/ui/slider'
import { createCheckoutSession } from '@/lib/razorpay'
import { api } from '@/trpc/react'
import { CreditCard, Info } from 'lucide-react'
import React from 'react'

const BillingPage = () => {
    const {data: user} = api.project.getMyCredits.useQuery()
    const [creditsToBuy, setCreditsToBuy] = React.useState<number[]>([100])
    const creditsToBuyAmount = creditsToBuy[0]!
    const price = (creditsToBuyAmount/50).toFixed(2)
  return (
    <div>
        <h1 className='text-xl font-semibold'>Billing</h1>
        <div className='h-2'></div>
        <p className='text-sm text-slate-400'>
            You currently have {user?.credits} credits.
        </p>
        <div className="h-2"></div>
        <div className='bg-violet-200 px-4 py-2 rounded-md border border-violet-200 text-violet-700'>
            <div className='flex items-center gap-2'>
                <Info className='size-4' />
                <p className='text-sm'>Each credit allows you to index 1 file in a repository.</p>
            </div>
            <p className='text-sm'>E.g. If your project has 100 files, you will need 100 credits to index it.</p>
        </div>
        <div className="h-4"></div>
        <Slider defaultValue={[100]} max={1000} min={10} step={10} onValueChange={value => setCreditsToBuy(value)} value={creditsToBuy}/>
            <div className="h-4"></div>
            <Button onClick={async()=>{
                const order = await createCheckoutSession(creditsToBuyAmount)
                const options1 = {
                  key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Use public key here
                  amount: order.amount,
                  currency: order.currency,
                  name: 'Git Insight',
                  description: 'Buying GitIsight Credits',
                  order_id: order.id,
                  handler: (response: any) => {
                    alert('Payment Successful');
                  },
                  prefill: {
                    name: 'Customer Name',
                    email: 'customer@example.com',
                    contact: '9999999999',
                  },
                  notes: {
                      userId: order.notes?.userId,
                      credits: order.notes?.credits,
                      successUrl: order.notes?.successUrl,
                      cancelUrl: order.notes?.cancelUrl
                  },
                  theme: {
                    color: '#3399cc',
                  },
                };
          
                const razorpay1 = new (window as any).Razorpay(options1);
                razorpay1.open();
            }}>
                Buy {creditsToBuyAmount} credits for ${price}
            </Button>
            <div className="h-4"></div>
            <h1 className='text-xl mb-2 font-semibold'>Transaction History</h1>
            <div className="space-y-2">
              {user?.transactions && user?.transactions.length == 0  && (<div className=' flex flex-col items-center justify-center m-auto min-h-[500px]'>
                    <img src="/transaction.svg" className='h-36 w-auto brightness-[85%]' />
                    <p className='pt-4 text-lg text-slate-200'>No transactions found</p>
                </div>)}
            {!user?.transactions && [1,2,3,4,5,6,7].map((i) => (<Skeleton key={i} className="h-[82px] mt-2 rounded-xl bg-slate-800" />))}
            {false && user?.transactions.map((transaction, index) => (
                 <Card key={index} className="p-4 mb-2 hover:bg-slate-600 bg-slate-700 transition-colors">
                 <div className="flex items-center justify-between">
                   <div className="flex items-center gap-4">
                     <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
                       <CreditCard className="w-5 h-5 text-green-500" />
                     </div>
                     <div>
                       <h3 className="font-medium text-slate-300">Credits Added</h3>
                       <p className="text-sm text-stone-400">{transaction.createdAt.toLocaleDateString()}</p>
                     </div>
                   </div>
                   <span className="text-green-500 font-medium">
                     +{transaction.credits} credits
                   </span>
                 </div>
               </Card>
        ))}
      </div>
    </div>
  )
}

export default BillingPage
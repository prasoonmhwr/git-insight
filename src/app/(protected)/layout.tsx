import { SidebarProvider } from '@/components/ui/sidebar'
import { UserButton } from '@clerk/nextjs'
import React from 'react'
import { AppSidebar } from './app-sidebar'
import Script from 'next/script'
import { Analytics } from "@vercel/analytics/react"
type Props = {
    children: React.ReactNode
}
const SidebarLayout = ({children}: Props) => {
  return (
    <>
    <Analytics /><Script
    id="razorpay-checkout-js"
    src="https://checkout.razorpay.com/v1/checkout.js"
   />
   
    <SidebarProvider>
        <AppSidebar />
        <main className='w-full m-2 bg-slate-950'>
            <div className='flex items-center gap-2 border-side-border bg-slate-900 border shadow rounded-md p-2 px-4'>
                {/* <SearchBar /> */}
                <div className="ml-auto"></div>
                <UserButton 
                appearance={{
                    elements: {
                        userButtonPopoverMain: "bg-slate-800",
                        userPreview: "text-slate-400",
                        userButtonPopoverActionButton__manageAccount: "text-slate-400",
                        userButtonPopoverActionButton__signOut: "text-slate-400",
                        userButtonPopoverFooter: "bg-gradient-to-b from-slate-700 to-slate-900"
                    }}
                }
                />
            </div>
            <div className="h-4"></div>
            {/* main content */}
            <div className='border-side-border bg-slate-900 border shadow rounded-md overflow-y-scroll h-[calc(100vh-6rem)] p-4'>
                {children}
            </div>
        </main>
    </SidebarProvider>
    </>
  )
}

export default SidebarLayout
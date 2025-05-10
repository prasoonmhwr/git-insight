'use client'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { UserButton } from '@clerk/nextjs'
import React from 'react'
import { AppSidebar } from './app-sidebar'
import Script from 'next/script'
import { Analytics } from "@vercel/analytics/react"
import { Bot, CreditCard, LayoutDashboard } from 'lucide-react'
import { usePathname } from 'next/navigation'

type Props = {
    children: React.ReactNode
}
const SidebarLayout = ({ children }: Props) => {
    const pathname = usePathname()
    const items = [
        {
            title: "Dashboard",
            url: '/dashboard',
            icon: LayoutDashboard,
        },
        {
            title: "Q&A",
            url: "/qa",
            icon: Bot
        },
        // {
        //     title: "Meetings",
        //     url: "/meetings",
        //     icon: Presentation
        // },
        {
            title: "Billing",
            url: "/billing",
            icon: CreditCard
        }
    ]
    return (
        <>
            <Analytics /><Script
                id="razorpay-checkout-js"
                src="https://checkout.razorpay.com/v1/checkout.js"
            />

            <SidebarProvider>
                <AppSidebar />
                <main className='w-full bg-slate-950'>
                        <div className='block md:hidden z-10 fixed left-0 top-12 w-8 h-8 bg-blue-600 rounded-r flex justify-center items-center'>
                            <SidebarTrigger className=' [&_svg]:size-5 flex justify-center items-center' />
                        </div>

                    {/* main content */}
                    <div className=' shadow rounded-md overflow-y-scroll h-[100vh] p-4 md:p-6'>
                        {children}
                    </div>
                </main>
            </SidebarProvider>
        </>
    )
}

export default SidebarLayout
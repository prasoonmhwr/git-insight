'use client'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { UserButton } from '@clerk/nextjs'
import React from 'react'
import { AppSidebar } from './app-sidebar'
import Script from 'next/script'
import { Analytics } from "@vercel/analytics/react"
import { Bot, CreditCard, LayoutDashboard } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { usePathname } from 'next/navigation'
import Image from "next/image"
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
                <main className='w-full m-2 bg-slate-950'>
                    <div className='flex items-center gap-2 border-side-border bg-slate-900 border shadow rounded-md p-2 px-4'>
                        {/* <SearchBar /> */}
                        <div className='block md:hidden z-10 fixed left-0 top-12 w-8 h-8 bg-slate-600 rounded-r flex justify-center items-center'>
                            <SidebarTrigger className=' [&_svg]:size-5 flex justify-center items-center' />
                        </div>
                        <div className="w-full flex justify-between sm:justify-end">
                            <div className="flex items-center gap-2 sm:hidden">
                                <Image src="/logo.png" alt="Logo" width={40} height={40} />
                                <h1 className="text-xl font-bold text-primary/80">
                                    GitInsight
                                </h1>
                            </div>
                            <UserButton
                                appearance={{
                                    elements: {
                                        userButtonPopoverMain: "bg-slate-800",
                                        userPreview: "text-slate-400",
                                        userButtonPopoverActionButton__manageAccount: "text-slate-400",
                                        userButtonPopoverActionButton__signOut: "text-slate-400",
                                        userButtonPopoverFooter: "bg-gradient-to-b from-slate-700 to-slate-900"
                                    }
                                }
                                }
                            />
                        </div>
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
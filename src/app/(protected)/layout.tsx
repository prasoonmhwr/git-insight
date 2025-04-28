'use client'
import { SidebarProvider } from '@/components/ui/sidebar'
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
                {/* <AppSidebar /> */}
                <main className='w-full m-2 bg-slate-950'>
                    <div className='flex items-center gap-2 border-side-border bg-slate-900 border shadow rounded-md p-0 px-4'>
                        {/* <SearchBar /> */}
                        <div className="w-full flex justify-between">
                            <div className='flex justify-start w-full'>
                                
                                    {items.map(((item, index) => {
                                        return (<div key={index} className="mr-4 py-2 w-auto flex text-slate-500"><Link  href={item.url} className={cn({
                                            '!border-b !border-b-slate-200 !text-slate-200': pathname == item.url
                                        }, 'flex items-center h-[35px]')}>
                                            <item.icon />
                                            <span className='ml-2 '>{item.title}</span>
                                        </Link></div>

                                        )
                                    }))}
                                
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
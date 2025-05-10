'use client'

import { Button } from "@/components/ui/button"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"
import useProject from "@/hooks/use-project"
import { cn } from "@/lib/utils"
import { UserButton } from "@clerk/nextjs"
import { Bot, CreditCard, LayoutDashboard, Plus, Presentation } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

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

export function AppSidebar() {
    const pathname = usePathname()
    const { open } = useSidebar()
    const { projects, projectId,setProjectId } = useProject()
    return (
        <Sidebar className="bg-slate-950 p-0 rounded-none" collapsible="icon" variant="floating">
            <SidebarHeader className="bg-slate-900">
                <div className="flex items-center gap-2">
                    <Image src="/logo2.svg" alt="Logo" width={40} height={40} />
                    {open && (<h1 className="tracking-tight "><span className="pl-2 text-2xl font-bold tracking-tighter text-white" >Git</span>
                            <span className="text-transparent text-2xl font-bold bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">Insight </span></h1>)}
                </div>
            </SidebarHeader>
            <SidebarContent className="bg-slate-900">
                <SidebarGroup>
                    <SidebarGroupLabel className="text-slate-400">
                        Application
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item => {
                                return (<SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link href={item.url} className={cn({
                                            '!bg-blue-200 !text-blue-500': pathname == item.url
                                        }, 'hover:bg-blue-900')}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>)
                            }))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel className="text-slate-400">
                        Your Projects
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {projects?.map(project => {
                                return (
                                    <SidebarMenuItem key={project.id}>
                                        <SidebarMenuButton asChild>
                                            <div onClick={()=>{
                                                setProjectId(project.id)
                                            }} className="hover:bg-blue-900">
                                                <div className={cn('rounded-sm border size-6 flex items-center justify-center text-sm bg-blue-950 text-blue-200 ',
                                                    {
                                                        'bg-blue-200 text-blue-500': project.id === projectId
                                                    }
                                                )}>
                                                    {project.name[0]}
                                                </div>
                                                <span>{project.name}</span>
                                            </div>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                            <div className="h-2"></div>
                            <SidebarMenuItem className="text-center">
                                <Link href={'/create'}>
                                    <Button size='sm' variant={'outline'} className="w-full bg-blue-600">
                                        <Plus />
                                        {open && ('Create Project')}
                                    </Button>
                                </Link>

                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="bg-slate-900 pb-6">
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
            </SidebarFooter>
        </Sidebar>

    )
}
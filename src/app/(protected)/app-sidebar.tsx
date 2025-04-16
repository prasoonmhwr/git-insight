'use client'

import { Button } from "@/components/ui/button"
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"
import useProject from "@/hooks/use-project"
import { cn } from "@/lib/utils"
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
        <Sidebar className="bg-slate-950" collapsible="icon" variant="floating">
            <SidebarHeader className="bg-slate-900">
                <div className="flex items-center gap-2">
                    <Image src="/logo.png" alt="Logo" width={40} height={40} />
                    {open && (<h1 className="text-xl font-bold text-primary/80">
                        GitInsight
                    </h1>)}
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
                                            '!bg-slate-200 !text-slate-500': pathname == item.url
                                        })}>
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
                                            }}>
                                                <div className={cn('rounded-sm border size-6 flex items-center justify-center text-sm bg-slate-950 text-slate-200',
                                                    {
                                                        'bg-slate-200 text-slate-500': project.id === projectId
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
                                    <Button size='sm' variant={'outline'} className="w-full bg-slate-500">
                                        <Plus />
                                        {open && ('Create Project')}
                                    </Button>
                                </Link>

                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>

    )
}
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Settings,
  Eye,
  Users,
  Zap,
  Sparkles,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const navItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Quote Configuration",
    url: "/dashboard/quote-config",
    icon: Settings,
  },
  {
    title: "Preview",
    url: "/dashboard/preview",
    icon: Eye,
  },
  {
    title: "Leads",
    url: "/dashboard/leads",
    icon: Users,
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-16 flex-row items-center border-b border-sidebar-border px-4">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
            <Zap className="size-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold group-data-[collapsible=icon]:hidden">
            SolarQuote
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="py-4">
          <SidebarGroupContent>
            <SidebarMenu className="gap-1.5 px-2">
              {navItems.map((item) => {
                const isActive = pathname === item.url || 
                  (item.url !== "/dashboard" && pathname.startsWith(item.url))
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className="h-10 px-3"
                    >
                      <Link href={item.url}>
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="rounded-lg border border-border bg-card p-4 group-data-[collapsible=icon]:p-2">
          <div className="mb-3 flex items-center gap-2 group-data-[collapsible=icon]:mb-0 group-data-[collapsible=icon]:justify-center">
            <Sparkles className="size-4 text-primary" />
            <span className="text-sm font-medium group-data-[collapsible=icon]:hidden">
              Upgrade Plan
            </span>
          </div>
          <p className="mb-3 text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
            Get advanced analytics and unlimited leads with Pro.
          </p>
          <Button 
            size="sm" 
            className="w-full group-data-[collapsible=icon]:hidden"
            asChild
          >
            <Link href="/dashboard/upgrade">
              Upgrade to Pro
            </Link>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

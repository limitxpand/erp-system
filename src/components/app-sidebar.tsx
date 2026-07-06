"use client"

import * as React from "react"
import {
  Activity,
  BarChart3,
  BellRing,
  Database,
  History,
  LayoutDashboard,
  Package,
  PhoneCall,
  Receipt,
  Settings,
  ShieldAlert,
  Trash2,
  Users,
  UsersRound,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data. In a real app, this would be fetched from the DB based on RBAC.
const data = {
  navMain: [
    {
      title: "Core Modules",
      items: [
        { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
        { title: "Billing POS", url: "/dashboard/billing", icon: Receipt },
        { title: "Customers", url: "/dashboard/customers", icon: Users },
        { title: "Inventory", url: "/dashboard/inventory", icon: Package },
        { title: "Calling", url: "/dashboard/calling", icon: PhoneCall },
      ],
    },
    {
      title: "Insights & Reports",
      items: [
        { title: "Reports", url: "/dashboard/reports", icon: Activity },
        { title: "Analytics", url: "/dashboard/analytics", icon: BarChart3 },
        { title: "Reminders", url: "/dashboard/reminders", icon: BellRing },
      ],
    },
    {
      title: "System",
      items: [
        { title: "Users", url: "/dashboard/users", icon: UsersRound },
        { title: "Roles", url: "/dashboard/roles", icon: ShieldAlert },
        { title: "Audit Log", url: "/dashboard/audit-log", icon: History },
        { title: "Recycle Bin", url: "/dashboard/recycle-bin", icon: Trash2 },
        { title: "Backup & Restore", url: "/dashboard/backup", icon: Database },
        { title: "Settings", url: "/dashboard/settings", icon: Settings },
        { title: "WhatsApp API", url: "/dashboard/whatsapp", icon: Settings },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold">
            E
          </div>
          <span className="font-semibold text-lg">Enterprise ERP</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {data.navMain.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <a href={item.url} className="w-full block">
                      <SidebarMenuButton>
                        <item.icon />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </a>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}

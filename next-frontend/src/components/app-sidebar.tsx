"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar"
import useAuth from "@/hooks/use-auth"
import { sidebarRoutes } from "@/constants/sidebar-routes"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const { data } = useAuth()
  const user = data?.user

  const navItems = user ? sidebarRoutes[user.rolId] || [] : []

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        {user && <NavUser user={user} />}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

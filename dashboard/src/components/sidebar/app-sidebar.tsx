"use client";

import * as React from "react";
import { LayoutDashboard, BarChart3, Settings, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarRail,
} from "@/components/ui/sidebar";
import { WorkspaceSwitcher } from "./workspace-switcher";
import { useWorkspaces } from "@/hooks/use-workspaces";
import { LogoutButton } from "./logout-button";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { activeWorkspace } = useWorkspaces();
  const pathname = usePathname();
  const slug = activeWorkspace?.slug || "";

  const navMain = [
    { title: "Workspace", url: `/${slug}`, icon: LayoutDashboard },
    { title: "Jobs", url: `/${slug}/jobs`, icon: BarChart3 },
    { title: "Documents", url: `/${slug}/documents`, icon: BarChart3 },
  ];

  const navSystem = [
    { title: "Settings", url: "/settings", icon: Settings },
  ];

  return (
    <Sidebar collapsible="icon" className="border-r-zinc-100 bg-white" {...props}>
      <SidebarHeader>
        <WorkspaceSwitcher />
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    tooltip={item.title}
                    isActive={pathname === item.url}
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navSystem.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    tooltip={item.title}
                    isActive={pathname === item.url}
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <LogoutButton />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
"use client";

import * as React from "react";
import { Building, ChevronsUpDown, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useWorkspaces } from "@/hooks/use-workspaces";
import { useOrganization } from "@/hooks/use-organization";

export function WorkspaceSwitcher() {
  const { isMobile } = useSidebar();
  const { workspaces, activeWorkspace, switchToWorkspace } = useWorkspaces();
  const { data: organization } = useOrganization();
  const router = useRouter();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-zinc-900 text-zinc-50">
                <Building className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeWorkspace?.name || "Select Workspace"}
                </span>
                <span className="truncate text-xs text-muted-foreground uppercase tracking-wider font-medium">
                  {organization?.name}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Workspaces
            </DropdownMenuLabel>
            {workspaces.map((workspace) => (
              <DropdownMenuItem
                key={workspace.id}
                onClick={() => switchToWorkspace(workspace.slug)}
                className="gap-2 p-2 cursor-pointer"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <Building className="size-4 shrink-0" />
                </div>
                {workspace.name}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="gap-2 p-2 cursor-pointer"
              onClick={() => router.push("/workspace-create")}
            >
              <div className="flex size-6 items-center justify-center rounded-md border border-dashed bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">Create Workspace</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
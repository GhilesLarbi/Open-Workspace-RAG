"use client";

import Link from "next/link";
import { Settings } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { DashboardBreadcrumbs } from "./dashboard-breadcrumbs";

export function DashboardHeader() {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between px-4 border-b border-zinc-50 bg-white">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1 cursor-pointer" />        
        <Separator orientation="vertical" className="mr-2 my-1" />        
        <DashboardBreadcrumbs />
      </div>

      <Button variant="ghost" size="icon" asChild className="text-zinc-500 hover:text-zinc-900">
        <Link href="/settings">
          <Settings className="h-4 w-4" />
        </Link>
      </Button>
    </header>
  );
}
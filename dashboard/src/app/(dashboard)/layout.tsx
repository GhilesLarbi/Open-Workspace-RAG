// src/app/(dashboard)/layout.tsx
"use client";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { useWorkspaces } from "@/hooks/use-workspaces";
import { useOrganization } from "@/hooks/use-organization";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { DashboardHeader } from "./_components/dashboard-header";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { workspaces, isLoading: wsLoading } = useWorkspaces();
  const { isLoading: orgLoading } = useOrganization();

  const isLoading = wsLoading || orgLoading;

  useEffect(() => {
    if (!isLoading && workspaces.length === 0) {
      router.replace("/workspace-create");
    }
  }, [workspaces.length, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f9fa]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-300 border-t-zinc-800" />
      </div>
    );
  }

  if (workspaces.length === 0) return null;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-[#f8f9fa] flex flex-col h-screen overflow-hidden">
        <main className="p-2 flex-1 flex flex-col min-h-0">
          <div className="w-full flex-1 bg-white shadow-[0_0_15px_rgba(0,0,0,0.01)] rounded-xl border border-zinc-100 flex flex-col overflow-hidden min-h-0">

            <DashboardHeader />

            {/*
              Content area: flex-1 min-h-0 so it doesn't overflow.
              overflow-y-auto here handles normal scrollable pages.
              Pages that need full height (documents) use h-full + flex
              and their content naturally fills without creating a second scrollbar
              because the panels themselves handle their own overflow.
            */}
            <div className="flex-1 min-h-0 overflow-y-auto px-6 md:px-20 lg:px-40 py-10">
              {children}
            </div>

          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWorkspaces } from "@/hooks/use-workspaces";
import Cookies from "js-cookie";

export default function TrafficControllerPage() {
  const router = useRouter();
  const { workspaces, isLoading } = useWorkspaces();

  useEffect(() => {
    if (isLoading) return;

    // 1. If 0 workspaces, go straight to creation
    if (workspaces.length === 0) {
      router.replace("/workspaces/create");
      return;
    }

    // 2. If 1+ workspaces, pick the best one and go
    const lastSlug = Cookies.get("last_workspace_slug");
    const lastWorkspaceExists = workspaces.find((w) => w.slug === lastSlug);

    if (lastWorkspaceExists) {
      router.replace(`/${lastSlug}`);
    } else {
      router.replace(`/${workspaces[0].slug}`);
    }
  }, [workspaces, isLoading, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-300 border-t-zinc-800" />
    </div>
  );
}
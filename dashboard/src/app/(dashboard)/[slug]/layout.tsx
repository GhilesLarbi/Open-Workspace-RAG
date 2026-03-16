"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useWorkspaces } from "@/hooks/use-workspaces";

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const router = useRouter();
  const { workspaces, isLoading } = useWorkspaces();

  useEffect(() => {
    if (isLoading) return;

    const isValid = workspaces.some((w) => w.slug === params.slug);

    if (!isValid) {
      router.replace("/");
    }
  }, [params.slug, workspaces, isLoading, router]);

  if (isLoading) return null; 
  if (!workspaces.some((w) => w.slug === params.slug)) return null;

  return <>{children}</>;
}
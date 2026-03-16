// src/app/(dashboard)/[slug]/settings/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useWorkspaces } from "@/hooks/use-workspaces";
import { WorkspaceSettingsForm } from "./_components/workspace-settings-form";
import { DangerZone } from "./_components/danger-zone";

export default function WorkspaceSettingsPage() {
  const { workspaces, isLoading } = useWorkspaces();
  const params = useParams();
  const workspace = workspaces.find((w) => w.slug === params.slug);

  if (isLoading || !workspace) return null;

  return (
    <div className="flex flex-col gap-12 w-full pb-12 max-w-3xl">
      <WorkspaceSettingsForm workspace={workspace} />
      <div className="border-t border-border pt-10">
        <DangerZone slug={workspace.slug} />
      </div>
    </div>
  );
}
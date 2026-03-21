"use client";

import { useWorkspaces } from "@/hooks/use-workspaces";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateWorkspaceForm } from "./_components/create-workspace-form";

export default function CreateWorkspacePage() {
  const router = useRouter();
  const { workspaces, isLoading } = useWorkspaces();

  const canExit = workspaces.length > 0;

  if (isLoading) return null;

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-6">
        {canExit && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/workspaces")}
            className="text-zinc-500 hover:text-zinc-900 -ml-2"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to workspaces
          </Button>
        )}
      </div>

      <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-zinc-200">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">New Workspace</CardTitle>
          <CardDescription>
            Create a dedicated space for your team and projects.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateWorkspaceForm />
        </CardContent>
      </Card>
    </div>
  );
}
"use client";

import { Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWorkspaces } from "@/hooks/use-workspaces";
import { useRouter } from "next/navigation";

export function DangerZone({ slug }: { slug: string }) {
  const { deleteWorkspace } = useWorkspaces();
  const router = useRouter();

  const onDelete = async () => {
    if (confirm("Permanently delete this workspace? This cannot be undone.")) {
      await deleteWorkspace.mutateAsync(slug);
      router.push("/");
    }
  };

  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-6 flex items-center justify-between mt-12">
      <div className="space-y-1">
        <h3 className="text-sm font-bold text-red-950 uppercase tracking-tight">Danger Zone</h3>
        <p className="text-sm text-red-700 font-medium leading-none">
          Deleting this workspace will remove all associated data.
        </p>
      </div>
      <Button 
        variant="destructive" 
        size="sm" 
        className="p-4 h-10 cursor-pointer font-bold"
        onClick={onDelete}
        disabled={deleteWorkspace.isPending}
      >
        {deleteWorkspace.isPending ? <Loader2 className="animate-spin size-4" /> : <Trash2 className="size-4 mr-2" />}
        Delete Workspace
      </Button>
    </div>
  );
}
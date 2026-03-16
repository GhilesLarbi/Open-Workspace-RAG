// src/app/(workspaces)/workspaces/create/_hooks/use-create-workspace.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { Workspace } from "@/types/workspace";
import { CreateWorkspaceValues } from "../_types";
import { useRouter } from "next/navigation";
import { useWorkspaces } from "@/hooks/use-workspaces";

export function useCreateWorkspace() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { workspaces } = useWorkspaces();

  return useMutation({
    mutationFn: (data: CreateWorkspaceValues) =>
      apiFetch<Workspace>("/workspaces/", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: (newWorkspace) => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });

      if (workspaces.length === 0) {
        router.push(`/${newWorkspace.slug}`);
      } else {
        router.push("/workspaces");
      }
    },
  });
}
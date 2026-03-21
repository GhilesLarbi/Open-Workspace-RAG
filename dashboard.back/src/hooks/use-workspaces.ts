import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { Workspace, WorkspaceCreate, WorkspaceUpdate } from "@/types/workspace";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useEffect } from "react";
import Cookies from "js-cookie";

const WORKSPACES_KEY = ["workspaces"];
const COOKIE_NAME = "last_workspace_slug";

export function useWorkspaces() {
  const queryClient = useQueryClient();
  const params = useParams();
  const router = useRouter();

  const query = useQuery({
    queryKey: WORKSPACES_KEY,
    queryFn: () => apiFetch<Workspace[]>("/workspaces/"),
    staleTime: 1000 * 60 * 5,
  });

  const workspaces = query.data ?? [];

  const activeWorkspace = useMemo(() => {
    if (workspaces.length === 0) return null;

    if (params?.slug) {
      return workspaces.find((w) => w.slug === params.slug) || null;
    }

    const savedSlug = Cookies.get(COOKIE_NAME);
    if (savedSlug) {
      const saved = workspaces.find((w) => w.slug === savedSlug);
      if (saved) return saved;
    }

    return workspaces[0];
  }, [workspaces, params?.slug]);

  useEffect(() => {
    if (params?.slug) {
      Cookies.set(COOKIE_NAME, params.slug as string, { expires: 30 });
    }
  }, [params?.slug]);

  const switchToWorkspace = (slug: string) => {
    Cookies.set(COOKIE_NAME, slug, { expires: 30 });
    router.push(`/${slug}`);
  };

  const createMutation = useMutation({
    mutationFn: (data: WorkspaceCreate) => apiFetch<Workspace>("/workspaces/", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: WORKSPACES_KEY }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ slug, data }: { slug: string; data: WorkspaceUpdate }) =>
      apiFetch<Workspace>(`/workspaces/${slug}`, { method: "PATCH", body: JSON.stringify(data) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: WORKSPACES_KEY }),
  });

  const deleteMutation = useMutation({
    mutationFn: (slug: string) => apiFetch<{ status: string; info: string }>(`/workspaces/${slug}`, { method: "DELETE" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: WORKSPACES_KEY }),
  });

  return {
    workspaces,
    activeWorkspace,
    isLoading: query.isLoading,
    error: query.error,
    switchToWorkspace,
    createWorkspace: createMutation,
    updateWorkspace: updateMutation,
    deleteWorkspace: deleteMutation,
  };
}
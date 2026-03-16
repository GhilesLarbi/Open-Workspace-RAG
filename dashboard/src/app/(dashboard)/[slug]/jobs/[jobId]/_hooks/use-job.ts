import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { Job, JobConfig } from "../../_types";
import { getPollInterval } from "../../_hooks/use-poll-interval";

export function useJob(jobId: string) {
  const queryClient = useQueryClient();
  const { slug } = useParams<{ slug: string }>();

  const query = useQuery({
    queryKey: ["job", slug, jobId],
    queryFn: () => apiFetch<Job>(`/jobs/${slug}/${jobId}`),
    enabled: !!slug && !!jobId,
    refetchInterval: (query) => getPollInterval(query.state.data),
  });

  const updateMutation = useMutation({
    mutationFn: (config: JobConfig) =>
      apiFetch<Job>(`/jobs/${slug}/${jobId}`, {
        method: "PATCH",
        body: JSON.stringify(config),
      }),
    onSuccess: (updated) => {
      queryClient.setQueryData(["job", slug, jobId], updated);
      queryClient.invalidateQueries({ queryKey: ["jobs", slug] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () =>
      apiFetch(`/jobs/${slug}/${jobId}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs", slug] });
    },
  });

  const runMutation = useMutation({
    mutationFn: () =>
      apiFetch<Job[]>(`/jobs/${slug}/run`, {
        method: "POST",
        body: JSON.stringify([jobId]),
      }),
    onSuccess: (jobs) => {
      const updated = jobs[0];
      if (updated) queryClient.setQueryData(["job", slug, jobId], updated);
      queryClient.invalidateQueries({ queryKey: ["jobs", slug] });
    },
  });

  return {
    job: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,

    updateJob: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,

    deleteJob: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,

    runJob: runMutation.mutateAsync,
    isRunning: runMutation.isPending,
  };
}
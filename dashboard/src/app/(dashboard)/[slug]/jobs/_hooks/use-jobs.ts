// src/app/(dashboard)/[slug]/jobs/_hooks/use-jobs.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import {
  Job,
  JobConfig,
  JobCreateResponse,
  JobDeleteResponse,
  JobStatus,
  PaginatedResponse,
} from "../_types";
import { getPollIntervalForList } from "./use-poll-interval";

interface UseJobsParams {
  skip?: number;
  limit?: number;
  statuses?: JobStatus[];
}

export function useJobs(params: UseJobsParams = {}) {
  const queryClient = useQueryClient();
  const { slug } = useParams<{ slug: string }>();

  const { skip = 0, limit = 10, statuses } = params;
  const queryKey = ["jobs", slug, { skip, limit, statuses }];

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      searchParams.set("skip", skip.toString());
      searchParams.set("limit", limit.toString());
      if (statuses?.length) {
        statuses.forEach((s) => searchParams.append("status", s));
      }
      return apiFetch<PaginatedResponse<Job>>(`/jobs/${slug}?${searchParams.toString()}`);
    },
    enabled: !!slug,
    placeholderData: (prev) => prev,
    // Poll only when the current page contains active, non-stale jobs
    refetchInterval: (query) =>
      getPollIntervalForList(query.state.data?.items ?? []),
  });

  const createMutation = useMutation({
    mutationFn: (config: JobConfig) =>
      apiFetch<JobCreateResponse>(`/jobs/${slug}`, {
        method: "POST",
        body: JSON.stringify(config),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs", slug] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ jobId, config }: { jobId: string; config: JobConfig }) =>
      apiFetch<Job>(`/jobs/${slug}/${jobId}`, {
        method: "PATCH",
        body: JSON.stringify(config),
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["jobs", slug] });
      queryClient.invalidateQueries({ queryKey: ["job", slug, variables.jobId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (jobIds: string[]) =>
      apiFetch<JobDeleteResponse>(`/jobs/${slug}`, {
        method: "DELETE",
        body: JSON.stringify(jobIds),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs", slug] });
    },
  });

  const runMutation = useMutation({
    mutationFn: (jobIds: string[]) =>
      apiFetch<Job[]>(`/jobs/${slug}/run`, {
        method: "POST",
        body: JSON.stringify(jobIds),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs", slug] });
    },
  });

  return {
    jobs: query.data?.items ?? [],
    total: query.data?.total ?? 0,

    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,

    createJob: createMutation.mutateAsync,
    updateJob: updateMutation.mutateAsync,
    deleteJobs: deleteMutation.mutateAsync,
    runJobs: runMutation.mutateAsync,

    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isRunning: runMutation.isPending,
  };
}
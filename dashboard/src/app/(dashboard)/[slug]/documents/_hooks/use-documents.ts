// src/app/(dashboard)/[slug]/documents/_hooks/use-documents.ts
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { Document } from "../_types";

interface UseDocumentsParams {
  limit?: number;
  documentIds?: string[];
}

export function useDocuments(params: UseDocumentsParams = {}) {
  const { slug } = useParams<{ slug: string }>();
  const queryClient = useQueryClient();
  const { limit = 20, documentIds } = params;

  const queryKey =["documents", slug, { limit, documentIds }];

  const query = useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam }) => {
      const sp = new URLSearchParams();
      sp.set("skip", pageParam.toString());
      sp.set("limit", limit.toString());
      documentIds?.forEach((id) => sp.append("document_ids", id));
      return apiFetch<Document[]>(`/documents/${slug}?${sp.toString()}`);
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < limit) return undefined;
      return allPages.flat().length;
    },
    enabled: !!slug,
  });

  const deleteMutation = useMutation({
    mutationFn: (ids: string[]) =>
      apiFetch(`/documents/${slug}`, {
        method: "DELETE",
        body: JSON.stringify(ids),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents", slug] });
    },
  });

  const approveMutation = useMutation({
    mutationFn: ({ ids, is_approved }: { ids: string[]; is_approved: boolean }) =>
      apiFetch(`/documents/${slug}/approval?is_approved=${is_approved}`, {
        method: "PATCH",
        body: JSON.stringify(ids),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents", slug] });
    },
  });

  return {
    documents: query.data?.pages.flat() ??[],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isFetchingNextPage: query.isFetchingNextPage,
    isError: query.isError,
    hasNextPage: query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
    
    deleteDocuments: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    
    approveDocuments: approveMutation.mutateAsync,
    isApproving: approveMutation.isPending,
  };
}
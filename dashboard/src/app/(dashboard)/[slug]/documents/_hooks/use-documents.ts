// src/app/(dashboard)/[slug]/documents/_hooks/use-documents.ts
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { Document, PaginatedDocumentResponse, LanguageEnum, JobDocumentAction } from "../_types";

interface UseDocumentsParams {
  limit?: number;
  documentIds?: string[];
  jobIds?: string[];
  isApproved?: boolean;
  lang?: LanguageEnum;
  actions?: JobDocumentAction[];
}

export function useDocuments(params: UseDocumentsParams = {}) {
  const { slug } = useParams<{ slug: string }>();
  const queryClient = useQueryClient();
  
  const { 
    limit = 20, 
    documentIds, 
    jobIds, 
    isApproved, 
    lang, 
    actions 
  } = params;

  const queryKey = ["documents", slug, params];

  const query = useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam }) => {
      const sp = new URLSearchParams();
      sp.set("skip", pageParam.toString());
      sp.set("limit", limit.toString());

      documentIds?.forEach((id) => sp.append("document_ids", id));
      jobIds?.forEach((id) => sp.append("job_ids", id));
      actions?.forEach((action) => sp.append("actions", action));

      if (isApproved !== undefined) {
        sp.set("is_approved", String(isApproved));
      }
      if (lang) {
        sp.set("lang", lang);
      }

      return apiFetch<PaginatedDocumentResponse>(`/documents/${slug}?${sp.toString()}`);
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const nextSkip = lastPage.skip + lastPage.limit;
      return nextSkip < lastPage.total ? nextSkip : undefined;
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
    documents: query.data?.pages.flatMap((page) => page.items) ?? [],
    totalCount: query.data?.pages[0]?.total ?? 0,
    
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
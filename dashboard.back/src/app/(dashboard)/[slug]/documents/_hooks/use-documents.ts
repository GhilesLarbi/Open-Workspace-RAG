// src/app/(dashboard)/[slug]/documents/_hooks/use-documents.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { Document, PaginatedDocumentResponse, LanguageEnum, JobDocumentAction } from "../_types";

interface UseDocumentsParams {
  page?: number;
  pageSize?: number;
  q?: string;
  documentIds?: string[];
  jobIds?: string[];
  isApproved?: boolean;
  langs?: LanguageEnum[];
  actions?: JobDocumentAction[];
}

export function useDocuments(params: UseDocumentsParams = {}) {
  const { slug } = useParams<{ slug: string }>();
  const queryClient = useQueryClient();
  
  const { 
    page = 1, 
    pageSize = 10, 
    q,
    documentIds, 
    jobIds, 
    isApproved, 
    langs, 
    actions 
  } = params;

  const skip = (page - 1) * pageSize;

  const queryKey = ["documents", slug, { skip, pageSize, q, documentIds, jobIds, isApproved, langs, actions }];

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const sp = new URLSearchParams();
      sp.set("skip", skip.toString());
      sp.set("limit", pageSize.toString());

      if (q) sp.set("q", q);
      documentIds?.forEach((id) => sp.append("document_ids", id));
      jobIds?.forEach((id) => sp.append("job_ids", id));
      langs?.forEach((l) => sp.append("langs", l));
      actions?.forEach((action) => sp.append("actions", action));

      if (isApproved !== undefined) {
        sp.set("is_approved", String(isApproved));
      }

      return apiFetch<PaginatedDocumentResponse>(`/documents/${slug}?${sp.toString()}`);
    },
    enabled: !!slug,
    placeholderData: (prev) => prev,
  });

  const deleteMutation = useMutation({
    mutationFn: (ids: string[]) =>
      apiFetch(`/documents/${slug}`, { method: "DELETE", body: JSON.stringify(ids) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["documents", slug] }),
  });

  const approveMutation = useMutation({
    mutationFn: ({ ids, is_approved }: { ids: string[]; is_approved: boolean }) =>
      apiFetch(`/documents/${slug}/approval?is_approved=${is_approved}`, {
        method: "PATCH",
        body: JSON.stringify(ids),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["documents", slug] }),
  });

  return {
    documents: query.data?.items ?? [],
    totalCount: query.data?.total ?? 0,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    deleteDocuments: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    approveDocuments: approveMutation.mutateAsync,
    isApproving: approveMutation.isPending,
  };
}
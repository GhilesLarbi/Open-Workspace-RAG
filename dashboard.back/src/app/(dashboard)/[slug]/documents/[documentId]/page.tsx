// src/app/(dashboard)/[slug]/documents/[documentId]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { DocumentWithChunks } from "../_types";
import { DocumentDetail } from "../_components/detail/document-detail";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function DocumentDetailPage() {
  const { slug, documentId } = useParams<{ slug: string; documentId: string }>();

  const { data: document, isLoading, isError } = useQuery({
    queryKey: ["document", slug, documentId],
    queryFn: () => apiFetch<DocumentWithChunks>(`/documents/${slug}/${documentId}`),
    enabled: !!slug && !!documentId,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary/60" />
        <p className="text-sm text-muted-foreground animate-pulse">
          Fetching document and chunks...
        </p>
      </div>
    );
  }

  if (isError || !document) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
        <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
          <AlertCircle className="h-6 w-6 text-destructive" />
        </div>
        <div>
          <p className="text-lg font-semibold">Document not found</p>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto">
            The document might have been deleted or you don't have permission to view it.
          </p>
        </div>
        <Button asChild variant="outline" className="mt-2">
          <Link href={`/${slug}/documents`}>Return to Documents</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 max-w-5xl mx-auto w-full pb-20">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="w-fit -ml-2 text-muted-foreground hover:text-foreground"
        >
          <Link href={`/${slug}/documents`}>
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Documents
          </Link>
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
        <DocumentDetail document={document} />
      </div>
    </div>
  );
}
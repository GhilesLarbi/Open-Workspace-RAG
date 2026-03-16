"use client";

import { useEffect, useRef } from "react";
import { FileText, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { DocumentListItem } from "./document-list-item";
import { Document } from "../../_types";

interface DocumentListProps {
  documents: Document[];
  selectedId: string | null;
  onSelect: (doc: Document) => void;
  checkedIds: Set<string>;
  onCheck: (id: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
}

export function DocumentList({ 
  documents, 
  selectedId, 
  onSelect, 
  checkedIds,
  onCheck,
  onSelectAll,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  fetchNextPage
}: DocumentListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!bottomRef.current || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { root: null, rootMargin: "200px", threshold: 0 }
    );

    observer.observe(bottomRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="divide-y divide-border">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="px-4 py-3.5 space-y-2 flex items-start gap-3">
            <Skeleton className="h-4 w-4 shrink-0 rounded-sm" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 py-20 text-center px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
          <FileText className="h-5 w-5 text-muted-foreground" />
        </div>
        <div>
          <p className="text-sm font-medium">No documents</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Run a job to start crawling documents.
          </p>
        </div>
      </div>
    );
  }

  const allChecked = documents.length > 0 && checkedIds.size === documents.length;
  const someChecked = checkedIds.size > 0 && checkedIds.size < documents.length;

  return (
    <div className="flex flex-col">
      <div className="px-4 py-2 border-b border-border bg-muted/30 flex items-center gap-3 sticky top-0 z-10 backdrop-blur-sm">
        <Checkbox
          checked={allChecked ? true : someChecked ? "indeterminate" : false}
          onCheckedChange={(checked) => onSelectAll(!!checked)}
          id="select-all"
        />
        <label htmlFor="select-all" className="text-xs font-medium text-muted-foreground uppercase tracking-wide cursor-pointer select-none">
          Select All
        </label>
      </div>

      <div className="divide-y divide-border">
        {documents.map((doc) => (
          <DocumentListItem
            key={doc.id}
            document={doc}
            isSelected={doc.id === selectedId}
            onSelect={() => onSelect(doc)}
            isChecked={checkedIds.has(doc.id)}
            onCheck={(checked) => onCheck(doc.id, checked)}
          />
        ))}
      </div>

      {/* Infinite Scroll trigger point */}
      <div ref={bottomRef} className="py-6 flex justify-center">
        {isFetchingNextPage && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
      </div>
    </div>
  );
}
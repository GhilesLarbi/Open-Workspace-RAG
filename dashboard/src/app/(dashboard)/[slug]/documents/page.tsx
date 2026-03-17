// src/app/(dashboard)/[slug]/documents/page.tsx
"use client";

import { useState, useEffect } from "react";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { DocumentsHeader } from "./_components/documents-header";
import { DocumentList } from "./_components/list/document-list";
import { DocumentDetail } from "./_components/detail/document-detail";
import { EmptyDetail } from "./_components/detail/empty-detail";
import { DocumentsBulkActions } from "./_components/documents-bulk-actions";
import { DocumentsFilterToolbar } from "./_components/documents-filter-toolbar";
import { useDocuments } from "./_hooks/use-documents";
import { useDocumentQueryParams } from "./_hooks/use-document-query-params";

export default function DocumentsPage() {
  // 1. Get all filter states from the URL
  const { documentIds, jobIds, lang, isApproved, actions } = useDocumentQueryParams();

  // 2. Local state for selection (which doc is open) and checking (bulk actions)
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());

  // 3. Fetch documents using the combined filters from the URL
  const {
    documents,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    deleteDocuments,
    isDeleting,
    approveDocuments,
    isApproving,
    totalCount,
  } = useDocuments({
    documentIds,
    jobIds,
    lang,
    isApproved,
    actions,
  });

  // 4. Auto-select the first document when results change or on initial load
  useEffect(() => {
    if (documents.length > 0 && !selectedDocId) {
      setSelectedDocId(documents[0].id);
    }
  }, [documents, selectedDocId]);

  const selectedDoc = documents.find((d) => d.id === selectedDocId) || null;

  // --- Handlers ---

  const handleCheck = (id: string, checked: boolean) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setCheckedIds(new Set(documents.map((d) => d.id)));
    } else {
      setCheckedIds(new Set());
    }
  };

  const handleClearChecks = () => setCheckedIds(new Set());

  const handleDelete = async () => {
    await deleteDocuments(Array.from(checkedIds));
    const deletedCount = checkedIds.size;
    setCheckedIds(new Set());
    // If we deleted the currently selected document, clear the selection
    if (selectedDocId && checkedIds.has(selectedDocId)) {
      setSelectedDocId(null);
    }
  };

  const handleApprove = async () => {
    await approveDocuments({ ids: Array.from(checkedIds), is_approved: true });
    setCheckedIds(new Set());
  };

  const handleUnapprove = async () => {
    await approveDocuments({ ids: Array.from(checkedIds), is_approved: false });
    setCheckedIds(new Set());
  };

  const isFiltered = !!(documentIds?.length || jobIds?.length || lang || isApproved !== undefined || actions?.length);

  return (
    <div
      className="flex flex-col gap-2 relative overflow-hidden"
      style={{ height: "calc(100vh - 154px)" }}
    >
      {/* Header section with total count info */}
      <DocumentsHeader total={totalCount} isFiltered={isFiltered} />

      {/* Filter Toolbar (Selects for Lang, Approval, etc) */}
      <DocumentsFilterToolbar />

      {/* Split View */}
      <ResizablePanelGroup className="flex-1 min-h-0">
        {/* Left Side: Scrollable List */}
        <ResizablePanel defaultSize={45} minSize={15}>
          <div className="h-full rounded-xl border border-border bg-card overflow-y-auto">
            <DocumentList
              documents={documents}
              selectedId={selectedDocId}
              onSelect={(doc) => setSelectedDocId(doc.id)}
              checkedIds={checkedIds}
              onCheck={handleCheck}
              onSelectAll={handleSelectAll}
              isLoading={isLoading}
              isFetchingNextPage={isFetchingNextPage}
              hasNextPage={hasNextPage}
              fetchNextPage={fetchNextPage}
            />
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle className="mx-2" />

        <ResizablePanel defaultSize={55} minSize={15}>
          <div className="h-full rounded-xl border border-border bg-card overflow-hidden">
            {selectedDoc ? (
              <DocumentDetail document={selectedDoc} />
            ) : (
              <EmptyDetail />
            )}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>

      <DocumentsBulkActions
        selectedCount={checkedIds.size}
        onApprove={handleApprove}
        onUnapprove={handleUnapprove}
        onDelete={handleDelete}
        onClear={handleClearChecks}
        isApproving={isApproving}
        isDeleting={isDeleting}
      />
    </div>
  );
}
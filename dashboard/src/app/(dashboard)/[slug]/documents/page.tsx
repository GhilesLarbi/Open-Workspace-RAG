// src/app/(dashboard)/[slug]/documents/page.tsx
"use client";

import { DocumentsHeader } from "./_components/documents-header";
import { DocumentsTable } from "./_components/table/documents-table";
import { useDocuments } from "./_hooks/use-documents";
import { useDocumentQueryParams } from "./_hooks/use-document-query-params";

export default function DocumentsPage() {
  const { q, langs, isApproved, actions, jobIds, documentIds } = useDocumentQueryParams();

  const { totalCount } = useDocuments({
    q,
    langs,
    isApproved,
    actions,
    jobIds,
    documentIds,
    pageSize: 1,
  });

  const isFiltered = !!(q || langs.length || isApproved !== undefined || jobIds.length || documentIds.length);

  return (
    <div className="flex flex-col gap-6">
      <DocumentsHeader total={totalCount} isFiltered={isFiltered} />
      <DocumentsTable />
    </div>
  );
}
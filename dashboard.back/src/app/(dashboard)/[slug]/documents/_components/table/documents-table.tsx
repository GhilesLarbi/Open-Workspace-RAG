// src/app/(dashboard)/[slug]/documents/_components/table/documents-table.tsx
"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table";

import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { getDocumentColumns } from "./documents-table-columns";
import { DocumentsTableToolbar } from "./documents-table-toolbar";
import { useDocuments } from "../../_hooks/use-documents";
import { useDocumentQueryParams } from "../../_hooks/use-document-query-params";
import { DocumentsBulkActions } from "../documents-bulk-actions";

export function DocumentsTable() {
  const { slug } = useParams<{ slug: string }>();
  const { page, pageSize, q, langs, isApproved, jobIds, actions, documentIds, setParams } = useDocumentQueryParams();
  const { 
    documents, 
    totalCount, 
    isLoading, 
    isFetching,
    deleteDocuments,
    isDeleting,
    approveDocuments,
    isApproving
  } = useDocuments({
    page,
    pageSize,
    q,
    langs,
    isApproved,
    jobIds,
    actions,
    documentIds
  });
  const [rowSelection, setRowSelection] = useState({});
  const columns = useMemo(() => getDocumentColumns(slug), [slug]);

  const table = useReactTable({
    data: documents,
    columns,
    rowCount: totalCount,
    state: {
      rowSelection,
      pagination: { pageIndex: page - 1, pageSize },
    },
    onRowSelectionChange: setRowSelection,
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        const newState = updater({ pageIndex: page - 1, pageSize });
        setParams({ page: newState.pageIndex + 1, pageSize: newState.pageSize });
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
  });

  const selectedIds = table.getFilteredSelectedRowModel().rows.map(r => r.original.id);

  return (
    <div className="space-y-4">
      <DocumentsTableToolbar table={table} />
      <DataTable
        table={table}
        columnsLength={columns.length}
        isLoading={isLoading}
        isFetching={isFetching}
      />
      <DataTablePagination table={table} totalRows={totalCount} />

      <DocumentsBulkActions
        selectedCount={selectedIds.length}
        onApprove={() => approveDocuments({ ids: selectedIds, is_approved: true }).then(() => setRowSelection({}))}
        onUnapprove={() => approveDocuments({ ids: selectedIds, is_approved: false }).then(() => setRowSelection({}))}
        onDelete={() => deleteDocuments(selectedIds).then(() => setRowSelection({}))}
        onClear={() => setRowSelection({})}
        isApproving={isApproving}
        isDeleting={isDeleting}
      />
    </div>
  );
}
// src/app/(dashboard)/[slug]/jobs/_components/jobs-table.tsx
"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
} from "@tanstack/react-table";

import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { getJobColumns } from "./jobs-table-columns";
import { JobsTableToolbar } from "./jobs-table-toolbar";
import { JobsBulkActions } from "./jobs-bulk-actions";
import { useJobs } from "../_hooks/use-jobs";
import { useJobQueryParams } from "../_hooks/use-job-query-params";

export function JobsTable() {
  const params = useParams();
  const slug = params.slug as string;

  const { page, pageSize, statuses, setParams } = useJobQueryParams();

  const { jobs, total, isLoading, isFetching, isDeleting, isRunning, deleteJobs, runJobs } = useJobs({
    skip: (page - 1) * pageSize,
    limit: pageSize,
    statuses,
  });

  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo(() => getJobColumns(slug), [slug]);

  const table = useReactTable({
    data: jobs,
    columns,
    rowCount: total,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination: { pageIndex: page - 1, pageSize },
    },
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        const newState = updater({ pageIndex: page - 1, pageSize });
        setParams({ page: newState.pageIndex + 1, pageSize: newState.pageSize });
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
  });

  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const selectedIds = selectedRows.map((r: any) => r.original.id as string);

  const handleDelete = async () => {
    if (!confirm(`Delete ${selectedIds.length} job${selectedIds.length > 1 ? "s" : ""}?`)) return;
    await deleteJobs(selectedIds);
    setRowSelection({});
  };

  const handleRun = async () => {
    await runJobs(selectedIds);
    setRowSelection({});
  };

  return (
    <div className="space-y-4">
      <JobsTableToolbar table={table} />
      <DataTable
        table={table}
        columnsLength={columns.length}
        isLoading={isLoading}
        isFetching={isFetching}
        noResultsMessage="No jobs found matching your criteria."
      />
      <DataTablePagination table={table} totalRows={total} />

      <JobsBulkActions
        selectedCount={selectedIds.length}
        onRun={handleRun}
        onDelete={handleDelete}
        onClear={() => setRowSelection({})}
        isRunning={isRunning}
        isDeleting={isDeleting}
      />
    </div>
  );
}
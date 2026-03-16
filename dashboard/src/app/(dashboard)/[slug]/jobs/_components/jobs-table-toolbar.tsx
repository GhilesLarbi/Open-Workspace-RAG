// src/app/(dashboard)/[slug]/jobs/_components/jobs-table-toolbar.tsx
"use client";

import { Table } from "@tanstack/react-table";
import { CheckCircle2, CircleDashed, Loader2, X, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableFacetedFilter } from "@/components/data-table/data-table-faceted-filter";

interface JobsTableToolbarProps<TData> {
  table: Table<TData>;
}

const statusOptions = [
  { label: "Pending", value: "PENDING", icon: CircleDashed },
  { label: "Started", value: "STARTED", icon: Loader2 },
  { label: "Success", value: "SUCCESS", icon: CheckCircle2 },
  { label: "Failure", value: "FAILURE", icon: XCircle },
];

export function JobsTableToolbar<TData>({ table }: JobsTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center gap-2">
      <Input
        placeholder="Filter by task ID…"
        value={(table.getColumn("task_id")?.getFilterValue() as string) ?? ""}
        onChange={(e) => table.getColumn("task_id")?.setFilterValue(e.target.value)}
        className="h-8 w-[200px] text-sm"
      />
      {table.getColumn("status") && (
        <DataTableFacetedFilter
          column={table.getColumn("status")}
          title="Status"
          options={statusOptions}
        />
      )}
      {isFiltered && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => table.resetColumnFilters()}
          className="h-8 px-2 text-muted-foreground hover:text-foreground"
        >
          Reset
          <X className="ml-1.5 h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );
}
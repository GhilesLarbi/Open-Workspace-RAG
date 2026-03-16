// src/components/data-table/data-table.tsx
"use client";

import { Table as TanstackTable, flexRender } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface DataTableProps<TData> {
  table: TanstackTable<TData>;
  columnsLength: number;
  isLoading?: boolean;
  isFetching?: boolean;
  noResultsMessage?: string;
}

export function DataTable<TData>({
  table,
  columnsLength,
  isLoading,
  isFetching,
  noResultsMessage = "No results found.",
}: DataTableProps<TData>) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="hover:bg-transparent border-border"
            >
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  colSpan={header.colSpan}
                  className="h-10 text-xs text-muted-foreground font-medium"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <TableRow key={index} className="border-border hover:bg-transparent">
                {Array.from({ length: columnsLength }).map((_, cellIndex) => (
                  <TableCell key={cellIndex} className="py-3">
                    <Skeleton className="h-4 w-full max-w-[180px]" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className={cn(
                  "border-border transition-colors hover:bg-muted/30",
                  isFetching && "opacity-50"
                )}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columnsLength}
                className="h-32 text-center text-sm text-muted-foreground"
              >
                {noResultsMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
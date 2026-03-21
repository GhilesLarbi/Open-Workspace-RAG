// src/app/(dashboard)/[slug]/documents/_components/table/documents-table-columns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Document } from "../../_types"; // Lightweight type
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, ExternalLink, Clock } from "lucide-react";
import { DocumentsTableRowActions } from "./documents-table-row-actions";
import Link from "next/link";

export function getDocumentColumns(slug: string): ColumnDef<Document>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "title",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Document" />,
      cell: ({ row }) => {
        const doc = row.original;        
        return (
          <div className="flex flex-col gap-0.5 max-w-[400px]">
            <Link 
              href={`/${slug}/documents/${doc.id}`}
              className="text-sm font-medium hover:underline text-foreground truncate"
            >
              {doc.title && doc.title !== "Untitled" ? doc.title : <span className="italic text-muted-foreground font-normal">Untitled</span>}
            </Link>
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground font-mono">
              <span className="truncate">{doc.url}</span>
              <a href={doc.url} target="_blank" rel="noreferrer" className="hover:text-foreground">
                <ExternalLink className="h-2.5 w-2.5" />
              </a>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "is_approved",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => {
        const isApproved = row.getValue("is_approved") as boolean;
        return isApproved ? (
          <Badge variant="outline" className="gap-1 text-emerald-600 border-emerald-200 bg-emerald-50 dark:bg-emerald-950/30 dark:border-emerald-900">
            <CheckCircle2 className="h-3 w-3" /> Approved
          </Badge>
        ) : (
          <Badge variant="outline" className="gap-1 text-muted-foreground">
            <Circle className="h-3 w-3" /> Pending
          </Badge>
        );
      },
    },
    {
      accessorKey: "lang",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Lang" />,
      cell: ({ row }) => (
        <Badge variant="secondary" className="font-mono text-[10px] uppercase px-1.5 py-0 h-4">
          {row.getValue("lang")}
        </Badge>
      ),
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Created" />,
      cell: ({ row }) => {
        const date = new Date(row.getValue("created_at") as string);
        return (
          <div className="flex flex-col gap-0.5 whitespace-nowrap">
            <span className="text-xs text-foreground font-medium">
              {date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
              {date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => <DocumentsTableRowActions row={row} />,
    },
  ];
}
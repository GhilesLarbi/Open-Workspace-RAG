// src/app/(dashboard)/[slug]/jobs/_components/jobs-table-columns.tsx
"use client";

import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowRight } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/shared/copy-button";
import { StatusBadge } from "@/components/shared/status-badge";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Job } from "../_types";

export function getJobColumns(slug: string): ColumnDef<Job>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
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
      accessorKey: "id",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Job ID" />,
      cell: ({ row }) => {
        const id = row.getValue("id") as string;
        return (
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-sm text-foreground" title={id}>
              {id.split("-")[0]}
            </span>
            <CopyButton value={id} tooltipText="Copy Job ID" />
          </div>
        );
      },
    },
    {
      accessorKey: "task_id",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Task ID" />,
      cell: ({ row }) => {
        const taskId = row.getValue("task_id") as string | null;
        if (!taskId)
          return <span className="text-sm text-muted-foreground">—</span>;
        return (
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-sm text-foreground" title={taskId}>
              {taskId.split("-")[0]}
            </span>
            <CopyButton value={taskId} tooltipText="Copy Task ID" />
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
      filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Created" />,
      cell: ({ row }) => {
        const date = new Date(row.getValue("created_at") as string);
        return (
          <div className="flex flex-col gap-0.5">
            <span className="text-sm text-foreground">
              {date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
            <span className="text-xs text-muted-foreground">
              {date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const job = row.original;
        return (
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="h-7 w-7 text-muted-foreground hover:text-foreground"
            >
              <Link href={`/${slug}/jobs/${job.id}`} title="View details">
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        );
      },
    },
  ];
}
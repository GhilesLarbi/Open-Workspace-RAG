// src/app/(dashboard)/[slug]/documents/_components/table/documents-table-row-actions.tsx
"use client";

import { Row } from "@tanstack/react-table";
import { MoreHorizontal, Eye, CheckCircle, Circle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Document } from "../../_types";
import { useParams, useRouter } from "next/navigation";
import { useDocuments } from "../../_hooks/use-documents";

interface DataTableRowActionsProps {
  row: Row<Document>;
}

export function DocumentsTableRowActions({ row }: DataTableRowActionsProps) {
  const router = useRouter();
  const { slug } = useParams<{ slug: string }>();
  const { approveDocuments, deleteDocuments } = useDocuments();
  const doc = row.original;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted cursor-pointer">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem onClick={() => router.push(`/${slug}/documents/${doc.id}`)} className="cursor-pointer">
          <Eye className="mr-2 h-3.5 w-3.5" /> View Details
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => approveDocuments({ ids: [doc.id], is_approved: !doc.is_approved })} className="cursor-pointer">
          {doc.is_approved ? (
            <><Circle className="mr-2 h-3.5 w-3.5" /> Mark Pending</>
          ) : (
            <><CheckCircle className="mr-2 h-3.5 w-3.5" /> Approve</>
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="text-destructive focus:text-destructive cursor-pointer"
          onClick={() => {
            if (confirm("Delete this document?")) deleteDocuments([doc.id]);
          }}
        >
          <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
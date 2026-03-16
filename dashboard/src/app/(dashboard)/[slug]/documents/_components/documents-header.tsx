// src/app/(dashboard)/[slug]/documents/_components/documents-header.tsx
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DocumentsHeaderProps {
  total: number;
  isFiltered: boolean;
}

export function DocumentsHeader({ total, isFiltered }: DocumentsHeaderProps) {
  const { slug } = useParams<{ slug: string }>();

  return (
    <div className="flex items-center justify-between shrink-0 pb-4 border-b border-border">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Documents</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {isFiltered
            ? `Showing ${total} filtered document${total !== 1 ? "s" : ""}`
            : `${total} document${total !== 1 ? "s" : ""} in this workspace`}
        </p>
      </div>
      <Button asChild size="sm" className="gap-1.5 cursor-pointer">
        <Link href={`/${slug}/documents/add`}>
          <Plus className="h-3.5 w-3.5" />
          Add Document
        </Link>
      </Button>
    </div>
  );
}
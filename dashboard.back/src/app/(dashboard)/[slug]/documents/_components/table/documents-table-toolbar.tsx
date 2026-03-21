// src/app/(dashboard)/[slug]/documents/_components/table/documents-table-toolbar.tsx
"use client";

import { X, FilePlus, FileEdit } from "lucide-react";
import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FacetedFilter } from "../faceted-filter"; // Using the custom one that talks to URL
import { useDocumentQueryParams } from "../../_hooks/use-document-query-params";

interface DocumentsTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DocumentsTableToolbar<TData>({ table }: DocumentsTableToolbarProps<TData>) {
  const { q, langs, isApproved, actions, jobIds, documentIds, setParams, clearFilters } = useDocumentQueryParams();

  const hasFilters = q || langs.length > 0 || isApproved !== undefined || actions.length > 0 || jobIds.length > 0 || documentIds.length > 0;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <Input
            placeholder="Search documents..."
            value={q}
            onChange={(event) => setParams({ q: event.target.value })}
            className="h-8 w-[150px] lg:w-[250px] text-sm"
          />
          
          <FacetedFilter
            title="Languages"
            options={[
              { label: "English", value: "EN" },
              { label: "French", value: "FR" },
              { label: "Arabic", value: "AR" },
            ]}
            selectedValues={langs}
            onSelect={(vals) => setParams({ langs: vals })}
          />

          <FacetedFilter
            title="Status"
            options={[
              { label: "Approved", value: "true" },
              { label: "Pending", value: "false" },
            ]}
            selectedValues={isApproved !== undefined ? [String(isApproved)] : []}
            onSelect={(vals) => {
              const val = vals[0];
              setParams({ is_approved: val === undefined ? null : val === "true" });
            }}
          />

          {hasFilters && (
            <Button
              variant="ghost"
              onClick={clearFilters}
              className="h-8 px-2 lg:px-3 text-xs text-muted-foreground hover:text-foreground"
            >
              Reset
              <X className="ml-2 h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Badges for Job and Doc ID filters */}
      {(jobIds.length > 0 || documentIds.length > 0) && (
        <div className="flex flex-wrap gap-2">
          {jobIds.map(id => (
            <Badge key={id} variant="secondary" className="gap-1 font-mono font-normal py-0 h-5">
              Job: {id.split('-')[0]}
              <X className="h-3 w-3 cursor-pointer hover:text-destructive" onClick={() => setParams({ job_ids: jobIds.filter(i => i !== id) })} />
            </Badge>
          ))}
          {documentIds.map(id => (
            <Badge key={id} variant="secondary" className="gap-1 font-mono font-normal py-0 h-5">
              Doc: {id.split('-')[0]}
              <X className="h-3 w-3 cursor-pointer hover:text-destructive" onClick={() => setParams({ ids: documentIds.filter(i => i !== id) })} />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
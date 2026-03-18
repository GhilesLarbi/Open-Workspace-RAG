// src/app/(dashboard)/[slug]/documents/_components/documents-filter-toolbar.tsx
"use client";

import { X, FilePlus, FileEdit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FacetedFilter } from "./faceted-filter";
import { useDocumentQueryParams } from "../_hooks/use-document-query-params";

const LANG_OPTIONS = [
  { label: "English", value: "EN" },
  { label: "French", value: "FR" },
  { label: "Arabic", value: "AR" },
];

const ACTION_OPTIONS = [
  { label: "Created", value: "CREATED", icon: FilePlus },
  { label: "Updated", value: "UPDATED", icon: FileEdit },
];

const STATUS_OPTIONS = [
  { label: "Approved", value: "true" },
  { label: "Pending", value: "false" },
];

export function DocumentsFilterToolbar() {
  const { langs, isApproved, actions, jobIds, documentIds, setParams, clearFilters } = useDocumentQueryParams();

  const hasFilters = langs.length > 0 || isApproved !== undefined || actions.length > 0 || jobIds.length > 0 || documentIds.length > 0;

  return (
    <div className="flex flex-col gap-3 mb-4">
      <div className="flex flex-wrap items-center gap-2">
        <FacetedFilter
          title="Languages"
          options={LANG_OPTIONS}
          selectedValues={langs}
          onSelect={(vals) => setParams({ langs: vals })}
        />

        <FacetedFilter
          title="Status"
          options={STATUS_OPTIONS}
          selectedValues={isApproved !== undefined ? [String(isApproved)] : []}
          onSelect={(vals) => {
            const val = vals[0]; // Status is usually better as single but can be toggled
            setParams({ is_approved: val === undefined ? null : val === "true" });
          }}
        />

        <FacetedFilter
          title="Actions"
          options={ACTION_OPTIONS}
          selectedValues={actions}
          onSelect={(vals) => setParams({ actions: vals })}
        />

        {hasFilters && (
          <Button variant="ghost" onClick={clearFilters} className="h-8 px-2 lg:px-3 text-xs">
            Reset
            <X className="ml-2 h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Badges for Job and Doc ID filters (The "Redirect" filters) */}
      {(jobIds.length > 0 || documentIds.length > 0) && (
        <div className="flex flex-wrap gap-2">
          {jobIds.map(id => (
            <Badge key={id} variant="secondary" className="gap-1 font-mono font-normal">
              Job: {id.split('-')[0]}
              <X className="h-3 w-3 cursor-pointer" onClick={() => setParams({ job_ids: jobIds.filter(i => i !== id) })} />
            </Badge>
          ))}
          {documentIds.map(id => (
            <Badge key={id} variant="secondary" className="gap-1 font-mono font-normal">
              Doc: {id.split('-')[0]}
              <X className="h-3 w-3 cursor-pointer" onClick={() => setParams({ ids: documentIds.filter(i => i !== id) })} />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
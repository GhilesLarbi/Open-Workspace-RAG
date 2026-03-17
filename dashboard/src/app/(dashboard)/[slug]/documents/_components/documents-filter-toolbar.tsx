// src/app/(dashboard)/[slug]/documents/_components/documents-filter-toolbar.tsx
"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useDocumentQueryParams } from "../_hooks/use-document-query-params";

export function DocumentsFilterToolbar() {
  const { lang, isApproved, actions, jobIds, documentIds, setParams, clearFilters } = useDocumentQueryParams();

  const hasFilters = lang || isApproved !== undefined || actions?.length || jobIds?.length || documentIds?.length;

  return (
    <div className="flex flex-col gap-3 mb-4">
      <div className="flex flex-wrap items-center gap-2">
        {/* Language */}
        <Select 
          value={lang || "all"} 
          onValueChange={(v) => setParams({ lang: v === "all" ? null : v })}
        >
          <SelectTrigger className="h-8 w-fit min-w-[110px] text-xs">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any Language</SelectItem>
            <SelectItem value="EN">English</SelectItem>
            <SelectItem value="FR">French</SelectItem>
            <SelectItem value="AR">Arabic</SelectItem>
          </SelectContent>
        </Select>

        {/* Status */}
        <Select 
          value={isApproved === true ? "true" : isApproved === false ? "false" : "all"} 
          onValueChange={(v) => setParams({ is_approved: v === "all" ? null : v === "true" })}
        >
          <SelectTrigger className="h-8 w-fit min-w-[110px] text-xs">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="true">Approved</SelectItem>
            <SelectItem value="false">Pending</SelectItem>
          </SelectContent>
        </Select>

        {/* Action */}
        <Select 
          value={actions?.[0] || "all"} 
          onValueChange={(v) => setParams({ actions: v === "all" ? null : [v] })}
        >
          <SelectTrigger className="h-8 w-fit min-w-[110px] text-xs">
            <SelectValue placeholder="Action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any Action</SelectItem>
            <SelectItem value="CREATED">Created</SelectItem>
            <SelectItem value="UPDATED">Updated</SelectItem>
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button 
            variant="ghost" 
            onClick={clearFilters}
            className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            Clear all
          </Button>
        )}
      </div>

      {/* Active "Hard" Filters (Job IDs / Doc IDs) */}
      {(jobIds?.length || documentIds?.length) && (
        <div className="flex flex-wrap gap-2">
          {jobIds?.map(id => (
            <Badge key={id} variant="secondary" className="gap-1 px-2 py-1 h-6 text-[10px] font-mono font-normal">
              Job: {id.split('-')[0]}
              <X 
                className="h-3 w-3 cursor-pointer hover:text-destructive" 
                onClick={() => setParams({ job_ids: jobIds.filter(i => i !== id) })}
              />
            </Badge>
          ))}
          {documentIds?.map(id => (
            <Badge key={id} variant="secondary" className="gap-1 px-2 py-1 h-6 text-[10px] font-mono font-normal">
              Doc: {id.split('-')[0]}
              <X 
                className="h-3 w-3 cursor-pointer hover:text-destructive" 
                onClick={() => setParams({ ids: documentIds.filter(i => i !== id) })}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
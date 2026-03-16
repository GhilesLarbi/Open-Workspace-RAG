// src/app/(dashboard)/[slug]/jobs/[jobId]/_components/result/failed-pages-list.tsx
"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, ExternalLink, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { FailedPage } from "../../_types";

interface FailedPagesListProps {
  pages: FailedPage[];
}

const STATUS_LABELS: Record<string, string> = {
  crawler_error: "Crawler Error",
  filter_excluded: "Filtered",
  timeout: "Timeout",
};

function getErrorSummary(error: string): string {
  const lines = error.split("\n").map((l) => l.trim()).filter(Boolean);
  const errorLine = lines.find((l) => l.startsWith("Error:"));
  if (errorLine) return errorLine.replace("Error:", "").trim();
  return lines[0] ?? error;
}

function FailedPageRow({ page }: { page: FailedPage }) {
  const [expanded, setExpanded] = useState(false);

  const path = (() => {
    try { const u = new URL(page.url); return u.hostname + u.pathname; } catch { return page.url; }
  })();

  return (
    <div className="border-b border-border last:border-0">
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-start gap-3 px-4 py-3.5 hover:bg-muted/40 transition-colors text-left group cursor-pointer"
      >
        <div className="mt-0.5 shrink-0 text-muted-foreground group-hover:text-foreground transition-colors">
          {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </div>

        <div className="flex-1 min-w-0 space-y-0.5">
          <p className="text-sm font-medium text-foreground truncate font-mono">{path}</p>
          {!expanded && (
            <p className="text-xs text-muted-foreground line-clamp-1">
              {getErrorSummary(page.error)}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-2">
          <Badge variant="secondary" className="text-xs">
            {STATUS_LABELS[page.status] ?? page.status}
          </Badge>
          <a
            href={page.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 pt-1">
          <div className="rounded-lg bg-muted/50 border border-border overflow-hidden">
            <div className="flex items-center gap-1.5 px-3 py-2 border-b border-border bg-muted/60">
              <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
              <span className="text-xs font-medium text-muted-foreground">Error details</span>
            </div>
            <pre className="text-xs leading-relaxed p-3 overflow-auto max-h-48 whitespace-pre-wrap font-mono text-foreground">
              {page.error}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

export function FailedPagesList({ pages }: FailedPagesListProps) {
  if (pages.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-sm text-muted-foreground rounded-xl border border-border">
        No pages failed.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {pages.map((page, i) => (
        <FailedPageRow key={i} page={page} />
      ))}
    </div>
  );
}
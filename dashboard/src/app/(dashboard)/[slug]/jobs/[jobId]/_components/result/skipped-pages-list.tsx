"use client";

import { ExternalLink } from "lucide-react";
import { JobPageResult } from "../../../_types";

interface IgnoredPagesListProps {
  pages: JobPageResult[];
}

function IgnoredPageRow({ page }: { page: JobPageResult }) {
  const path = (() => {
    try { const u = new URL(page.url); return u.hostname + u.pathname; } catch { return page.url; }
  })();

  return (
    <div className="flex items-start gap-3 px-4 py-3.5 border-b border-border last:border-0">
      <div className="flex-1 min-w-0 space-y-0.5">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-foreground truncate font-mono">{path}</p>
        </div>
        {page.title && (
          <p className="text-xs text-muted-foreground truncate">{page.title}</p>
        )}
        <p className="text-xs text-muted-foreground italic">{page.reason}</p>
      </div>

      <div className="shrink-0 mt-0.5">
        <a
          href={page.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}

export function IgnoredPagesList({ pages }: IgnoredPagesListProps) {
  if (pages.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-sm text-muted-foreground rounded-xl border border-border">
        No pages were ignored.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {pages.map((page, i) => (
        <IgnoredPageRow key={i} page={page} />
      ))}
    </div>
  );
}
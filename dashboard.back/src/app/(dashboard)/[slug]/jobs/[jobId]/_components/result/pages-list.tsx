// src/app/(dashboard)/[slug]/jobs/[jobId]/_components/result/pages-list.tsx
"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronDown, ChevronRight, ExternalLink, FileText, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/shared/copy-button";
import { CrawledPage } from "../../_types";

function PageRow({ page }: { page: CrawledPage }) {
  const [expanded, setExpanded] = useState(false);
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();

  const hostname = (() => {
    try { return new URL(page.url).hostname; } catch { return page.url; }
  })();

  const path = (() => {
    try { const u = new URL(page.url); return u.pathname + u.search; } catch { return page.url; }
  })();

  return (
    <div className="border-b border-border last:border-0">
      {/* Collapsed row */}
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-start gap-3 px-4 py-3.5 hover:bg-muted/40 transition-colors text-left group cursor-pointer"
      >
        <div className="mt-0.5 shrink-0 text-muted-foreground group-hover:text-foreground transition-colors">
          {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </div>

        <div className="flex-1 min-w-0 space-y-0.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-muted-foreground font-mono">{hostname}</span>
            <span className="text-sm font-medium text-foreground truncate">{path}</span>
          </div>
          {page.title && page.title !== "Untitled" && (
            <p className="text-xs text-muted-foreground truncate">{page.title}</p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-2">
          {page.lang && (
            <Badge variant="secondary" className="uppercase text-xs font-mono">
              {page.lang}
            </Badge>
          )}
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

      {/* Expanded panel */}
      {expanded && (
        <div className="px-4 pb-4 pt-1">
          <div className="rounded-lg bg-muted/50 border border-border overflow-hidden">
            <div className="flex items-center gap-1.5 px-3 py-2 border-b border-border bg-muted/60">
              <FileText className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground font-medium">Document details</span>
            </div>
            <div className="divide-y divide-border">
              <div className="flex items-center justify-between px-3 py-2.5">
                <span className="text-xs text-muted-foreground">Document ID</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-mono text-foreground">{page.doc_id.split("-")[0]}</span>
                  <CopyButton value={page.doc_id} tooltipText="Copy full document ID" />
                  <button
                    type="button"
                    onClick={() => router.push(`/${slug}/documents?ids=${page.doc_id}`)}
                    className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    title="View document"
                  >
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between px-3 py-2.5">
                <span className="text-xs text-muted-foreground">Title</span>
                <span className="text-xs text-foreground text-right max-w-[260px] truncate">{page.title || "—"}</span>
              </div>
              <div className="flex items-center justify-between px-3 py-2.5">
                <span className="text-xs text-muted-foreground">Language</span>
                <Badge variant="secondary" className="uppercase text-xs font-mono">
                  {page.lang}
                </Badge>
              </div>
              <div className="flex items-center justify-between px-3 py-2.5">
                <span className="text-xs text-muted-foreground">URL</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-muted-foreground truncate max-w-[220px]">{page.url}</span>
                  <CopyButton value={page.url} tooltipText="Copy URL" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function PagesList({ pages }: { pages: CrawledPage[] }) {
  if (pages.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-sm text-muted-foreground rounded-xl border border-border">
        No pages were successfully crawled.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {pages.map((page, i) => (
        <PageRow key={i} page={page} />
      ))}
    </div>
  );
}
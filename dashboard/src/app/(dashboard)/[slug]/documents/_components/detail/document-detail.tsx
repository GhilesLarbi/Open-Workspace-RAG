// src/app/(dashboard)/[slug]/documents/_components/detail/document-detail.tsx
"use client";

import { ExternalLink, CheckCircle2, Circle, Calendar, Hash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CopyButton } from "@/components/shared/copy-button";
import { ChunkCard } from "./chunk-card";
import { Document } from "../../_types";

interface DocumentDetailProps {
  document: Document;
}

function MetaRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="flex items-center gap-1.5">{children}</div>
    </div>
  );
}

export function DocumentDetail({ document }: DocumentDetailProps) {
  const hostname = (() => {
    try { return new URL(document.url).hostname; } catch { return document.url; }
  })();

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border shrink-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h2 className="font-semibold text-base leading-tight truncate">
              {document.title && document.title !== "Untitled"
                ? document.title
                : <span className="text-muted-foreground italic font-normal">Untitled</span>}
            </h2>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-xs text-muted-foreground font-mono truncate">{hostname}</span>
              <a
                href={document.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
              >
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Badge variant="secondary" className="font-mono uppercase text-xs">
              {document.lang}
            </Badge>
            {document.is_approved ? (
              <Badge variant="outline" className="gap-1 text-xs text-emerald-600 border-emerald-200 bg-emerald-50 dark:bg-emerald-950/30 dark:border-emerald-900 dark:text-emerald-400">
                <CheckCircle2 className="h-3 w-3" />
                Approved
              </Badge>
            ) : (
              <Badge variant="outline" className="gap-1 text-xs text-muted-foreground">
                <Circle className="h-3 w-3" />
                Pending
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto">
        {/* Meta */}
        <div className="px-5 py-1 border-b border-border">
          <MetaRow label="Document ID">
            <span className="text-xs font-mono">{document.id.split("-")[0]}</span>
            <CopyButton value={document.id} tooltipText="Copy ID" />
          </MetaRow>
          <MetaRow label="Created">
            <span className="text-xs text-foreground">
              {new Date(document.created_at).toLocaleDateString("en-US", {
                month: "short", day: "numeric", year: "numeric",
              })}
            </span>
          </MetaRow>
          <MetaRow label="Updated">
            <span className="text-xs text-foreground">
              {new Date(document.updated_at).toLocaleDateString("en-US", {
                month: "short", day: "numeric", year: "numeric",
              })}
            </span>
          </MetaRow>
          <MetaRow label="Chunks">
            <span className="text-xs font-mono font-medium">{document.chunks.length}</span>
          </MetaRow>
          {document.tags.length > 0 && (
            <MetaRow label="Tags">
              <div className="flex flex-wrap gap-1 justify-end">
                {document.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs px-1.5 py-0 h-4 font-normal">
                    {tag}
                  </Badge>
                ))}
              </div>
            </MetaRow>
          )}
        </div>

        {/* Chunks */}
        <div className="px-5 py-4 space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
            Chunks ({document.chunks.length})
          </p>
          {document.chunks.length === 0 ? (
            <p className="text-sm text-muted-foreground italic py-4 text-center">
              No chunks available.
            </p>
          ) : (
            document.chunks
              .sort((a, b) => a.chunk_index - b.chunk_index)
              .map((chunk) => (
                <ChunkCard key={chunk.id} chunk={chunk} />
              ))
          )}
        </div>
      </div>
    </div>
  );
}
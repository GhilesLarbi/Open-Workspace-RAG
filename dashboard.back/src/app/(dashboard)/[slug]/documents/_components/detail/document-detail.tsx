// src/app/(dashboard)/[slug]/documents/_components/detail/document-detail.tsx
"use client";

import { ExternalLink, CheckCircle2, Circle, Clock, Hash, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/shared/copy-button";
import { ChunkCard } from "./chunk-card";
import { DocumentWithChunks } from "../../_types";

interface DocumentDetailProps {
  document: DocumentWithChunks;
}

function MetaRow({ label, children, icon: Icon }: { label: string; children: React.ReactNode; icon?: any }) {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-border last:border-0">
      <div className="flex items-center gap-2 text-muted-foreground">
        {Icon && <Icon className="h-3.5 w-3.5" />}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );
}

export function DocumentDetail({ document }: DocumentDetailProps) {
  const hostname = (() => {
    try { return new URL(document.url).hostname; } catch { return document.url; }
  })();

  const formattedDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* 1. Header Section */}
      <div className="px-6 py-6 border-b border-border bg-muted/20">
        <div className="flex items-start justify-between gap-6">
          <div className="min-w-0 flex-1 space-y-1.5">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              {document.title && document.title !== "Untitled" ? (
                document.title
              ) : (
                <span className="text-muted-foreground italic font-medium">Untitled Document</span>
              )}
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground font-mono bg-background px-2 py-0.5 rounded border border-border">
                {hostname}
              </span>
              <a
                href={document.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors font-medium underline underline-offset-4"
              >
                View Source <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Badge variant="secondary" className="font-mono uppercase text-xs px-2 py-0.5">
              {document.lang}
            </Badge>
            {document.is_approved ? (
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900 gap-1 px-2.5 py-0.5">
                <CheckCircle2 className="h-3.5 w-3.5" /> Approved
              </Badge>
            ) : (
              <Badge variant="outline" className="text-muted-foreground gap-1 px-2.5 py-0.5">
                <Circle className="h-3.5 w-3.5" /> Pending Approval
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* 2. Meta Information Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 px-8 py-4 bg-muted/5 border-b border-border">
        <div className="flex flex-col">
          <MetaRow label="Document ID" icon={Hash}>
            <span className="text-sm font-mono text-foreground">{document.id}</span>
            <CopyButton value={document.id} tooltipText="Copy full ID" />
          </MetaRow>
          <MetaRow label="Created At" icon={Clock}>
            <span className="text-sm text-foreground">{formattedDate(document.created_at)}</span>
          </MetaRow>
        </div>
        <div className="flex flex-col">
          <MetaRow label="Updated At" icon={Clock}>
            <span className="text-sm text-foreground">{formattedDate(document.updated_at)}</span>
          </MetaRow>
          <MetaRow label="Tags" icon={Tag}>
            <div className="flex flex-wrap gap-1 justify-end max-w-[200px]">
              {document.tags.length > 0 ? (
                document.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-[10px] px-1.5 py-0 h-4 font-normal">
                    {tag}
                  </Badge>
                ))
              ) : (
                <span className="text-xs text-muted-foreground italic">No tags</span>
              )}
            </div>
          </MetaRow>
        </div>
      </div>

      {/* 3. Content Chunks Section */}
      <div className="px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              Extracted Chunks
              <Badge variant="secondary" className="rounded-full h-5 px-2 text-[10px]">
                {document.chunks.length}
              </Badge>
            </h3>
            <p className="text-sm text-muted-foreground">
              Segmented text extracted from the document for processing.
            </p>
          </div>
        </div>
        
        <div className="space-y-4">
          {document.chunks.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-border rounded-xl">
              <p className="text-sm text-muted-foreground italic">No chunks available for this document.</p>
            </div>
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
// src/app/(dashboard)/[slug]/documents/_components/detail/chunk-card.tsx
"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { CopyButton } from "@/components/shared/copy-button";
import { Chunk } from "../../_types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function ChunkCard({ chunk }: { chunk: Chunk }) {
  const [expanded, setExpanded] = useState(chunk.chunk_index === 0);
  
  const cleanPreview = chunk.content.replace(/[*#_`]/g, "").slice(0, 160).trim() + "...";

  return (
    <div className={cn(
      "rounded-lg border border-border transition-all",
      expanded ? "bg-card shadow-sm" : "bg-muted/20 hover:bg-muted/30"
    )}>
      <div
        role="button"
        tabIndex={0}
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-4 px-4 py-3 cursor-pointer select-none"
      >
        <div className="text-muted-foreground">
          {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </div>
        
        <span className="text-xs font-mono font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
          #{String(chunk.chunk_index + 1).padStart(2, "0")}
        </span>

        {!expanded && (
          <p className="text-sm text-muted-foreground truncate flex-1">
            {cleanPreview}
          </p>
        )}

        <div className="ml-auto" onClick={(e) => e.stopPropagation()}>
          <CopyButton value={chunk.content} tooltipText="Copy content" />
        </div>
      </div>

      {expanded && (
        <div className="px-6 pb-6 pt-2 border-t border-border/50">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ node, ...props }) => <p className="mb-4 leading-relaxed last:mb-0" {...props} />,
                ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-4 space-y-1" {...props} />,
                ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-4 space-y-1" {...props} />,
              }}
            >
              {chunk.content}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
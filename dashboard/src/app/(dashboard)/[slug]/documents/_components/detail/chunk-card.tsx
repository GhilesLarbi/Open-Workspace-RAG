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
  
  // Strip basic markdown characters for a cleaner preview
  const cleanPreview = chunk.content.replace(/[*#_`]/g, "");
  const preview = cleanPreview.slice(0, 140).trim() + (cleanPreview.length > 140 ? "..." : "");

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      {/* Changed from <button> to <div> to prevent invalid nested buttons */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => setExpanded((e) => !e)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setExpanded((e) => !e);
          }
        }}
        className="w-full flex items-start gap-3 px-4 py-3 hover:bg-muted/30 transition-colors text-left cursor-pointer focus-visible:outline-none focus-visible:bg-muted/30"
      >
        <div className="mt-0.5 shrink-0 text-muted-foreground">
          {expanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-muted-foreground">
              #{String(chunk.chunk_index + 1).padStart(2, "0")}
            </span>
            {!expanded && (
              <p className="text-xs text-muted-foreground truncate" dir="auto">
                {preview}
              </p>
            )}
          </div>
        </div>
        
        {/* Stop event propagation for both clicks and keyboard presses on the inner button */}
        <div 
          onClick={(e) => e.stopPropagation()} 
          onKeyDown={(e) => e.stopPropagation()} 
          className="shrink-0"
        >
          <CopyButton value={chunk.content} tooltipText="Copy chunk" />
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 pt-3 border-t border-border bg-muted/20">
          <div className="text-sm leading-relaxed text-foreground">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              // className="space-y-3 break-words"
              components={{
                p: ({ node, ...props }) => <p dir="auto" className="mb-2 last:mb-0" {...props} />,
                h1: ({ node, ...props }) => <h1 dir="auto" className="text-lg font-bold mt-4 mb-2" {...props} />,
                h2: ({ node, ...props }) => <h2 dir="auto" className="text-base font-bold mt-4 mb-2" {...props} />,
                h3: ({ node, ...props }) => <h3 dir="auto" className="text-sm font-bold mt-3 mb-2" {...props} />,
                h4: ({ node, ...props }) => <h4 dir="auto" className="text-sm font-semibold mt-3 mb-2" {...props} />,
                h5: ({ node, ...props }) => <h5 dir="auto" className="text-sm font-medium mt-3 mb-1" {...props} />,
                h6: ({ node, ...props }) => <h6 dir="auto" className="text-sm font-medium mt-3 mb-1" {...props} />,
                ul: ({ node, ...props }) => <ul dir="auto" className="list-disc pl-5 rtl:pl-0 rtl:pr-5 mb-2 space-y-1" {...props} />,
                ol: ({ node, ...props }) => <ol dir="auto" className="list-decimal pl-5 rtl:pl-0 rtl:pr-5 mb-2 space-y-1" {...props} />,
                li: ({ node, ...props }) => <li dir="auto" {...props} />,
                strong: ({ node, ...props }) => <strong className="font-semibold text-foreground" {...props} />,
                a: ({ node, ...props }) => (
                  <a className="text-primary hover:underline font-medium" target="_blank" rel="noreferrer" {...props} />
                ),
                blockquote: ({ node, ...props }) => (
                  <blockquote className="border-l-4 border-muted-foreground/30 pl-4 rtl:pl-0 rtl:border-l-0 rtl:border-r-4 rtl:pr-4 italic" {...props} />
                ),
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
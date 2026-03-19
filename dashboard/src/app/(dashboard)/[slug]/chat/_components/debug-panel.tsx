// dashboard/src/app/(dashboard)/[slug]/chat/_components/debug-panel.tsx
"use client";

import { useState, useMemo } from "react";
import { DocumentDebug } from "../_types";
import { ChunkCard } from "./chunk-card";
import { Accordion } from "@/components/ui/accordion";
import { FileStack, Loader2 } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import Link from "next/link";
import { useParams } from "next/navigation";

interface DebugPanelProps {
  debugInfo: DocumentDebug[] | null;
  isLoading: boolean;
}

interface GroupedChunks {
  [documentUrl: string]: {
    id: string;
    title: string;
    url: string;
    chunks: any[];
    maxScore: number;
  };
}

export function DebugPanel({ debugInfo, isLoading }: DebugPanelProps) {
  const [isGrouped, setIsGrouped] = useState(false);
  const params = useParams();
  const slug = params.slug as string;

  const { flattenedChunks, groupedChunks } = useMemo(() => {
    if (!debugInfo) return { flattenedChunks: [], groupedChunks: {} };
    
    const chunks = debugInfo.flatMap((doc) =>
      doc.chunks.map((chunk) => ({
        ...chunk,
        parentTitle: doc.title || doc.url,
        parentUrl: doc.url,
        parentId: doc.id,
      }))
    );

    // Always sort by db_score
    const sorted = chunks.sort((a, b) => {
      const scoreA = a.db_score ?? -1;
      const scoreB = b.db_score ?? -1;
      return scoreB - scoreA;
    });

    const grouped: GroupedChunks = {};
    sorted.forEach((chunk) => {
      if (!grouped[chunk.parentUrl]) {
        grouped[chunk.parentUrl] = {
          id: chunk.parentId,
          title: chunk.parentTitle,
          url: chunk.parentUrl,
          chunks: [],
          maxScore: 0,
        };
      }
      grouped[chunk.parentUrl].chunks.push(chunk);
      const chunkScore = chunk.db_score ?? -1;
      grouped[chunk.parentUrl].maxScore = Math.max(
        grouped[chunk.parentUrl].maxScore,
        chunkScore
      );
    });

    return { flattenedChunks: sorted, groupedChunks: grouped };
  }, [debugInfo]);

  const sortedGroups = useMemo(() => {
    return Object.values(groupedChunks).sort((a, b) => b.maxScore - a.maxScore);
  }, [groupedChunks]);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="p-4">
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {flattenedChunks.length > 0 && (
            <Toggle
              pressed={isGrouped}
              onPressedChange={setIsGrouped}
              className="h-9 px-3 text-xs rounded-xl data-[state=on]:bg-zinc-200 data-[state=on]:dark:bg-zinc-800 cursor-pointer"
            >
              Group Docs
            </Toggle>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pt-0">
        {isLoading && flattenedChunks.length === 0 && (
          <div className="flex flex-col items-center justify-center h-48 text-center text-muted-foreground">
            <Loader2 className="size-6 animate-spin mb-3 opacity-20" />
            <p className="text-sm font-medium">Analyzing documents...</p>
          </div>
        )}

        {!isLoading && flattenedChunks.length === 0 && (
          <div className="flex flex-col items-center justify-center h-48 text-center text-muted-foreground">
            <FileStack className="size-8 mb-3 opacity-10" />
            <p className="text-sm">No context found for this query.</p>
          </div>
        )}
        
        {!isGrouped && flattenedChunks.length > 0 && (
          <Accordion type="single" collapsible className="space-y-3">
            {flattenedChunks.map((chunk, index) => (
              <ChunkCard 
                key={`${chunk.id}-${index}`} 
                chunk={chunk} 
                index={index} 
              />
            ))}
          </Accordion>
        )}

        {isGrouped && sortedGroups.length > 0 && (
          <div className="space-y-4">
            {sortedGroups.map((group) => (
              <div key={group.url}>
                <div className="flex items-center justify-between gap-2 px-3 py-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                      {group.title}
                    </p>
                    <p className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate">
                      {group.url}
                    </p>
                  </div>
                  <Link
                    href={`/${slug}/documents/${group.id}`}
                    className="shrink-0 px-2 py-1.5 text-[10px] font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 bg-white dark:bg-zinc-900 rounded-lg ring-1 ring-zinc-200 dark:ring-zinc-800 transition-colors hover:ring-zinc-300 dark:hover:ring-zinc-700"
                  >
                    View
                  </Link>
                </div>
                <Accordion type="single" collapsible className="space-y-3">
                  {group.chunks.map((chunk, index) => (
                    <ChunkCard 
                      key={`${chunk.id}-${index}`} 
                      chunk={chunk} 
                      index={index} 
                    />
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
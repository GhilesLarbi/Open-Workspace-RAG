"use client";

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link2 } from "lucide-react";

interface ChunkCardProps {
  chunk: any;
  index: number;
  isGrouped?: boolean;
}

/**
 * Converts Cosine Distance to a Similarity Percentage.
 * Distance 0.0 => 100%
 * Distance 1.0 => 0%
 */
const formatAsPercentage = (distance: number | null | undefined): string => {
  if (distance === null || distance === undefined) return "0%";
  const similarity = Math.max(0, 1 - distance);
  return (similarity * 100).toFixed(1) + "%";
};

/**
 * Keeps the raw distance score for the detailed view
 */
const formatRawScore = (score: number | null | undefined): string => {
  if (score === null || score === undefined) return "0.0000";
  return score.toFixed(4);
};

export function ChunkCard({ chunk, index, isGrouped = false }: ChunkCardProps) {
  return (
    <AccordionItem 
      value={chunk.id + index} 
      className="border-none bg-white dark:bg-zinc-900 rounded-lg overflow-hidden px-0 mb-2 shadow-sm"
    >
      <AccordionTrigger className="hover:no-underline py-3 px-3 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors outline-none group cursor-pointer">
        <div className="grid grid-cols-[24px_1fr_auto] items-center gap-3 w-full min-w-0 text-left">
          
          {/* Rank Badge */}
          <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 text-[10px] font-bold text-zinc-500">
            {index + 1}
          </div>

          {/* Text Container */}
          <div className="flex flex-col min-w-0 overflow-hidden gap-1">
            {!isGrouped && (
              <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 truncate">
                {chunk.parentTitle}
              </span>
            )}
            <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate italic">
              {chunk.content}
            </p>
          </div>

          <div className="shrink-0">
             <div className="flex items-center text-[10px] font-bold px-2 py-1 rounded-md whitespace-nowrap bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                {formatAsPercentage(chunk.db_score)}
             </div>
          </div>
        </div>
      </AccordionTrigger>
      
      <AccordionContent className="px-3 py-3 bg-white dark:bg-zinc-900 border-none">
        <div className="space-y-3">
            <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                {chunk.content}
            </p>

            {/* Bottom Info */}
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between pt-2 border-t border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-6 pt-3">
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[9px] uppercase text-zinc-400 font-bold tracking-wider">Match Match</span>
                        <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">{formatAsPercentage(chunk.db_score)}</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[9px] uppercase text-zinc-400 font-bold tracking-wider">Vector Distance</span>
                        <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">{formatRawScore(chunk.db_score)}</span>
                    </div>
                </div>

                <a 
                    href={chunk.parentUrl} 
                    target="_blank" 
                    className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                >
                    <Link2 className="size-3.5" />
                    View Source
                </a>
            </div>
            
            <div className="text-[9px] text-zinc-400 dark:text-zinc-600 break-all pt-2">
                ID: {chunk.id}
            </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
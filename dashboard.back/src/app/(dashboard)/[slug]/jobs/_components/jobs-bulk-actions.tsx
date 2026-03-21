"use client";

import { Loader2, Play, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface JobsBulkActionsProps {
  selectedCount: number;
  onRun: () => void;
  onDelete: () => void;
  onClear: () => void;
  isRunning: boolean;
  isDeleting: boolean;
}

export function JobsBulkActions({
  selectedCount,
  onRun,
  onDelete,
  onClear,
  isRunning,
  isDeleting,
}: JobsBulkActionsProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-3 rounded-xl border border-border bg-background shadow-lg shadow-black/5 px-4 py-2.5">
        {/* Count */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium tabular-nums">
            {selectedCount} selected
          </span>
          <button
            type="button"
            onClick={onClear}
            className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        <Separator orientation="vertical" className="h-5" />

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 cursor-pointer"
            onClick={onRun}
            disabled={isRunning || isDeleting}
          >
            {isRunning ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Play className="h-3.5 w-3.5" />
            )}
            {isRunning ? "Running…" : "Run"}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer"
            onClick={onDelete}
            disabled={isDeleting || isRunning}
          >
            {isDeleting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Trash2 className="h-3.5 w-3.5" />
            )}
            {isDeleting ? "Deleting…" : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
}
// src/app/(dashboard)/[slug]/documents/_components/documents-bulk-actions.tsx
"use client";

import { Loader2, Trash2, X, CheckCircle2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DocumentsBulkActionsProps {
  selectedCount: number;
  onApprove: () => void;
  onUnapprove: () => void;
  onDelete: () => void;
  onClear: () => void;
  isApproving: boolean;
  isDeleting: boolean;
}

export function DocumentsBulkActions({
  selectedCount,
  onApprove,
  onUnapprove,
  onDelete,
  onClear,
  isApproving,
  isDeleting,
}: DocumentsBulkActionsProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-4 fade-in-0 duration-200">
      <div className="flex items-center gap-3 rounded-xl border border-border bg-background shadow-lg shadow-black/5 px-4 py-2.5">
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

        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 cursor-pointer text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/50"
            onClick={onApprove}
            disabled={isApproving || isDeleting}
          >
            {isApproving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
            Approve
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 cursor-pointer"
            onClick={onUnapprove}
            disabled={isApproving || isDeleting}
          >
            {isApproving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Circle className="h-3.5 w-3.5" />}
            Unapprove
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                disabled={isDeleting || isApproving}
              >
                {isDeleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete {selectedCount} selected document{selectedCount !== 1 ? 's' : ''}. 
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={onDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer"
                >
                  Yes, delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
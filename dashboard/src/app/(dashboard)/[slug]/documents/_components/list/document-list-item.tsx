"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle2, Circle } from "lucide-react";
import { Document } from "../../_types";

interface DocumentListItemProps {
  document: Document;
  isSelected: boolean;
  onSelect: () => void;
  isChecked: boolean;
  onCheck: (checked: boolean) => void;
}

export function DocumentListItem({ document, isSelected, onSelect, isChecked, onCheck }: DocumentListItemProps) {
  const hostname = (() => {
    try { return new URL(document.url).hostname.replace("www.", ""); } catch { return document.url; }
  })();

  const path = (() => {
    try { const u = new URL(document.url); return u.pathname === "/" ? null : u.pathname; } catch { return null; }
  })();

  return (
    <div
      onClick={onSelect}
      className={cn(
        "w-full flex items-start px-4 py-3.5 border-b border-border transition-colors cursor-pointer",
        "hover:bg-muted/40 last:border-0",
        isSelected && "bg-muted/60 hover:bg-muted/60"
      )}
    >
      <div className="mr-3 pt-0.5 shrink-0" onClick={(e) => e.stopPropagation()}>
        <Checkbox checked={isChecked} onCheckedChange={onCheck} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0 space-y-1">
            <p className={cn(
              "text-sm truncate",
              document.title && document.title !== "Untitled"
                ? "font-medium text-foreground"
                : "text-muted-foreground italic"
            )}>
              {document.title && document.title !== "Untitled" ? document.title : "Untitled"}
            </p>

            <p className="text-xs text-muted-foreground font-mono truncate">
              {hostname}{path}
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
            <Badge variant="secondary" className="text-xs font-mono uppercase px-1.5 py-0 h-4">
              {document.lang}
            </Badge>
            {document.is_approved ? (
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
            ) : (
              <Circle className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0" />
            )}
          </div>
        </div>

        {document.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {document.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs px-1.5 py-0 h-4 font-normal">
                {tag}
              </Badge>
            ))}
            {document.tags.length > 3 && (
              <span className="text-xs text-muted-foreground">+{document.tags.length - 3}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
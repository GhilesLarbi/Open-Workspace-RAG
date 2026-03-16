// src/app/(dashboard)/[slug]/documents/_components/detail/empty-detail.tsx
import { MousePointerClick } from "lucide-react";

export function EmptyDetail() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-8">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
        <MousePointerClick className="h-5 w-5 text-muted-foreground" />
      </div>
      <div>
        <p className="text-sm font-medium">Select a document</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          Pick a document from the list to view its content and chunks.
        </p>
      </div>
    </div>
  );
}
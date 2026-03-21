// src/components/shared/empty-state.tsx
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 bg-zinc-50/50 p-8 text-center animate-in fade-in-50 dark:border-zinc-800 dark:bg-zinc-900/20", className)}>
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 mb-4">
        <Icon className="h-6 w-6 text-zinc-600 dark:text-zinc-400" />
      </div>
      <h3 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">{title}</h3>
      {description && (
        <p className="mt-2 text-sm text-zinc-500 max-w-sm dark:text-zinc-400">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
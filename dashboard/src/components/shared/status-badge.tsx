// src/components/shared/status-badge.tsx
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CheckCircle2, CircleDashed, Loader2, XCircle } from "lucide-react";

export type StatusType = "PENDING" | "STARTED" | "SUCCESS" | "FAILURE";

interface StatusBadgeProps {
  status: StatusType | string;
  className?: string;
}

const statusConfig: Record<string, { label: string; className: string; icon: React.ElementType }> = {
  PENDING: { 
    label: "Pending", 
    className: "bg-amber-100 text-amber-800 hover:bg-amber-100/80 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
    icon: CircleDashed
  },
  STARTED: { 
    label: "Started", 
    className: "bg-blue-100 text-blue-800 hover:bg-blue-100/80 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
    icon: Loader2
  },
  SUCCESS: { 
    label: "Success", 
    className: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100/80 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
    icon: CheckCircle2
  },
  FAILURE: { 
    label: "Failure", 
    className: "bg-red-100 text-red-800 hover:bg-red-100/80 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
    icon: XCircle
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status.toUpperCase()] || {
    label: status,
    className: "bg-zinc-100 text-zinc-800 hover:bg-zinc-100/80 border-zinc-200",
    icon: CircleDashed
  };

  const Icon = config.icon;
  const isSpinning = status.toUpperCase() === "STARTED";

  return (
    <Badge variant="outline" className={cn("flex w-fit items-center gap-1.5 px-2 py-0.5 font-medium", config.className, className)}>
      <Icon className={cn("h-3 w-3", isSpinning && "animate-spin")} />
      {config.label}
    </Badge>
  );
}
// src/app/(dashboard)/[slug]/jobs/[jobId]/_components/tabs/overview-tab.tsx
"use client";

import { cn } from "@/lib/utils";
import { CopyButton } from "@/components/shared/copy-button";
import { StatusBadge } from "@/components/shared/status-badge";
import { Job } from "../../../_types";

interface OverviewTabProps {
  job: Job;
}

interface FieldRowProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

function FieldRow({ label, children, className }: FieldRowProps) {
  return (
    <div className={cn(
      "flex items-start justify-between gap-4 py-2 border-b border-border last:border-0 px-5", 
      className
    )}>
      <p className="text-sm text-muted-foreground w-36 shrink-0">{label}</p>
      <div className="flex-1 text-right text-sm font-medium text-foreground">{children}</div>
    </div>
  );
}

function MonoField({ value }: { value: string }) {
  const short = value.split("-")[0];
  return (
    <div className="flex items-center justify-end gap-2">
      <span className="font-mono text-foreground" title={value}>
        {short}
      </span>
      <CopyButton value={value} tooltipText="Copy full ID" />
    </div>
  );
}

function DateField({ value }: { value: string }) {
  const date = new Date(value);
  return (
    <div className="flex flex-col items-end gap-0.5">
      <span className="text-foreground">
        {date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
      </span>
      <span className="text-xs text-muted-foreground font-normal">
        {date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
      </span>
    </div>
  );
}

export function OverviewTab({ job }: OverviewTabProps) {
  const summary = job.result?.summary;

  return (
    <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
      <div className="px-5 py-2 bg-muted/30">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Job Information
        </p>
      </div>

      <div className="flex flex-col">
        <FieldRow label="Job ID">
          <MonoField value={job.id} />
        </FieldRow>

        <FieldRow label="Status">
          <div className="flex justify-end">
            <StatusBadge status={job.status} />
          </div>
        </FieldRow>

        {summary && (
          <>
            <FieldRow label="Total Pages" className="">
              <span className="tabular-nums">{summary.total}</span>
            </FieldRow>
            
            <FieldRow label="Succeeded" className="bg-green-500/4">
              <span className="tabular-nums">{summary.succeeded}</span>
            </FieldRow>
            
            <FieldRow label="Failed" className={cn("tabular-nums", summary.failed > 0 ? "bg-red-500/4" : "")}>
              <span className="tabular-nums">{summary.failed}</span>
            </FieldRow>
            
            <FieldRow label="Skipped" className="bg-zinc-500/4">
              <span className="tabular-nums">{summary.skipped}</span>
            </FieldRow>
          </>
        )}

        <FieldRow label="Created At">
          <DateField value={job.created_at} />
        </FieldRow>

        <FieldRow label="Updated At">
          <DateField value={job.updated_at} />
        </FieldRow>
      </div>
    </div>
  );
}
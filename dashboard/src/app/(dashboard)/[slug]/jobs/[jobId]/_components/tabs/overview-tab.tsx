// src/app/(dashboard)/[slug]/jobs/[jobId]/_components/tabs/overview-tab.tsx
"use client";

import { CopyButton } from "@/components/shared/copy-button";
import { StatusBadge } from "@/components/shared/status-badge";
import { Job } from "../../../_types";

interface OverviewTabProps {
  job: Job;
}

interface FieldRowProps {
  label: string;
  children: React.ReactNode;
}

function FieldRow({ label, children }: FieldRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 py-3.5 border-b border-border last:border-0">
      <p className="text-sm text-muted-foreground w-36 shrink-0">{label}</p>
      <div className="flex-1 text-right">{children}</div>
    </div>
  );
}

function MonoField({ value }: { value: string }) {
  const short = value.split("-")[0];
  return (
    <div className="flex items-center justify-end gap-2">
      <span className="font-mono text-sm text-foreground" title={value}>
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
      <span className="text-sm font-medium text-foreground">
        {date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </span>
      <span className="text-xs text-muted-foreground">
        {date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })}
      </span>
    </div>
  );
}

export function OverviewTab({ job }: OverviewTabProps) {
  return (
    <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
      <div className="px-5 py-3 bg-muted/30">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Job Details
        </p>
      </div>

      <div className="px-5">
        <FieldRow label="Job ID">
          <MonoField value={job.id} />
        </FieldRow>

        <FieldRow label="Task ID">
          {job.task_id ? (
            <MonoField value={job.task_id} />
          ) : (
            <span className="text-sm text-muted-foreground italic">
              Not assigned
            </span>
          )}
        </FieldRow>

        <FieldRow label="Status">
          <div className="flex justify-end">
            <StatusBadge status={job.status} />
          </div>
        </FieldRow>

        <FieldRow label="Workspace ID">
          <MonoField value={job.workspace_id} />
        </FieldRow>

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
// src/app/(dashboard)/[slug]/jobs/[jobId]/_components/job-detail-header.tsx
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronLeft, Play, Trash2, Loader2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { Job } from "../../_types";
import { JobResult } from "../_types";

interface JobDetailHeaderProps {
  job: Job;
  onRun: () => void;
  onDelete: () => void;
  isRunning: boolean;
  isDeleting: boolean;
  result: JobResult | null;
}

function downloadResult(result: JobResult) {
  const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "job-results.json";
  a.click();
  URL.revokeObjectURL(url);
}

export function JobDetailHeader({
  job,
  onRun,
  onDelete,
  isRunning,
  isDeleting,
  result,
}: JobDetailHeaderProps) {
  const { slug } = useParams<{ slug: string }>();
  const shortId = job.id.split("-")[0];
  const isActive = job.status === "PENDING" || job.status === "STARTED";

  return (
    <div className="flex flex-col gap-2">
      <Button
        variant="ghost"
        size="sm"
        asChild
        className="w-fit -ml-2 text-muted-foreground hover:text-foreground"
      >
        <Link href={`/${slug}/jobs`}>
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Jobs
        </Link>
      </Button>

      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight font-mono">{shortId}</h1>
            <StatusBadge status={job.status} />
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {result && (
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 cursor-pointer"
              onClick={() => downloadResult(result)}
            >
              <Download className="h-3.5 w-3.5" />
              Export JSON
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={onRun}
            disabled={isRunning || isActive}
            className="gap-1.5 cursor-pointer"
          >
            {isRunning ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
            {isRunning ? "Starting…" : "Run"}
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={onDelete}
            disabled={isDeleting}
            className="gap-1.5 cursor-pointer"
          >
            {isDeleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
// src/app/(dashboard)/[slug]/jobs/[jobId]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { JobDetailHeader } from "./_components/job-detail-header";
import { OverviewTab } from "./_components/tabs/overview-tab";
import { ConfigureTab } from "./_components/tabs/configure-tab";
import { ResultsTab } from "./_components/tabs/results-tab";
import { useJob } from "./_hooks/use-job";
import { JobConfig } from "../_types";
import { JobResult } from "./_types";

export default function JobDetailPage() {
  const { slug, jobId } = useParams<{ slug: string; jobId: string }>();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

  const { job, isLoading, isError, updateJob, isUpdating, deleteJob, isDeleting, runJob, isRunning } =
    useJob(jobId);

  const handleRun = async () => { await runJob(); };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this job?")) return;
    await deleteJob();
    router.push(`/${slug}/jobs`);
  };

  const handleUpdate = async (config: JobConfig) => { await updateJob(config); };

  if (isLoading) return <JobDetailSkeleton />;

  if (isError || !job) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-2">
        <p className="text-base font-medium">Job not found</p>
        <p className="text-sm text-muted-foreground">This job may have been deleted or doesn't exist.</p>
      </div>
    );
  }

  const result = job.result as JobResult | null;
  const showExport = activeTab === "results" && !!result;

  return (
    <div className="flex flex-col gap-6 w-full pb-12">
      <JobDetailHeader
        job={job}
        onRun={handleRun}
        onDelete={handleDelete}
        isRunning={isRunning}
        isDeleting={isDeleting}
        result={showExport ? result : null}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          {(["overview", "configure", "results"] as const).map((tab) => (
            <TabsTrigger key={tab} value={tab} className="capitalize cursor-pointer">
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview" className="mt-0">
          <OverviewTab job={job} />
        </TabsContent>
        <TabsContent value="configure" className="mt-0">
          <ConfigureTab job={job} onUpdate={handleUpdate} isUpdating={isUpdating} />
        </TabsContent>
        <TabsContent value="results" className="mt-0">
          <ResultsTab job={job} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function JobDetailSkeleton() {
  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in-50">
      <div className="space-y-3">
        <Skeleton className="h-4 w-24" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-28" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="flex gap-4 border-b border-border pb-3">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-5 w-16" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex justify-between py-3 border-b border-border">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
        ))}
      </div>
    </div>
  );
}
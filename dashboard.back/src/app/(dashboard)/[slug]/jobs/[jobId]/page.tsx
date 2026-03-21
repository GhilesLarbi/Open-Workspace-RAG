"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { OverviewTab } from "./_components/tabs/overview-tab";
import { ConfigureTab } from "./_components/tabs/configure-tab";
import { ErrorsTab } from "./_components/tabs/errors-tab";
import { useJob } from "./_hooks/use-job";
import { JobConfig } from "../_types";
import { ChevronLeft, Play, Trash2, Loader2, BookOpen } from "lucide-react";



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

  const isActive = job.status === "PENDING" || job.status === "STARTED";

  const handleViewDocuments = () => {
    router.push(`/${slug}/documents?job_ids=${job.id}`);
  };


  return (
    <div className="flex flex-col gap-2 w-full">
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        
        <div className="flex items-center justify-between mb-6">
          <TabsList className="mb-0">
            {(["overview", "configure", "errors"] as const).map((tab) => (
              <TabsTrigger key={tab} value={tab} className="capitalize cursor-pointer">
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 cursor-pointer border-primary/20 hover:border-primary/50 hover:bg-primary/5 text-primary"
              onClick={handleViewDocuments}
            >
              <BookOpen className="h-3.5 w-3.5" />
              View Documents
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleRun}
              disabled={isRunning || isActive}
              className="gap-1.5 cursor-pointer"
            >
              {isRunning ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
              Run
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
              className="gap-1.5 cursor-pointer text-muted-foreground hover:text-destructive"
            >
              {isDeleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
            </Button>
          </div>
        </div>

        <TabsContent value="overview" className="mt-0 w-full">
          <OverviewTab job={job} />
        </TabsContent>
        <TabsContent value="configure" className="mt-0 w-full">
          <ConfigureTab job={job} onUpdate={handleUpdate} isUpdating={isUpdating} />
        </TabsContent>
        <TabsContent value="errors" className="mt-0 w-full">
          <ErrorsTab job={job} />
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
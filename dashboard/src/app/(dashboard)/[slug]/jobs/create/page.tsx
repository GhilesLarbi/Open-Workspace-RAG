// src/app/(dashboard)/[slug]/jobs/create/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { JobConfigForm } from "../_components/form/job-config-form";
import { useJobs } from "../_hooks/use-jobs";
import { JobConfigValues } from "../_types/schemas";

export default function CreateJobPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const { createJob, isCreating } = useJobs();

  const handleSubmit = async (data: JobConfigValues) => {
    try {
      const response = await createJob(data);
      router.push(`/${slug}/jobs/${response.job_id}`);
    } catch (error) {
      console.error("Failed to create job:", error);
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full pb-12">
      <div className="flex flex-col gap-2">
        <Button variant="ghost" size="sm" asChild className="w-fit -ml-2 text-muted-foreground hover:text-foreground">
          <Link href={`/${slug}/jobs`}>
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Jobs
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">New Job</h1>
          <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">
            Configure extraction rules, limits, and LLM formatting for your target URL.
          </p>
        </div>
      </div>

      <div className="w-full">
        <JobConfigForm 
          onSubmit={handleSubmit} 
          isSubmitting={isCreating} 
          submitLabel="Create Job"
        />
      </div>
    </div>
  );
}
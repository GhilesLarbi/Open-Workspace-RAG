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
      router.push(`/${slug}/jobs/${response.id}`);
    } catch (error) {
      console.error("Failed to create job:", error);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <Button variant="ghost" size="sm" asChild className="w-fit -ml-2 text-muted-foreground hover:text-foreground">
        <Link href={`/${slug}/jobs`}>
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Jobs
        </Link>
      </Button>

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
// src/app/(dashboard)/[slug]/jobs/_components/jobs-header.tsx
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function JobsHeader() {
  const params = useParams();
  const slug = params.slug as string;

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Jobs</h1>
        <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">
          Manage your scraping and crawling jobs, track their status, and view results.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button asChild className="font-semibold shadow-sm">
          <Link href={`/${slug}/jobs/create`}>
            <Plus className="mr-2 h-4 w-4" />
            Create Job
          </Link>
        </Button>
      </div>
    </div>
  );
}
// src/app/(dashboard)/[slug]/jobs/page.tsx
import { Suspense } from "react";
import { JobsHeader } from "./_components/jobs-header";
import { JobsTable } from "./_components/jobs-table";
import { Skeleton } from "@/components/ui/skeleton";

export default function JobsPage() {
  return (
    <div className="flex flex-col gap-8 w-full">
      <JobsHeader />
      
      <Suspense fallback={<JobsTableSkeleton />}>
        <JobsTable />
      </Suspense>
    </div>
  );
}

function JobsTableSkeleton() {
  return (
    <div className="space-y-4 animate-in fade-in-50">
      {/* Toolbar Skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-[150px] lg:w-[250px]" />
          <Skeleton className="h-9 w-[100px]" />
        </div>
        <Skeleton className="h-9 w-[120px]" />
      </div>

      {/* Table Skeleton */}
      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950 p-4">
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-4 w-4 rounded-sm" />
              <Skeleton className="h-4 w-[150px]" />
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          ))}
        </div>
      </div>
      
      {/* Pagination Skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-8 w-[300px]" />
      </div>
    </div>
  );
}
// src/app/(dashboard)/[slug]/jobs/[jobId]/_components/tabs/results-tab.tsx
"use client";

import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import { PagesList } from "../result/pages-list";
import { FailedPagesList } from "../result/failed-pages-list";
import { IgnoredPagesList } from "../result/ignored-pages-list";
import { JobResult } from "../../_types";
import { Job } from "../../../_types";

interface ResultsTabProps {
  job: Job;
}

function EmptyResult({ status }: { status: string }) {
  const messages: Record<string, { title: string; description: string }> = {
    PENDING: { title: "Job is queued", description: "Results will appear here once the job starts processing." },
    STARTED: { title: "Job is running", description: "Hang tight — results will appear when the job completes." },
    FAILURE: { title: "Job failed with no output", description: "The job encountered an error before producing any results." },
  };
  const msg = messages[status] ?? { title: "No results yet", description: "Run the job to see results here." };
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-2 text-center">
      <p className="text-base font-medium">{msg.title}</p>
      <p className="text-sm text-muted-foreground max-w-sm">{msg.description}</p>
    </div>
  );
}

export function ResultsTab({ job }: ResultsTabProps) {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const result = job.result as JobResult | null;

  if (!result) return <EmptyResult status={job.status} />;

  const pages = result.pages ?? [];
  const failedPages = result.failed_pages ?? [];
  const ignoredPages = result.ignored_pages ?? [];

  const handleViewAllDocs = () => {
    const ids = pages.map((p) => p.doc_id).join(",");
    router.push(`/${slug}/documents?ids=${ids}`);
  };

  return (
    <Tabs defaultValue="succeeded">
      <div className="flex items-center justify-between mb-1">
        <TabsList>
          <TabsTrigger value="succeeded" className="cursor-pointer gap-2">
            Succeeded
            <Badge variant="secondary" className="text-xs px-1.5 py-0 h-4">
              {pages.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="failed" className="cursor-pointer gap-2">
            Failed
            <Badge variant="secondary" className="text-xs px-1.5 py-0 h-4">
              {failedPages.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="ignored" className="cursor-pointer gap-2">
            Ignored
            <Badge variant="secondary" className="text-xs px-1.5 py-0 h-4">
              {ignoredPages.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        {pages.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 cursor-pointer"
            onClick={handleViewAllDocs}
          >
            <BookOpen className="h-3.5 w-3.5" />
            View in Documents
          </Button>
        )}
      </div>

      <TabsContent value="succeeded" className="mt-4">
        <PagesList pages={pages} />
      </TabsContent>
      <TabsContent value="failed" className="mt-4">
        <FailedPagesList pages={failedPages} />
      </TabsContent>
      <TabsContent value="ignored" className="mt-4">
        <IgnoredPagesList pages={ignoredPages} />
      </TabsContent>
    </Tabs>
  );
}
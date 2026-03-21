"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download } from "lucide-react";
import { FailedPagesList } from "../result/failed-pages-list";
import { IgnoredPagesList } from "../result/skipped-pages-list";
import { Job, JobResult } from "../../../_types";

interface ErrorsTabProps {
  job: Job;
}

function EmptyResult({ status }: { status: string }) {
  const messages: Record<string, { title: string; description: string }> = {
    PENDING: { title: "Job is queued", description: "Diagnostics will appear here once the job starts." },
    STARTED: { title: "Job is running", description: "Currently processing URLs..." },
    FAILURE: { title: "Execution failed", description: "The system failed to run the crawler." },
  };
  const msg = messages[status] ?? { title: "No diagnostics", description: "Run the job to see errors or skipped pages." };
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-2 text-center">
      <p className="text-base font-medium">{msg.title}</p>
      <p className="text-sm text-muted-foreground max-w-sm">{msg.description}</p>
    </div>
  );
}

export function ErrorsTab({ job }: ErrorsTabProps) {
  const result = job.result as JobResult | null;

  if (!result) return <EmptyResult status={job.status} />;

  const failedPages = result.failed ?? [];
  const skippedPages = result.skipped ?? [];

  return (
    <Tabs defaultValue="failed">
      <div className="flex items-center justify-between mb-1">
        <TabsList>
          <TabsTrigger value="failed" className="cursor-pointer gap-2">
            Failed
            <Badge variant="secondary" className="text-xs px-1.5 py-0 h-4">
              {failedPages.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="skipped" className="cursor-pointer gap-2">
            Skipped
            <Badge variant="secondary" className="text-xs px-1.5 py-0 h-4">
              {skippedPages.length}
            </Badge>
          </TabsTrigger>
        </TabsList>


          {result && (
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 cursor-pointer"
              onClick={() => {
                 const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" });
                 const url = URL.createObjectURL(blob);
                 const a = document.createElement("a");
                 a.href = url;
                 a.download = `job-${job.id}-results.json`;
                 a.click();
              }}
            >
              <Download className="h-3.5 w-3.5" />
              Export JSON
            </Button>
          )}
      </div>

      <TabsContent value="failed" className="mt-4">
        <FailedPagesList pages={failedPages} />
      </TabsContent>
      <TabsContent value="skipped" className="mt-4">
        <IgnoredPagesList pages={skippedPages} />
      </TabsContent>
    </Tabs>
  );
}
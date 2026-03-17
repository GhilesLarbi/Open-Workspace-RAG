"use client";

import { JobConfigForm } from "../../../_components/form/job-config-form";
import { Job, JobConfig } from "../../../_types";
import { JobConfigValues } from "../../../_types/schemas";

interface ConfigureTabProps {
  job: Job;
  onUpdate: (config: JobConfig) => Promise<void>;
  isUpdating: boolean;
}

export function ConfigureTab({ job, onUpdate, isUpdating }: ConfigureTabProps) {
  const handleSubmit = async (data: JobConfigValues) => {
    await onUpdate(data);
  };

  return (
    <JobConfigForm
      initialData={job.config}
      onSubmit={handleSubmit}
      isSubmitting={isUpdating}
      submitLabel="Save Changes"
    />
  );
}
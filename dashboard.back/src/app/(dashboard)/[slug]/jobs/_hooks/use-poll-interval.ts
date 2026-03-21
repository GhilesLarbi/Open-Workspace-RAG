// src/app/(dashboard)/[slug]/jobs/_hooks/use-poll-interval.ts

import { Job, JobStatus } from "../_types";

const ACTIVE_STATUSES = new Set<JobStatus>(["PENDING", "STARTED"]);
const STALE_THRESHOLD_MS = 24 * 60 * 60 * 1000; // 1 day
const POLL_INTERVAL_MS = 3000;

/**
 * Returns a poll interval (ms) or false.
 *
 * Rules:
 * - Only poll PENDING or STARTED jobs
 * - Never poll if updated_at is older than 1 day
 *   (job is stuck / server died — don't hammer the API)
 * - Otherwise poll every 3s
 */
export function getPollInterval(job: Job | undefined): number | false {
  if (!job) return false;
  if (!ACTIVE_STATUSES.has(job.status as JobStatus)) return false;

  const updatedAt = new Date(job.updated_at).getTime();
  const isStale = Date.now() - updatedAt > STALE_THRESHOLD_MS;
  if (isStale) return false;

  return POLL_INTERVAL_MS;
}

/**
 * Same logic but for a list of jobs — polls if ANY job in the list
 * is active and not stale.
 */
export function getPollIntervalForList(jobs: Job[]): number | false {
  const shouldPoll = jobs.some(
    (job) => getPollInterval(job) !== false
  );
  return shouldPoll ? POLL_INTERVAL_MS : false;
}
import { type JobStatus } from './schema'

export const callTypes = new Map<JobStatus, string>([
  ['SUCCESS', 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200'],
  ['PENDING', 'bg-neutral-300/40 border-neutral-300'],
  ['STARTED', 'bg-sky-200/40 text-sky-900 dark:text-sky-100 border-sky-300'],
  [
    'FAILURE',
    'bg-destructive/10 dark:bg-destructive/50 text-destructive dark:text-primary border-destructive/10',
  ],
])
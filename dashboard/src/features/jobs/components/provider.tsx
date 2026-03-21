import React, { useState } from 'react'
import type { Job } from '../data/schema'

type JobsDialogType = 'delete'

type JobsContextType = {
  open: JobsDialogType | null
  setOpen: (str: JobsDialogType | null) => void
  currentRow: Job | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Job | null>>
}

const JobsContext = React.createContext<JobsContextType | null>(null)

export function JobsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState<JobsDialogType | null>(null)
  const [currentRow, setCurrentRow] = useState<Job | null>(null)

  return (
    <JobsContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </JobsContext>
  )
}

export const useJobsContext = () => {
  const ctx = React.useContext(JobsContext)
  if (!ctx) throw new Error('useJobsContext must be used within <JobsProvider>')
  return ctx
}

import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { useWorkspaceStore } from '@/stores/workspace-store'
import { jobApi } from '../job-api'
import { type Job } from '../data/schema'

type JobsDialogType = 'invite' | 'add' | 'edit' | 'delete' | 'view-result'

type JobsContextType = {
  jobs: Job[]
  isLoading: boolean
  fetchJobs: () => Promise<void>
  open: JobsDialogType | null
  setOpen: (str: JobsDialogType | null) => void
  currentRow: Job | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Job | null>>
}

const JobsContext = React.createContext<JobsContextType | null>(null)

export function JobsProvider({ children }: { children: React.ReactNode }) {
  const { activeWorkspace } = useWorkspaceStore()
  const slug = activeWorkspace?.slug

  const [open, setOpen] = useDialogState<JobsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Job | null>(null)
  const [jobs, setJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const connections = useRef<Map<string, EventSource>>(new Map())
  
  const jobsRef = useRef(jobs)
  useEffect(() => { jobsRef.current = jobs }, [jobs])

  const fetchJobs = useCallback(async () => {
    if (!slug) return
    setIsLoading(true)
    try {
      const data = await jobApi.getJobs(slug)
      setJobs(data)
    } catch (_error) { /* error */ } 
    finally { setIsLoading(false) }
  }, [slug])

  useEffect(() => {
    fetchJobs()
  }, [fetchJobs])

  const connectionManagerKey = useMemo(() => 
    jobs
      .filter(j => j.status === 'STARTED' || j.status === 'PENDING')
      .map(j => j.id)
      .join(','), 
    [jobs]
  )

  useEffect(() => {
    if (!slug) return

    jobsRef.current.forEach((job) => {
      const needsConnection = job.status === 'STARTED' || job.status === 'PENDING'
      if (needsConnection && !connections.current.has(job.id)) {
        const es = new EventSource(`http://localhost:8000/api/v1/jobs/${slug}/${job.id}/progress`, { withCredentials: true })

        es.onmessage = (event) => {
          const data = JSON.parse(event.data)
          setJobs((prev) => prev.map((j) => 
            j.id === job.id ? { ...j, status: data.status, task_id: data.task_id, result: data.result } : j
          ))

          if (['SUCCESS', 'FAILURE'].includes(data.status)) {
            es.close()
            connections.current.delete(job.id)
          }
        }

        es.onerror = () => {
          es.close()
          connections.current.delete(job.id)
        }
        connections.current.set(job.id, es)
      }
    })

    connections.current.forEach((es, id) => {
      const job = jobsRef.current.find(j => j.id === id)
      if (!job || !['STARTED', 'PENDING'].includes(job.status)) {
        es.close()
        connections.current.delete(id)
      }
    })
  }, [connectionManagerKey, slug])

  useEffect(() => {
    return () => {
      connections.current.forEach(es => es.close())
      // eslint-disable-next-line react-hooks/exhaustive-deps
      connections.current.clear()
    }
  }, [])

  const value = useMemo(() => ({
    jobs, isLoading, fetchJobs, open, setOpen, currentRow, setCurrentRow
  }), [jobs, isLoading, fetchJobs, open, setOpen, currentRow])

  return (
    <JobsContext.Provider value={value}>
      {children}
    </JobsContext.Provider>
  )
}


// eslint-disable-next-line react-refresh/only-export-components
export const useJobs = () => {
  const context = React.useContext(JobsContext)
  if (!context) throw new Error('useJobs must be used within JobsProvider')
  return context
}
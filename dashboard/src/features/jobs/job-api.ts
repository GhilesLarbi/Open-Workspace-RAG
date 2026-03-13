import { apiClient } from '@/lib/api-client'
import { type Job, type JobConfig, type JobStatus } from './data/schema'

interface JobResponse {
  id: string
  task_id: string | null
  status: JobStatus
  payload: JobConfig
  result: Record<string, unknown> | null
  workspace_id: string
  created_at: string
  updated_at: string
}

interface CreateJobResponse {
  job_id: string
  task_id: string | null
  status: JobStatus
}

const mapJob = (data: JobResponse): Job => ({
  id: data.id,
  task_id: data.task_id,
  status: data.status,
  config: data.payload,
  result: data.result,
  workspace_id: data.workspace_id,
  created_at: new Date(data.created_at),
  updated_at: new Date(data.updated_at),
})

export const jobApi = {
  // GET /{slug}
  getJobs: async (workspaceSlug: string, params?: { skip?: number; limit?: number; status?: string[] }) => {
    const response = await apiClient.get<JobResponse[]>(`/api/v1/jobs/${workspaceSlug}`, { params })
    return response.data.map(mapJob)
  },

  // POST /{slug}
  createJob: async (workspaceSlug: string, config: JobConfig) => {
    const response = await apiClient.post<CreateJobResponse>(`/api/v1/jobs/${workspaceSlug}`, config)
    return response.data
  },

  // PATCH /{slug}/{job_id}
  updateJob: async (workspaceSlug: string, jobId: string, config: JobConfig) => {
    const response = await apiClient.patch<JobResponse>(`/api/v1/jobs/${workspaceSlug}/${jobId}`, config)
    return mapJob(response.data)
  },

  // DELETE /{slug} -> expects an array of strings (UUIDs)
  deleteJobs: async (workspaceSlug: string, jobIds: string[]) => {
    const response = await apiClient.delete(`/api/v1/jobs/${workspaceSlug}`, {
      data: jobIds // Axios sends this as the request body
    })
    return response.data
  },
}
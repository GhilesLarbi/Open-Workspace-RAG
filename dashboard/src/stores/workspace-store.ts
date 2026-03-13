import { create } from 'zustand'
import { workspaceApi } from '@/features/workspaces/workspace-api'
import type { Workspace } from '@/features/workspaces/workspace-types'

interface WorkspaceState {
  workspaces: Workspace[]
  activeWorkspace: Workspace | null
  setWorkspaces: (workspaces: Workspace[]) => void
  setActiveWorkspace: (workspace: Workspace | null) => void
  initialize: () => Promise<Workspace[]>
  reset: () => void
}

export const useWorkspaceStore = create<WorkspaceState>()((set, get) => ({
  workspaces: [],
  activeWorkspace: null,
  setWorkspaces: (workspaces) => set({ workspaces }),
  setActiveWorkspace: (activeWorkspace) => set({ activeWorkspace }),

  initialize: async () => {
    if (get().workspaces.length > 0) return get().workspaces;

    const data = await workspaceApi.getWorkspaces()
    set({ workspaces: data })
    
    if (data.length > 0 && !get().activeWorkspace) {
      set({ activeWorkspace: data[0] })
    }
    return data
  },
  
  reset: () => set({ workspaces: [], activeWorkspace: null }),
}))
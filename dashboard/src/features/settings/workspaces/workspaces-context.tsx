import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import type { Workspace } from '@/features/workspaces/workspace-types'

type WorkspacesDialogType = 'create' | 'update' | 'delete'

interface WorkspacesContextType {
  open: WorkspacesDialogType | null
  setOpen: (str: WorkspacesDialogType | null) => void
  currentRow: Workspace | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Workspace | null>>
}

const WorkspacesContext = React.createContext<WorkspacesContextType | null>(null)

export function WorkspacesProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<WorkspacesDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Workspace | null>(null)

  return (
    <WorkspacesContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </WorkspacesContext.Provider>
  )
}

export const useWorkspaces = () => {
  const context = React.useContext(WorkspacesContext)
  if (!context) throw new Error('useWorkspaces must be used within <WorkspacesProvider>')
  return context
}
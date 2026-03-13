import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useWorkspaceStore } from '@/stores/workspace-store'
import { ContentSection } from '../components/content-section'
import { WorkspacesActionDialog } from './components/workspaces-action-dialog'
import { WorkspacesDeleteDialog } from './components/workspaces-delete-dialog'
import { WorkspacesTable } from './components/workspaces-table'
import { WorkspacesProvider, useWorkspaces } from './workspaces-context'

export function SettingsWorkspaces() {
  return (
    <WorkspacesProvider>
      <WorkspacesContent />
    </WorkspacesProvider>
  )
}

function WorkspacesContent() {
  const { open, setOpen, currentRow, setCurrentRow } = useWorkspaces()
  const { workspaces } = useWorkspaceStore()

  return (
    <ContentSection
      title='Workspaces'
      desc='Manage the workspaces in your organization.'
    >
      <div className='space-y-4'>

        <WorkspacesTable data={workspaces} />
        <div className='flex'>
          <Button
            onClick={() => {
              setCurrentRow(null)
              setOpen('create')
            }}
            size='sm'
          >
            <Plus className='mr-2 h-4 w-4' /> Add Workspace
          </Button>
        </div>

        <WorkspacesActionDialog
          key={currentRow?.id || 'create-mode'}
          open={open === 'create' || open === 'update'}
          onOpenChange={(v) => {
            if (!v) {
              setOpen(null)
              setCurrentRow(null)
            }
          }}
          currentRow={currentRow}
        />

        {open === 'delete' && currentRow && (
          <WorkspacesDeleteDialog
            open={open === 'delete'}
            onOpenChange={(v) => {
              if (!v) {
                setOpen(null)
                setCurrentRow(null)
              }
            }}
            workspace={currentRow}
          />
        )}
      </div>
    </ContentSection>
  )
}
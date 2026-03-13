import { JobsActionDialog } from './jobs-action-dialog'
import { JobsDeleteDialog } from './jobs-delete-dialog'
import { JobsResultDialog } from './jobs-result-dialog'
import { useJobs } from './jobs-provider'

export function JobsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useJobs()
  return (
    <>
      <JobsActionDialog
        key='user-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      {currentRow && (
        <>
          <JobsActionDialog
            key={`user-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />

          <JobsResultDialog
            open={open === 'view-result'}
            onOpenChange={() => {
              setOpen(null)
              setTimeout(() => setCurrentRow(null), 500)
            }}
            job={currentRow}
          />

          <JobsDeleteDialog
            key={`user-delete-${currentRow.id}`}
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />
        </>
      )}
    </>
  )
}

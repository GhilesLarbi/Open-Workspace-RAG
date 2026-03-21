import { ConfirmDialog } from '@/components/confirm-dialog'
import { useDocumentsContext } from './documents-provider'
import { useDeleteDocuments, useUpdateDocumentsApproval } from '../hooks'
import { toast } from 'sonner'

export function DocumentsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useDocumentsContext()
  const deleteDocuments = useDeleteDocuments()
  const updateApproval = useUpdateDocumentsApproval()

  return (
    <>
      {currentRow && (
        <>
          <ConfirmDialog
            key='document-delete'
            destructive
            open={open === 'delete'}
            onOpenChange={(val) => {
              setOpen(val ? 'delete' : null)
              if (!val) setTimeout(() => setCurrentRow(null), 500)
            }}
            handleConfirm={async () => {
              await deleteDocuments.mutateAsync([currentRow.id], {
                onSuccess: () => {
                  toast.success('Document deleted successfully')
                  setOpen(null)
                  setTimeout(() => setCurrentRow(null), 500)
                },
                onError: () => {
                  toast.error('Failed to delete document')
                }
              })
            }}
            className='max-w-md'
            title={`Delete this document?`}
            desc={
              <>
                You are about to delete the document:{' '}
                <strong>{currentRow.title || currentRow.url}</strong>. <br />
                This action cannot be undone.
              </>
            }
            confirmText='Delete'
          />

          <ConfirmDialog
            key='document-approval'
            open={open === 'approval'}
            onOpenChange={(val) => {
              setOpen(val ? 'approval' : null)
              if (!val) setTimeout(() => setCurrentRow(null), 500)
            }}
            handleConfirm={async () => {
              const isApproved = !currentRow.is_approved
              await updateApproval.mutateAsync({ documentIds: [currentRow.id], isApproved }, {
                onSuccess: () => {
                  toast.success(`Document ${isApproved ? 'approved' : 'revoked'} successfully`)
                  setOpen(null)
                  setTimeout(() => setCurrentRow(null), 500)
                },
                onError: () => {
                  toast.error('Failed to update approval status')
                }
              })
            }}
            className='max-w-md'
            title={currentRow.is_approved ? 'Revoke Approval?' : 'Approve Document?'}
            desc={
              <>
                Are you sure you want to {currentRow.is_approved ? 'revoke approval for' : 'approve'} the document:{' '}
                <strong>{currentRow.title || currentRow.url}</strong>?
              </>
            }
            confirmText={currentRow.is_approved ? 'Revoke' : 'Approve'}
          />
        </>
      )}
    </>
  )
}

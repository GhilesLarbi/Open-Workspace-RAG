import { WorkspacesTable } from './workspaces-table'

export function WorkspacesSettings() {
  return (
    <div className='space-y-4'>
      <div>
        <h3 className='text-lg font-medium'>Workspaces</h3>
        <p className='text-sm text-muted-foreground'>
          Manage your workspaces. Each workspace has its own documents and crawl jobs.
        </p>
      </div>
      <WorkspacesTable />
    </div>
  )
}

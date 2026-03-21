import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/_authenticated/documents/add')({
  component: AddDocument,
})

function AddDocument() {
  const navigate = useNavigate()

  return (
    <>
      <Header>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main fixed>
        <div className='space-y-0.5'>
          <div className='flex items-center gap-2 mb-2'>
              <Button
                variant='ghost'
                size='sm'
                className='gap-1 -ml-3'
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onClick={() => navigate({ to: '/documents', search: {} as any })}
              >
              <ArrowLeft className='h-4 w-4' />
              Back to Documents
            </Button>
          </div>
          <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
            Add Document
          </h1>
          <p className='text-muted-foreground'>
            Upload or index a new document into your workspace.
          </p>
        </div>

        <Separator className='my-4 lg:my-6' />

        <div className='flex flex-1 flex-col overflow-y-auto scroll-smooth pe-4 pb-12'>
          <div className='lg:max-w-2xl'>
            <Card className='border-dashed'>
              <CardHeader>
                <CardTitle>Dummy Implementation</CardTitle>
                <CardDescription>
                  This page is a placeholder for the document indexing/upload feature.
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <p className='text-sm text-muted-foreground'>
                  In a real implementation, you would be able to:
                </p>
                <ul className='text-sm space-y-2 list-disc list-inside text-muted-foreground ps-2'>
                  <li>Upload PDF, Text, or Markdown files.</li>
                  <li>Manually enter a URL to crawl specifically.</li>
                  <li>Configure chunking strategies for the new document.</li>
                  <li>Apply initial tags and metadata.</li>
                </ul>
                <div className='pt-4'>
                  <Button disabled>Initialize Upload</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Main>
    </>
  )
}

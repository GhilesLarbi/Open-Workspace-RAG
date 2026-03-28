/* eslint-disable react-refresh/only-export-components */
import * as React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  ArrowLeft,
  Tag,
  Clock,
  Layers,
  Info,
  ExternalLink,
  FileText,
} from 'lucide-react'
import { useState } from 'react'
import { useDocument } from '@/features/documents/hooks'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Button, buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/_authenticated/documents/$documentId')({
  component: DocumentDetail,
})

function DataRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between py-3 border-b border-border/50 last:border-0">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <span className="text-sm text-right text-foreground">{value}</span>
    </div>
  )
}

function DocumentContentSection({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <div className='flex flex-1 flex-col h-full'>
      <div className='flex-none'>
        <h3 className='text-lg font-medium'>{title}</h3>
        <p className='text-sm text-muted-foreground'>{desc}</p>
      </div>
      <Separator className='my-4 flex-none' />
      <div className='h-full w-full overflow-y-auto scroll-smooth pe-4 pb-12'>
        <div className='-mx-1 px-1.5 lg:max-w-4xl'>{children}</div>
      </div>
    </div>
  )
}

function DocumentDetail() {
  const { documentId } = Route.useParams()
  const navigate = useNavigate()
  const { data: document, isLoading } = useDocument(documentId)
  const [activeTab, setActiveTab] = useState('overview')

  const sidebarNavItems = [
    {
      id: 'overview',
      title: 'Overview',
      icon: <FileText size={18} />,
    },
    {
      id: 'chunks',
      title: 'Chunks',
      icon: <Layers size={18} />,
    },
  ]

  if (isLoading) {
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
          <div className='space-y-4'>
            <Skeleton className='h-8 w-32' />
            <Skeleton className='h-12 w-full' />
            <Skeleton className='h-64 w-full' />
          </div>
        </Main>
      </>
    )
  }

  if (!document) {
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
          <div className='flex flex-1 items-center justify-center'>
            <div className='text-destructive'>Document not found</div>
          </div>
        </Main>
      </>
    )
  }

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
              onClick={() => navigate({ to: '/documents', search: {} as Record<string, never> })}
            >
              <ArrowLeft className='h-4 w-4' />
              Back to Documents
            </Button>
          </div>
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
            <div className='max-w-4xl min-w-0'>
              <h1 className='text-2xl font-bold tracking-tight md:text-3xl truncate'>
                {document.title || 'Untitled Document'}
              </h1>
              <a 
                href={document.url} 
                target='_blank' 
                rel='noopener noreferrer'
                className='text-muted-foreground hover:text-primary transition-colors text-sm flex items-center gap-1 mt-1 truncate'
              >
                {document.url}
                <ExternalLink className='h-3.5 w-3.5 shrink-0' />
              </a>
            </div>
            <div className='flex gap-2 shrink-0'>
              <Badge 
                variant='outline'
                className={cn(
                  'gap-1 h-6',
                  document.is_approved ? 'bg-primary/5 text-primary border-primary/20' : 'bg-destructive/5 text-destructive border-destructive/20'
                )}
              >
                {document.is_approved ? 'Approved' : 'Not Approved'}
              </Badge>
            </div>
          </div>
        </div>

        <Separator className='my-4 lg:my-6' />

        <div className='flex flex-1 flex-col space-y-2 overflow-hidden md:space-y-2 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <aside className='top-0 lg:sticky lg:w-1/5'>
            <div className='p-1 md:hidden'>
              <Select value={activeTab} onValueChange={setActiveTab}>
                <SelectTrigger className='h-12 w-full'>
                  <SelectValue placeholder='Select Tab' />
                </SelectTrigger>
                <SelectContent>
                  {sidebarNavItems.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      <div className='flex gap-x-4 px-2 py-1'>
                        <span className='scale-125'>{item.icon}</span>
                        <span className='text-md'>{item.title}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <ScrollArea
              orientation='horizontal'
              type='always'
              className='hidden w-full min-w-40 bg-background px-1 py-2 md:block'
            >
              <nav className='flex space-x-2 py-1 lg:flex-col lg:space-y-1 lg:space-x-0'>
                {sidebarNavItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={cn(
                      buttonVariants({ variant: 'ghost' }),
                      activeTab === item.id
                        ? 'bg-muted hover:bg-muted'
                        : 'hover:bg-transparent hover:underline',
                      'justify-start'
                    )}
                  >
                    <span className='me-2'>{item.icon}</span>
                    {item.title}
                  </button>
                ))}
              </nav>
            </ScrollArea>
          </aside>

          <div className='flex w-full overflow-hidden p-1 pr-4'>
            <div className='w-full h-full'>
              {activeTab === 'overview' && (
                <DocumentContentSection title='Overview' desc='Document details and metadata'>
                  <div className='space-y-8'>
                    <div>
                      <h4 className='font-medium mb-3 text-sm text-muted-foreground flex items-center gap-2'>
                        <Info className="h-4 w-4" /> Basic Information
                      </h4>
                      <div className='rounded-md border bg-card px-4'>
                        <DataRow label="Language" value={<Badge variant='secondary' className='font-mono uppercase'>{document.lang}</Badge>} />
                        <DataRow label="Status" value={document.is_approved ? 'Approved' : 'Review Required'} />
                        <DataRow label="Chunks Count" value={document.chunks.length.toString()} />
                      </div>
                    </div>

                    <div>
                      <h4 className='font-medium mb-3 text-sm text-muted-foreground flex items-center gap-2'>
                        <Clock className="h-4 w-4" /> Timestamps
                      </h4>
                      <div className='rounded-md border bg-card px-4'>
                        <DataRow label="Created" value={new Date(document.created_at).toLocaleString()} />
                        <DataRow label="Last Updated" value={new Date(document.updated_at).toLocaleString()} />
                      </div>
                    </div>

                    <div>
                      <h4 className='font-medium mb-3 text-sm text-muted-foreground flex items-center gap-2'>
                        <Tag className="h-4 w-4" /> Tag
                      </h4>
                      {document.tag ? (
                        <Badge variant='secondary' className='font-mono'>
                          {document.tag}
                        </Badge>
                      ) : (
                        <div className='rounded-md border border-dashed bg-muted/30 p-4 text-center'>
                          <Tag className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">No tag assigned</p>
                        </div>
                      )}
                    </div>
                  </div>
                </DocumentContentSection>
              )}

              {activeTab === 'chunks' && (
                <DocumentContentSection title='Chunks' desc='Extracted content parts for vector search'>
                  <div className='space-y-4 pb-4'>
                    <Accordion type='single' collapsible className='w-full border rounded-lg bg-card overflow-hidden'>
                      {document.chunks.map((chunk, index) => (
                        <AccordionItem key={chunk.id} value={chunk.id} className='border-b last:border-0 px-4'>
                          <AccordionTrigger className='hover:no-underline py-4'>
                            <div className='flex items-center gap-3 text-left'>
                              <span className='flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-bold'>
                                {index + 1}
                              </span>
                              <div className='flex flex-col min-w-0'>
                                <span className='text-sm font-medium line-clamp-1'>
                                  {chunk.content.substring(0, 100)}...
                                </span>
                                <span className='text-[10px] font-mono text-muted-foreground mt-0.5'>
                                  ID: {chunk.id.substring(0, 8)}...
                                </span>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className='pb-6 pt-2'>
                            <div className='relative rounded-md bg-muted/50 p-4 font-normal text-sm leading-relaxed whitespace-pre-wrap'>
                              {chunk.content}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                      {document.chunks.length === 0 && (
                        <div className='text-center py-12 text-muted-foreground'>
                          No chunks found for this document.
                        </div>
                      )}
                    </Accordion>
                  </div>
                </DocumentContentSection>
              )}

            </div>
          </div>
        </div>
      </Main>
    </>
  )
}
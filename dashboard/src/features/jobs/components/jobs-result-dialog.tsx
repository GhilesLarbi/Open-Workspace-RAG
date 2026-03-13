/* eslint-disable @typescript-eslint/no-explicit-any */
import { XCircle, ExternalLink } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { type Job } from '../data/schema'

type Props = {
  job: Job | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function JobsResultDialog({ job, open, onOpenChange }: Props) {    
  const result = job?.result as any
  
  if (!result || !result.summary) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[95vw] lg:max-w-300 h-[70vh] flex flex-col p-0 gap-0 overflow-hidden'>
        <DialogHeader className='p-6 pb-2'>
          <div className='flex items-center justify-between'>
            <div>
              <DialogTitle className='text-xl'>Results</DialogTitle>
              <DialogDescription>
                Job ID: <span className='font-mono text-xs'>{job?.id}</span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className='flex-1 overflow-hidden'>
          <Tabs defaultValue='success' className='flex flex-col h-full'>
            <div className='px-6'>
              <TabsList className='grid grid-cols-2'>
                <TabsTrigger value='success' className='gap-2'>
                  Successful {result.summary.succeeded}
                </TabsTrigger>
                <TabsTrigger value='failed' className='gap-2'>
                  Failed {result.summary.failed}
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value='success' className='flex-1 mt-4 overflow-hidden'>
              <ScrollArea className='h-[55vh] px-6 pb-6'>
                <div className='rounded-md border bg-card'>
                  <Table>
                    <TableHeader className='bg-muted/50'>
                      <TableRow>
                        <TableHead className='w-[40%]'>Page Title</TableHead>
                        <TableHead>Language</TableHead>
                        <TableHead className='text-right'>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {result.success_pages.map((page: any, i: number) => (
                        <TableRow key={i}>
                          <TableCell className='font-medium'>
                            <div className='flex flex-col gap-0.5'>
                              <span className='truncate max-w-75'>{page.title}</span>
                              <span className='text-[10px] text-muted-foreground font-mono truncate max-w-75'>{page.url}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant='secondary' className='text-[10px] font-bold'>{page.lang}</Badge>
                          </TableCell>
                          <TableCell className='text-right'>
                            <a href={page.url} target='_blank' rel='noreferrer' className='inline-flex items-center justify-center p-2 rounded-md hover:bg-muted'>
                              <ExternalLink className='size-4 text-muted-foreground hover:text-primary' />
                            </a>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value='failed' className='flex-1 mt-4 overflow-hidden'>
              <ScrollArea className='h-[58vh] px-6 pb-6'>
                <Accordion type='multiple' className='space-y-2'>
                  {result.failed_pages.map((page: any, i: number) => (
                    <AccordionItem key={i} value={`item-${i}`} className='border rounded-lg bg-card px-4'>
                      <AccordionTrigger className='hover:no-underline py-3'>
                        <div className='flex items-center gap-3 text-left'>
                          <div className='p-1.5 rounded-md bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'>
                            <XCircle className='size-4' />
                          </div>
                          <div className='flex flex-col'>
                            <span className='text-sm font-medium truncate max-w-100'>{page.url}</span>
                            <span className='text-[10px] text-red-500 font-bold uppercase'>{page.status}</span>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className='pt-2 pb-4'>
                        <div className='relative'>
                          <div className='absolute right-2 top-2'>
                             <Badge variant='outline' className='text-[10px] opacity-70'>Python Traceback</Badge>
                          </div>
                          <pre className='p-4 rounded-md bg-slate-950 text-slate-200 text-xs font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed border border-slate-800'>
                            {page.error}
                          </pre>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
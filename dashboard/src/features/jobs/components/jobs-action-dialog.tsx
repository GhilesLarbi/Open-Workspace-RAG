'use client'

import { useForm, useFieldArray, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash2, Globe, Filter, Type, Target, Search } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { JobConfigSchema, type JobConfig, type Job } from '../data/schema'
import { useWorkspaceStore } from '@/stores/workspace-store'
import { jobApi } from '../job-api'
import { useJobs } from './jobs-provider'

type JobActionDialogProps = {
  currentRow?: Job
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function JobsActionDialog({ currentRow, open, onOpenChange }: JobActionDialogProps) {
  const isEdit = !!currentRow
  const { activeWorkspace } = useWorkspaceStore()
  const { fetchJobs } = useJobs()
  
  const form = useForm<import('zod').infer<typeof JobConfigSchema>>({
    resolver: zodResolver(JobConfigSchema),
    defaultValues: isEdit ? currentRow.config : {
      url: '',
      crawling: { max_depth: 1, max_pages: 10, filters:[] },
      filtering: { word_count_threshold: 0, languages: null },
      formating: {
        user_query: null,
        min_word_threshold: 5,
        threshold_type: 'fixed',
        threshold: 0.2,
        ignore_links: true,
        ignore_images: true,
        skip_internal_links: true,
      }
    }
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "crawling.filters"
  })

  const onSubmit: SubmitHandler<JobConfig> = async (values) => {
    if (!activeWorkspace) {
      toast.error('No active workspace selected.')
      return
    }

    try {
      if (isEdit) {
        await jobApi.updateJob(activeWorkspace.slug, currentRow.id, values)
        toast.success('Job configuration updated.')
      } else {
        await jobApi.createJob(activeWorkspace.slug, values)
        toast.success('Job created and crawling started!')
      }
      
      await fetchJobs() // Refresh the table
      form.reset()
      onOpenChange(false)
    } catch (error) {
      toast.error(isEdit ? 'Failed to update job' : 'Failed to create job')
      console.error(error)
    }
  }

  const getFilterIcon = (type: string) => {
    switch (type) {
      case 'url': return <Globe className="size-4" />
      case 'domain': return <Target className="size-4" />
      case 'seo': return <Search className="size-4" />
      case 'relevance': return <Type className="size-4" />
      default: return <Filter className="size-4" />
    }
  }

  return (
    <Dialog open={open} onOpenChange={(val) => { form.reset(); onOpenChange(val); }}>
      <DialogContent className='sm:max-w-2xl'>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Job Config' : 'Create New Job'}</DialogTitle>
          <DialogDescription>Fill in all the configuration details for the scraper.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form id='job-config-form' onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid grid-cols-4">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="crawling">Crawl</TabsTrigger>
                <TabsTrigger value="filtering">Filter</TabsTrigger>
                <TabsTrigger value="formating">Format</TabsTrigger>
              </TabsList>

              <div className='mt-4 max-h-[65vh] overflow-y-auto pe-2 scrollbar-thin'>
                
                <TabsContent value="general" className="space-y-4 pt-1">
                  <FormField
                    control={form.control}
                    name="url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target URL</FormLabel>
                        <FormControl><Input placeholder="https://example.com" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="crawling" className="space-y-6 pt-1">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="crawling.max_depth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Max Depth</FormLabel>
                          <FormControl><Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value) || 1)} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="crawling.max_pages"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Max Pages</FormLabel>
                          <FormControl><Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value) || 1)} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-2">
                      <FormLabel className="text-base">Filter Rules</FormLabel>
                      <Button type="button" variant="outline" size="sm" onClick={() => append({ type: 'url', patterns:[], reverse: false })}>
                        <Plus className="me-2 size-4" /> Add Rule
                      </Button>
                    </div>

                    <Accordion type="multiple" className="w-full space-y-2">
                      {fields.map((field, index) => (
                        <AccordionItem value={`item-${index}`} key={field.id} className="border rounded-lg bg-card overflow-hidden">
                          <AccordionTrigger className="hover:no-underline py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="bg-primary/10 p-1.5 rounded-md text-primary">{getFilterIcon(form.watch(`crawling.filters.${index}.type`))}</div>
                              <span className="font-medium text-sm">Rule #{index + 1}: {form.watch(`crawling.filters.${index}.type`).toUpperCase()}</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="space-y-4 pb-4 px-4 pt-2 border-t bg-muted/20">
                            <div className="flex items-end gap-3">
                              <FormField
                                control={form.control}
                                name={`crawling.filters.${index}.type`}
                                render={({ field }) => (
                                  <FormItem className="flex-1">
                                    <FormLabel>Rule Type</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                      <SelectContent>
                                        <SelectItem value="url">URL Pattern</SelectItem>
                                        <SelectItem value="domain">Domain</SelectItem>
                                        <SelectItem value="seo">SEO Keywords</SelectItem>
                                        <SelectItem value="relevance">Relevance</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </FormItem>
                                )}
                              />
                              <Button variant="ghost" size="icon" className="text-destructive" onClick={() => remove(index)}><Trash2 className="size-4" /></Button>
                            </div>

                            {form.watch(`crawling.filters.${index}.type`) === 'url' && (
                              <>
                                <FormField
                                  control={form.control}
                                  name={`crawling.filters.${index}.patterns` as any}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Patterns (one per line)</FormLabel>
                                      <FormControl>
                                        <Textarea placeholder="/blog/*" value={field.value?.join('\n') || ''} onChange={(e) => field.onChange(e.target.value.split('\n').filter(Boolean))} />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name={`crawling.filters.${index}.reverse` as any}
                                  render={({ field }) => (
                                    <FormItem className="flex items-center justify-between rounded-md border bg-background p-3">
                                      <FormLabel>Reverse Logic</FormLabel>
                                      <FormControl><Switch checked={!!field.value} onCheckedChange={field.onChange} /></FormControl>
                                    </FormItem>
                                  )}
                                />
                              </>
                            )}

                            {form.watch(`crawling.filters.${index}.type`) === 'domain' && (
                              <div className="grid grid-cols-2 gap-4">
                                <FormField
                                  control={form.control}
                                  name={`crawling.filters.${index}.allowed` as any}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Allowed Domains</FormLabel>
                                      <FormControl>
                                        <Textarea placeholder="example.com" value={field.value?.join('\n') || ''} onChange={(e) => field.onChange(e.target.value.split('\n').filter(Boolean))} />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name={`crawling.filters.${index}.blocked` as any}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Blocked Domains</FormLabel>
                                      <FormControl>
                                        <Textarea placeholder="ads.com" value={field.value?.join('\n') || ''} onChange={(e) => field.onChange(e.target.value.split('\n').filter(Boolean))} />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                              </div>
                            )}

                            {(form.watch(`crawling.filters.${index}.type`) === 'seo' || form.watch(`crawling.filters.${index}.type`) === 'relevance') && (
                              <>
                                {form.watch(`crawling.filters.${index}.type`) === 'seo' ? (
                                  <FormField
                                    control={form.control}
                                    name={`crawling.filters.${index}.keywords` as any}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Keywords (one per line)</FormLabel>
                                        <FormControl>
                                          <Textarea placeholder="ai, robotics" value={field.value?.join('\n') || ''} onChange={(e) => field.onChange(e.target.value.split('\n').filter(Boolean))} />
                                        </FormControl>
                                      </FormItem>
                                    )}
                                  />
                                ) : (
                                  <FormField
                                    control={form.control}
                                    name={`crawling.filters.${index}.query` as any}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Relevance Query</FormLabel>
                                        <FormControl><Input placeholder="Context query..." {...field} value={field.value || ''} /></FormControl>
                                      </FormItem>
                                    )}
                                  />
                                )}
                                <FormField
                                  control={form.control}
                                  name={`crawling.filters.${index}.threshold` as any}
                                  render={({ field }) => (
                                    <FormItem>
                                      <div className="flex justify-between"><FormLabel>Threshold</FormLabel><span className="text-xs font-mono">{field.value}</span></div>
                                      <FormControl><Slider min={0} max={1} step={0.05} value={[field.value || 0]} onValueChange={(val) => field.onChange(val[0])} /></FormControl>
                                    </FormItem>
                                  )}
                                />
                              </>
                            )}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                </TabsContent>

                <TabsContent value="filtering" className="space-y-6 pt-1">
                  <FormField
                    control={form.control}
                    name="filtering.word_count_threshold"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Word Count Threshold</FormLabel>
                        <FormControl><Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value) || 0)} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="space-y-3">
                    <FormLabel>Target Languages</FormLabel>
                    <div className="flex gap-4">
                      {['AR', 'FR', 'EN'].map((lang) => (
                        <FormField
                          key={lang}
                          control={form.control}
                          name="filtering.languages"
                          render={({ field }) => {
                            const current = field.value ||[]
                            return (
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={current.includes(lang as any)}
                                    onCheckedChange={(checked) => {
                                      const updated = checked 
                                        ? [...current, lang] 
                                        : current.filter(l => l !== lang)
                                      field.onChange(updated.length ? updated : null)
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">{lang}</FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="formating" className="space-y-6 pt-1">
                  <FormField
                    control={form.control}
                    name="formating.user_query"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>User Query Context</FormLabel>
                        <FormControl><Input placeholder="Optional context..." {...field} value={field.value || ''} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="formating.min_word_threshold"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Min Word Threshold</FormLabel>
                          <FormControl><Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value) || 0)} /></FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="formating.threshold_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Threshold Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>
                              <SelectItem value="fixed">Fixed</SelectItem>
                              <SelectItem value="dynamic">Dynamic</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="formating.threshold"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex justify-between"><FormLabel>Formatting Threshold</FormLabel><span className="text-xs font-mono">{field.value}</span></div>
                        <FormControl><Slider min={0} max={1} step={0.01} value={[field.value || 0]} onValueChange={(val) => field.onChange(val[0])} /></FormControl>
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 gap-3">
                    {['ignore_links', 'ignore_images', 'skip_internal_links'].map((name) => (
                      <FormField
                        key={name}
                        control={form.control}
                        name={`formating.${name}` as any}
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-3">
                            <FormLabel className="capitalize">{name.replace(/_/g, ' ')}</FormLabel>
                            <FormControl><Switch checked={!!field.value} onCheckedChange={field.onChange} /></FormControl>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </form>
        </Form>

        <DialogFooter className="border-t pt-4">
          <Button type='submit' form='job-config-form' className="w-full sm:w-auto">
            {isEdit ? 'Update Configuration' : 'Create Scraping Job'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
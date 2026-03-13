'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { toast } from 'sonner'
import { z } from 'zod'
import { workspaceApi } from '@/features/workspaces/workspace-api'
import { useWorkspaceStore } from '@/stores/workspace-store'
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
import type { Workspace } from '@/features/workspaces/workspace-types'

const formSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  slug: z
    .string()
    .min(1, 'Slug is required.')
    .regex(/^[a-zA-Z0-9-]+$/, 'Only letters, numbers, and hyphens allowed'),
  url: z.string().min(1, 'URL is required.').url('Please enter a valid URL.'),
})

type WorkspaceForm = z.infer<typeof formSchema>

type Props = {
  currentRow?: Workspace | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function WorkspacesActionDialog({
  currentRow,
  open,
  onOpenChange,
}: Props) {
  const isEdit = !!currentRow
  const { setWorkspaces, workspaces, activeWorkspace, setActiveWorkspace } =
    useWorkspaceStore()

  const form = useForm<WorkspaceForm>({
    resolver: zodResolver(formSchema),
    values: isEdit
      ? {
          name: currentRow.name,
          slug: currentRow.slug,
          url: currentRow.url,
        }
      : {
          name: '',
          slug: '',
          url: '',
        },
  })

  const { mutate, isPending } = useMutation({
    mutationFn: (data: WorkspaceForm) =>
      isEdit
        ? workspaceApi.updateWorkspace(currentRow.slug, data)
        : workspaceApi.createWorkspace(data),
    onSuccess: (updatedData) => {
      if (isEdit) {
        const newList = workspaces.map((w) =>
          w.id === updatedData.id ? updatedData : w
        )
        setWorkspaces(newList)
        if (activeWorkspace?.id === updatedData.id) {
          setActiveWorkspace(updatedData)
        }
      } else {
        const newList = [...workspaces, updatedData]
        setWorkspaces(newList)
        if (newList.length === 1) {
          setActiveWorkspace(updatedData)
        }
      }

      toast.success(isEdit ? 'Workspace updated' : 'Workspace created')
      onOpenChange(false)
    },
    onError: (error: AxiosError<{ detail: string }>) => {
      toast.error(error.response?.data?.detail || 'Something went wrong')
    },
  })

  const onSubmit = (values: WorkspaceForm) => {
    mutate(values)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-start'>
          <DialogTitle>
            {isEdit ? 'Edit Workspace' : 'Add New Workspace'}
          </DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update the workspace here. ' : 'Create new workspace here. '}
            Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        {/* FIXED: Removed h-80, using max-h for flexible height */}
        <div className='max-h-[60vh] w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
          <Form {...form}>
            <form
              id='workspace-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 px-0.5'
            >
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0'>
                    <FormLabel className='col-span-2 text-end text-sm font-medium'>
                      Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='my workspace'
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='slug'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0'>
                    <FormLabel className='col-span-2 text-end text-sm font-medium'>
                      Slug
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='workspace'
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='url'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0'>
                    <FormLabel className='col-span-2 text-end text-sm font-medium'>
                      URL
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='https://example.com'
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button type='submit' form='workspace-form' disabled={isPending}>
            {isPending ? 'Saving...' : 'Save changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
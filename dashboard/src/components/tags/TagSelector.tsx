'use client'

import * as React from 'react'
import { X, Check, ChevronsUpDown, Tag } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { type SelectionMode } from './types'
import { flattenTree, buildTagTree } from './tag-tree'

interface TagSelectorProps {
  tags: string[]
  mode?: SelectionMode
  selected?: string[]
  onSelectionChange?: (selected: string[]) => void
  placeholder?: string
  emptyMessage?: string
  className?: string
  disabled?: boolean
}

export function TagSelector({
  tags,
  mode = 'multiple',
  selected: controlledSelected,
  onSelectionChange,
  placeholder = 'Select tags...',
  emptyMessage = 'No tags found.',
  className,
  disabled = false,
}: TagSelectorProps) {
  const [open, setOpen] = React.useState(false)
  const [internalSelected, setInternalSelected] = React.useState<string[]>([])
  
  const isControlled = controlledSelected !== undefined
  const selected = isControlled ? controlledSelected : internalSelected

  const flatTags = React.useMemo(() => {
    const tree = buildTagTree(tags)
    return flattenTree(tree).map(n => ({
      value: n.fullPath,
      label: n.fullPath,
      depth: n.fullPath.split('.').length - 1,
    }))
  }, [tags])

  const handleSelect = React.useCallback(
    (value: string) => {
      let next: string[]
      if (mode === 'single') {
        next = selected.includes(value) ? [] : [value]
      } else {
        next = selected.includes(value)
          ? selected.filter(s => s !== value)
          : [...selected, value]
      }
      
      if (!isControlled) {
        setInternalSelected(next)
      }
      onSelectionChange?.(next)
      
      if (mode === 'single') {
        setOpen(false)
      }
    },
    [mode, selected, onSelectionChange, isControlled]
  )

  const handleRemove = React.useCallback(
    (value: string) => {
      const next = selected.filter(s => s !== value)
      if (!isControlled) {
        setInternalSelected(next)
      }
      onSelectionChange?.(next)
    },
    [selected, onSelectionChange, isControlled]
  )

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-auto min-h-10"
            disabled={disabled}
          >
            <div className="flex flex-wrap gap-1 items-center">
              {selected.length === 0 ? (
                <span className="text-muted-foreground">{placeholder}</span>
              ) : mode === 'single' ? (
                <span>{selected[0]}</span>
              ) : (
                selected.map(tag => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="mr-1"
                    onClick={e => {
                      e.stopPropagation()
                      handleRemove(tag)
                    }}
                  >
                    {tag}
                    <X className="ml-1 h-3 w-3" />
                  </Badge>
                ))
              )}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search tags..." />
            <CommandList>
              <CommandEmpty>{emptyMessage}</CommandEmpty>
              <CommandGroup>
                {flatTags.map(tag => {
                  const isSelected = selected.includes(tag.value)
                  return (
                    <CommandItem
                      key={tag.value}
                      value={tag.value}
                      onSelect={() => handleSelect(tag.value)}
                      className="flex items-center gap-2"
                    >
                      <div
                        className={cn(
                          'flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                          isSelected
                            ? 'bg-primary text-primary-foreground'
                            : 'opacity-50 [&_svg]:invisible'
                        )}
                      >
                        <Check className={cn('h-4 w-4')} />
                      </div>
                      <span
                        className="text-muted-foreground"
                        style={{ marginLeft: `${tag.depth * 12}px` }}
                      >
                        {tag.depth > 0 ? '└ ' : ''}
                      </span>
                      <Tag size={14} className="text-muted-foreground" />
                      <span>{tag.value}</span>
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
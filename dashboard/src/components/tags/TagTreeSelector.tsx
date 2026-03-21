'use client'

import * as React from 'react'
import { ChevronRight, ChevronDown, Tag, Folder, FolderOpen, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { type TagNode, type SelectionMode } from './types'
import { useTagTree } from './useTagTree'

interface TagTreeSelectorProps {
  tags: string[]
  mode?: SelectionMode
  defaultSelected?: string[]
  onSelectionChange?: (selected: string[]) => void
  className?: string
  showSelectAll?: boolean
  showExpandControls?: boolean
}

interface SelectorNodeProps {
  node: TagNode
  depth: number
  isSelected: (path: string) => boolean
  isExpanded: (path: string) => boolean
  hasChildren: boolean
  onToggleSelection: (path: string) => void
  onToggleExpand: (path: string) => void
  mode: SelectionMode
}

function SelectorNode({
  node,
  depth,
  isSelected,
  isExpanded,
  hasChildren,
  onToggleSelection,
  onToggleExpand,
  mode,
}: SelectorNodeProps) {
  const selected = isSelected(node.fullPath)
  const expanded = isExpanded(node.fullPath)

  const handleClick = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      onToggleSelection(node.fullPath)
    },
    [node.fullPath, onToggleSelection]
  )

  const handleExpand = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      onToggleExpand(node.fullPath)
    },
    [node.fullPath, onToggleExpand]
  )

  return (
    <div
      className={cn(
        'group flex items-center gap-2 py-1.5 px-2 rounded-sm transition-colors hover:bg-muted/50',
        selected && 'bg-primary/5 hover:bg-primary/10'
      )}
      style={{ paddingLeft: `${depth * 16 + 8}px` }}
    >
      {mode === 'multiple' && (
        <Checkbox
          checked={selected}
          onCheckedChange={() => onToggleSelection(node.fullPath)}
          className="shrink-0"
        />
      )}
      
      {mode === 'single' && (
        <div
          className={cn(
            'w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center',
            selected
              ? 'border-primary bg-primary'
              : 'border-muted-foreground/30'
          )}
        >
          {selected && <Check size={10} className="text-primary-foreground" />}
        </div>
      )}

      {hasChildren ? (
        <button
          onClick={handleExpand}
          className="shrink-0 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>
      ) : (
        <span className="w-4 shrink-0" />
      )}

      <div
        className="flex items-center gap-1.5 flex-1 cursor-pointer"
        onClick={handleClick}
      >
        {hasChildren ? (
          expanded ? (
            <FolderOpen size={14} className="text-primary shrink-0" />
          ) : (
            <Folder size={14} className="text-muted-foreground shrink-0" />
          )
        ) : (
          <Tag size={14} className="text-muted-foreground shrink-0" />
        )}
        <span
          className={cn(
            'text-sm',
            selected ? 'font-medium text-foreground' : 'text-muted-foreground'
          )}
        >
          {node.name}
        </span>
      </div>
    </div>
  )
}

function TreeNodeItem({
  node,
  depth,
  isSelected,
  isExpanded,
  onToggleSelection,
  onToggleExpand,
  mode,
}: {
  node: TagNode
  depth: number
  isSelected: (path: string) => boolean
  isExpanded: (path: string) => boolean
  onToggleSelection: (path: string) => void
  onToggleExpand: (path: string) => void
  mode: SelectionMode
}) {
  const hasChildren = node.children.length > 0
  const expanded = isExpanded(node.fullPath)

  return (
    <div className="select-none">
      <SelectorNode
        node={node}
        depth={depth}
        isSelected={isSelected}
        isExpanded={isExpanded}
        hasChildren={hasChildren}
        onToggleSelection={onToggleSelection}
        onToggleExpand={onToggleExpand}
        mode={mode}
      />
      {hasChildren && expanded && (
        <div>
          {node.children.map(child => (
            <TreeNodeItem
              key={child.fullPath}
              node={child}
              depth={depth + 1}
              isSelected={isSelected}
              isExpanded={isExpanded}
              onToggleSelection={onToggleSelection}
              onToggleExpand={onToggleExpand}
              mode={mode}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function TagTreeSelector({
  tags,
  mode = 'multiple',
  defaultSelected,
  onSelectionChange,
  className,
  showSelectAll = true,
  showExpandControls = true,
}: TagTreeSelectorProps) {
  const {
    tree,
    selected,
    isSelected,
    toggleSelection,
    selectAll,
    deselectAll,
    expandAll,
    collapseAll,
    isExpanded,
    toggleExpand,
  } = useTagTree({
    tags,
    mode,
    defaultSelected,
    onSelectionChange,
  })

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {(showSelectAll || showExpandControls) && (
        <div className="flex items-center gap-2 px-2 py-1 border-b pb-2">
          {showSelectAll && mode === 'multiple' && (
            <div className="flex items-center gap-2">
              <Checkbox
                checked={selected.size === tags.length && tags.length > 0}
                onCheckedChange={checked => {
                  if (checked) selectAll()
                  else deselectAll()
                }}
              />
              <span className="text-xs text-muted-foreground">
                {selected.size} selected
              </span>
            </div>
          )}
          {showExpandControls && (
            <div className="ml-auto flex items-center gap-1">
              <button
                onClick={expandAll}
                className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded hover:bg-muted transition-colors"
              >
                Expand
              </button>
              <span className="text-muted-foreground">|</span>
              <button
                onClick={collapseAll}
                className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded hover:bg-muted transition-colors"
              >
                Collapse
              </button>
            </div>
          )}
        </div>
      )}
      <div className="overflow-auto">
        {tree.map(node => (
          <TreeNodeItem
            key={node.fullPath}
            node={node}
            depth={0}
            isSelected={isSelected}
            isExpanded={isExpanded}
            onToggleSelection={toggleSelection}
            onToggleExpand={toggleExpand}
            mode={mode}
          />
        ))}
      </div>
    </div>
  )
}
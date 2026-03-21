'use client'

import { useState, useCallback, useMemo } from 'react'
import { type TagNode, type SelectionMode } from './types'
import { buildTagTree } from './tag-tree'

interface UseTagTreeProps {
  tags: string[]
  mode?: SelectionMode
  defaultSelected?: string[]
  onSelectionChange?: (selected: string[]) => void
}

interface UseTagTreeReturn {
  tree: TagNode[]
  selected: Set<string>
  isSelected: (path: string) => boolean
  toggleSelection: (path: string) => void
  select: (path: string) => void
  deselect: (path: string) => void
  selectAll: () => void
  deselectAll: () => void
  expandAll: () => void
  collapseAll: () => void
  expanded: Set<string>
  toggleExpand: (path: string) => void
  isExpanded: (path: string) => boolean
}

export function useTagTree({
  tags,
  mode = 'multiple',
  defaultSelected = [],
  onSelectionChange,
}: UseTagTreeProps): UseTagTreeReturn {
  const tree = useMemo(() => buildTagTree(tags), [tags])

  const [selected, setSelected] = useState<Set<string>>(new Set(defaultSelected))
  const [expanded, setExpanded] = useState<Set<string>>(() => {
    const allPaths = new Set<string>()
    const addPaths = (nodes: TagNode[]) => {
      for (const node of nodes) {
        if (node.children.length > 0) {
          allPaths.add(node.fullPath)
          addPaths(node.children)
        }
      }
    }
    addPaths(tree)
    return allPaths
  })

  const isSelected = useCallback((path: string) => selected.has(path), [selected])
  const isExpanded = useCallback((path: string) => expanded.has(path), [expanded])

  const toggleSelection = useCallback((path: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (mode === 'single') {
        next.clear()
        next.add(path)
      } else {
        if (next.has(path)) {
          next.delete(path)
        } else {
          next.add(path)
        }
      }
      onSelectionChange?.([...next])
      return next
    })
  }, [mode, onSelectionChange])

  const select = useCallback((path: string) => {
    setSelected(prev => {
      const next = new Set(mode === 'single' ? [] : prev)
      next.add(path)
      onSelectionChange?.([...next])
      return next
    })
  }, [mode, onSelectionChange])

  const deselect = useCallback((path: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      next.delete(path)
      onSelectionChange?.([...next])
      return next
    })
  }, [onSelectionChange])

  const selectAll = useCallback(() => {
    setSelected(new Set(tags))
    onSelectionChange?.(tags)
  }, [tags, onSelectionChange])

  const deselectAll = useCallback(() => {
    setSelected(new Set())
    onSelectionChange?.([])
  }, [onSelectionChange])

  const toggleExpand = useCallback((path: string) => {
    setExpanded(prev => {
      const next = new Set(prev)
      if (next.has(path)) {
        next.delete(path)
      } else {
        next.add(path)
      }
      return next
    })
  }, [])

  const expandAll = useCallback(() => {
    const allPaths = new Set<string>()
    const addPaths = (nodes: TagNode[]) => {
      for (const node of nodes) {
        if (node.children.length > 0) {
          allPaths.add(node.fullPath)
          addPaths(node.children)
        }
      }
    }
    addPaths(tree)
    setExpanded(allPaths)
  }, [tree])

  const collapseAll = useCallback(() => {
    setExpanded(new Set())
  }, [])

  return {
    tree,
    selected,
    isSelected,
    toggleSelection,
    select,
    deselect,
    selectAll,
    deselectAll,
    expanded,
    toggleExpand,
    isExpanded,
    expandAll,
    collapseAll,
  }
}
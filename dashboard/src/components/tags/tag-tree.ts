import { type TagNode } from './types'

export function buildTagTree(tags: string[]): TagNode[] {
  const root: TagNode[] = []
  const nodeMap = new Map<string, TagNode>()
  const sortedTags = [...tags].sort()

  for (const tag of sortedTags) {
    const parts = tag.split('.')
    let currentPath = ''

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i]
      const parentPath = currentPath
      currentPath = currentPath ? `${currentPath}.${part}` : part

      if (!nodeMap.has(currentPath)) {
        const newNode: TagNode = {
          name: part,
          fullPath: currentPath,
          children: [],
          parent: parentPath || undefined,
        }
        nodeMap.set(currentPath, newNode)

        if (i === 0) {
          root.push(newNode)
        } else {
          const parent = nodeMap.get(parentPath)
          if (parent) {
            parent.children.push(newNode)
          }
        }
      }
    }
  }

  return root
}

export function getAllDescendants(node: TagNode): string[] {
  const descendants: string[] = [node.fullPath]
  for (const child of node.children) {
    descendants.push(...getAllDescendants(child))
  }
  return descendants
}

export function findNode(tree: TagNode[], fullPath: string): TagNode | null {
  for (const node of tree) {
    if (node.fullPath === fullPath) return node
    const found = findNode(node.children, fullPath)
    if (found) return found
  }
  return null
}

export function flattenTree(nodes: TagNode[]): TagNode[] {
  const result: TagNode[] = []
  for (const node of nodes) {
    result.push(node)
    result.push(...flattenTree(node.children))
  }
  return result
}
export interface TagNode {
  name: string
  fullPath: string
  children: TagNode[]
  parent?: string
}

export type SelectionMode = 'single' | 'multiple'

export interface TagSelection {
  selected: Set<string>
  mode: SelectionMode
}
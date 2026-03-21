import * as React from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { 
  TagTree, 
  TagTreeSelector, 
  TagSelector,
  useTagTree 
} from '@/components/tags'
import { useWorkspaceTags } from './hooks/use-workspace-tags'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function TagsView() {
  const { tags: workspaceTagStrings } = useWorkspaceTags()
  const [singleSelected, setSingleSelected] = React.useState<string[]>([])
  const [multiSelected, setMultiSelected] = React.useState<string[]>([])
  const [comboSelected, setComboSelected] = React.useState<string[]>([])
  const [singleComboSelected, setSingleComboSelected] = React.useState<string[]>([])

  const { 
    tree, 
    selected: hookSelected, 
    isSelected, 
    toggleSelection,
    expandAll,
    collapseAll 
  } = useTagTree({
    tags: workspaceTagStrings,
    mode: 'multiple',
    onSelectionChange: (_selected) => undefined,
  })

  return (
    <>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='max-w-6xl space-y-6'>
        
        {/* Tabs for organized display */}
        <Tabs defaultValue="display" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="display">TagTree (Display)</TabsTrigger>
            <TabsTrigger value="multi">Tree Multi-Select</TabsTrigger>
            <TabsTrigger value="single">Tree Single-Select</TabsTrigger>
            <TabsTrigger value="combobox">Combobox Multi</TabsTrigger>
            <TabsTrigger value="custom">Custom Hook UI</TabsTrigger>
          </TabsList>

          {/* 1. Pure Display Tree */}
          <TabsContent value="display" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>TagTree - Pure Display</CardTitle>
                <CardDescription>
                  Stateless component for displaying hierarchical tags. Supports custom node rendering via renderNode prop.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md p-4 max-h-[400px] overflow-auto">
                  <TagTree tags={workspaceTagStrings} />
                </div>
              </CardContent>
            </Card>

            {/* With custom render */}
            <Card>
              <CardHeader>
                <CardTitle>TagTree - Custom Node Rendering</CardTitle>
                <CardDescription>
                  Using renderNode prop to customize how each node appears.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md p-4 max-h-[300px] overflow-auto bg-muted/30">
                  <TagTree 
                    tags={workspaceTagStrings} 
                    renderNode={({ node, depth, isExpanded, hasChildren, onToggleExpand }) => (
                      <div
                        className="flex items-center gap-2 py-1 px-2 hover:bg-accent rounded cursor-pointer"
                        style={{ paddingLeft: `${depth * 20 + 8}px` }}
                        onClick={hasChildren ? onToggleExpand : undefined}
                      >
                        {hasChildren && (
                          <span className="text-xs">{isExpanded ? '▼' : '▶'}</span>
                        )}
                        <span className="text-sm font-mono text-primary">
                          {node.name}
                        </span>
                        {hasChildren && (
                          <span className="text-xs text-muted-foreground">
                            ({node.children.length})
                          </span>
                        )}
                      </div>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 2. Tree Multi-Select */}
          <TabsContent value="multi" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>TagTreeSelector - Multiple Selection</CardTitle>
                <CardDescription>
                  Full-featured tree with checkboxes, expand/collapse controls, and select all.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border rounded-md p-4 max-h-[400px] overflow-auto">
                  <TagTreeSelector
                    tags={workspaceTagStrings}
                    mode="multiple"
                    onSelectionChange={setMultiSelected}
                    showSelectAll
                    showExpandControls
                  />
                </div>
                <div className="bg-muted p-3 rounded-md">
                  <Label className="text-xs font-mono">Selected: {JSON.stringify(multiSelected)}</Label>
                </div>
              </CardContent>
            </Card>

            {/* Without controls */}
            <Card>
              <CardHeader>
                <CardTitle>Minimal Multi-Select (No Controls)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md p-4 max-h-[300px] overflow-auto">
                  <TagTreeSelector
                    tags={workspaceTagStrings}
                    mode="multiple"
                    showSelectAll={false}
                    showExpandControls={false}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 3. Tree Single-Select */}
          <TabsContent value="single" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>TagTreeSelector - Single Selection</CardTitle>
                <CardDescription>
                  Radio-button style selection. Only one tag can be selected at a time.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border rounded-md p-4 max-h-[400px] overflow-auto">
                  <TagTreeSelector
                    tags={workspaceTagStrings}
                    mode="single"
                    onSelectionChange={setSingleSelected}
                    showExpandControls
                  />
                </div>
                <div className="bg-muted p-3 rounded-md">
                  <Label className="text-xs font-mono">Selected: {JSON.stringify(singleSelected)}</Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 4. Combobox Multi */}
          <TabsContent value="combobox" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>TagSelector - Combobox (Multiple)</CardTitle>
                <CardDescription>
                  Compact combobox with search, badges for selected items. Good for forms.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <TagSelector
                  tags={workspaceTagStrings}
                  mode="multiple"
                  selected={comboSelected}
                  onSelectionChange={setComboSelected}
                  placeholder="Select tags..."
                />
                <div className="bg-muted p-3 rounded-md">
                  <Label className="text-xs font-mono">Selected: {JSON.stringify(comboSelected)}</Label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>TagSelector - Combobox (Single)</CardTitle>
                <CardDescription>
                  Single selection mode with search.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <TagSelector
                  tags={workspaceTagStrings}
                  mode="single"
                  selected={singleComboSelected}
                  onSelectionChange={setSingleComboSelected}
                  placeholder="Choose one tag..."
                />
                <div className="bg-muted p-3 rounded-md">
                  <Label className="text-xs font-mono">Selected: {JSON.stringify(singleComboSelected)}</Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 5. Custom Hook Usage */}
          <TabsContent value="custom" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>useTagTree Hook - Custom Implementation</CardTitle>
                <CardDescription>
                  Build your own UI using the useTagTree hook for full control.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2 mb-4">
                  <button 
                    onClick={expandAll}
                    className="px-3 py-1 bg-primary text-primary-foreground rounded text-sm"
                  >
                    Expand All
                  </button>
                  <button 
                    onClick={collapseAll}
                    className="px-3 py-1 bg-secondary text-secondary-foreground rounded text-sm"
                  >
                    Collapse All
                  </button>
                </div>
                
                <div className="border rounded-md p-4 max-h-[400px] overflow-auto space-y-1">
                  {tree.map(node => (
                    <CustomNode 
                      key={node.fullPath} 
                      node={node} 
                      depth={0}
                      isSelected={isSelected}
                      onToggle={toggleSelection}
                    />
                  ))}
                </div>

                <div className="bg-muted p-3 rounded-md">
                  <Label className="text-xs font-mono">
                    Selected ({hookSelected.size}): {[...hookSelected].join(', ')}
                  </Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

      </Main>
    </>
  )
}

// Custom node component for the hook demo
function CustomNode({ 
  node, 
  depth, 
  isSelected, 
  onToggle 
}: { 
  node: import('@/components/tags/types').TagNode
  depth: number
  isSelected: (path: string) => boolean
  onToggle: (path: string) => void
}) {
  const selected = isSelected(node.fullPath)
  
  return (
    <div style={{ marginLeft: `${depth * 16}px` }}>
      <div 
        className={`
          flex items-center gap-2 py-1 px-2 rounded cursor-pointer
          ${selected ? 'bg-primary/10 text-primary' : 'hover:bg-muted'}
        `}
        onClick={() => onToggle(node.fullPath)}
      >
        <div className={`
          w-4 h-4 border rounded flex items-center justify-center text-xs
          ${selected ? 'bg-primary border-primary text-primary-foreground' : 'border-muted-foreground'}
        `}>
          {selected && '✓'}
        </div>
        <span className="text-sm">{node.name}</span>
        {node.children.length > 0 && (
          <span className="text-xs text-muted-foreground">
            ({node.children.length})
          </span>
        )}
      </div>
      {node.children.map(child => (
        <CustomNode 
          key={child.fullPath} 
          node={child} 
          depth={depth + 1}
          isSelected={isSelected}
          onToggle={onToggle}
        />
      ))}
    </div>
  )
}
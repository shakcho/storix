'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Plus, 
  Download, 
  FileText, 
  FolderOpen, 
  StickyNote, 
  Search,
  BookOpen,
  Lightbulb,
  Trash2,
  ChevronRight,
  ChevronDown
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarItem {
  id: string
  type: 'chapter' | 'research' | 'note' | 'folder'
  title: string
  children?: SidebarItem[]
  isExpanded?: boolean
}

interface SidebarOrganizerProps {
  className?: string
}

export function SidebarOrganizer({ className }: SidebarOrganizerProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [items, setItems] = useState<SidebarItem[]>([
    {
      id: '1',
      type: 'chapter',
      title: 'Chapter 1',
      children: []
    },
    {
      id: '2',
      type: 'folder',
      title: 'Research',
      isExpanded: true,
      children: [
        { id: '2-1', type: 'research', title: 'Character Profiles', children: [] },
        { id: '2-2', type: 'research', title: 'World Building', children: [] },
        { id: '2-3', type: 'research', title: 'Plot Points', children: [] }
      ]
    },
    {
      id: '3',
      type: 'folder',
      title: 'Notes',
      isExpanded: false,
      children: [
        { id: '3-1', type: 'note', title: 'Ideas', children: [] },
        { id: '3-2', type: 'note', title: 'Dialogue', children: [] },
        { id: '3-3', type: 'note', title: 'Scenes', children: [] }
      ]
    }
  ])

  const toggleExpanded = (id: string) => {
    setItems(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, isExpanded: !item.isExpanded }
          : item
      )
    )
  }

  const getIcon = (type: SidebarItem['type']) => {
    switch (type) {
      case 'chapter':
        return <FileText className="h-4 w-4" />
      case 'research':
        return <Search className="h-4 w-4" />
      case 'note':
        return <StickyNote className="h-4 w-4" />
      case 'folder':
        return <FolderOpen className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const renderItem = (item: SidebarItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = item.isExpanded

    return (
      <div key={item.id}>
        <div
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer hover:bg-accent transition-colors",
            level > 0 && "ml-4"
          )}
          onClick={() => hasChildren && toggleExpanded(item.id)}
        >
          {hasChildren && (
            <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
              {isExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </Button>
          )}
          
          <div className="flex items-center gap-2 flex-1">
            {getIcon(item.type)}
            <span className="text-sm font-medium text-foreground">{item.title}</span>
          </div>
        </div>
        
        {hasChildren && isExpanded && (
          <div className="ml-2">
            {item.children?.map(child => renderItem(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  const filteredItems = items.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.children?.some(child => 
      child.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  return (
    <div className={cn("h-full flex flex-col bg-background border-r border-border", className)}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Untitled</h2>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Plus className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-2 overflow-y-auto">
        {filteredItems.map(item => renderItem(item))}
      </div>

      {/* Story Bible Section */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground">Story Bible</h3>
          <div className="w-10 h-5 bg-primary rounded-full relative">
            <div className="w-4 h-4 bg-background rounded-full absolute top-0.5 right-0.5"></div>
          </div>
        </div>
        
        <div className="space-y-1">
          {[
            { id: 'braindump', title: 'Braindump', icon: Lightbulb },
            { id: 'genre', title: 'Genre', icon: BookOpen },
            { id: 'style', title: 'Style', icon: FileText },
            { id: 'synopsis', title: 'Synopsis', icon: FileText },
            { id: 'characters', title: 'Characters', icon: FileText },
            { id: 'worldbuilding', title: 'Worldbuilding', icon: FileText },
            { id: 'outline', title: 'Outline', icon: FileText }
          ].map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.id}
                className="flex items-center gap-2 px-2 py-1 rounded cursor-pointer hover:bg-accent transition-colors"
              >
                <Icon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-foreground">{item.title}</span>
              </div>
            )
          })}
        </div>
      </div>

    </div>
  )
}

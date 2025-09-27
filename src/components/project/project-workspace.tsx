'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { SidebarOrganizer } from '@/components/sidebar/sidebar-organizer'
import { StoryBibleSections } from '@/components/story-bible/story-bible-sections'
import { AIChat } from '@/components/chat/ai-chat'
import { 
  ArrowLeft,
  FileText,
  Download,
  Upload,
  Sparkles,
  PenTool,
  MessageSquare,
  Beaker,
  Undo,
  Redo
} from 'lucide-react'
import { RichTextEditor } from '../editor/rich-text-editor'
import { useRef } from 'react'

interface ProjectWorkspaceProps {
  projectId: string
  projectTitle?: string
  onBack?: () => void
}

export function ProjectWorkspace({ projectId, projectTitle = "Untitled", onBack }: ProjectWorkspaceProps) {
  const editorRef = useRef<any>(null)
  const [chatWidth, setChatWidth] = useState(320)

  const handleUndo = () => {
    if (editorRef.current) {
      editorRef.current.chain().focus().undo().run()
    }
  }

  const handleRedo = () => {
    if (editorRef.current) {
      editorRef.current.chain().focus().redo().run()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br">
      {/* Top Navigation Bar */}
      <div className="bg-background border-b border-border px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {onBack && (
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}
            <div className="flex items-center space-x-2">
              <FileText className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-semibold text-foreground">
                {projectTitle}
              </h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Sparkles className="h-4 w-4 mr-2" />
              Write
            </Button>
            <Button variant="ghost" size="sm">
              Rewrite
            </Button>
            <Button variant="ghost" size="sm">
              Describe
            </Button>
            <Button variant="ghost" size="sm">
              Brainstorm
            </Button>
            <Button variant="ghost" size="sm">
              More Tools
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={handleUndo}>
              <Undo className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleRedo}>
              <Redo className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground">Words: 0</span>
            <span className="text-sm text-primary">✓ Saved</span>
            <Button variant="ghost" size="sm">
              <Upload className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              ?
            </Button>
            <Button variant="ghost" size="sm">
              ⚙️
            </Button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Sidebar - Organizer */}
        <div className="w-80">
          <SidebarOrganizer />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Story Bible Content */}
          <div className="flex-1 overflow-y-auto">
            <RichTextEditor ref={editorRef} projectId={projectId} enableAutoSave={true} />
            <StoryBibleSections activeSection="" />
          </div>
          
        </div>

        {/* Right Sidebar - AI Chat */}
        <div className="relative">
          <AIChat width={chatWidth} onWidthChange={setChatWidth} projectId={projectId} />
        </div>
      </div>
    </div>
  )
}

'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'
import Typography from '@tiptap/extension-typography'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Undo,
  Redo,
  Link as LinkIcon,
  Image as ImageIcon,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState, useEffect, forwardRef, useImperativeHandle, useCallback, useRef } from 'react'
import { projectApi } from '@/lib/api'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu'
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Sparkles, PenTool, RefreshCw, FileText } from 'lucide-react'

interface AIOptions {
  creativity: number
  length: number
  proseMode: string
  keyDetails: string
}

interface RichTextEditorProps {
  content?: string
  placeholder?: string
  onChange?: (content: string) => void
  onWordCountChange?: (count: number) => void
  className?: string
  editable?: boolean
  projectId?: string
  chapterId?: string
  enableAutoSave?: boolean
}

export const RichTextEditor = forwardRef<any, RichTextEditorProps>(({ 
  content = '', 
  placeholder = 'Start writing...',
  onChange,
  onWordCountChange,
  className,
  editable = true,
  projectId,
  chapterId,
  enableAutoSave = true
}, ref) => {
  const [showFloatingToolbar, setShowFloatingToolbar] = useState(false)
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 })
  const [selectedText, setSelectedText] = useState('')
  const [showAIOptions, setShowAIOptions] = useState(false)
  const [aiAction, setAiAction] = useState<'write' | 'rewrite' | 'describe' | null>(null)
  const [aiOptions, setAiOptions] = useState<AIOptions>({
    creativity: 5,
    length: 100,
    proseMode: 'balanced',
    keyDetails: ''
  })
  const [isAILoading, setIsAILoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const autoSave = useCallback(async (content: string) => {
    if (!enableAutoSave || !projectId || !content) return

    try {
      setIsSaving(true)
      
      if (chapterId) {
        // Save to chapter
        await projectApi.updateChapter(projectId, chapterId, { content })
      } else {
        // Save to project content
        await projectApi.updateContent(projectId, content)
      }
      
      setLastSaved(new Date())
    } catch (error) {
      console.error('Error auto-saving:', error)
    } finally {
      setIsSaving(false)
    }
  }, [enableAutoSave, projectId, chapterId])

  const debouncedSave = useCallback((content: string) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }
    
    saveTimeoutRef.current = setTimeout(() => {
      autoSave(content)
    }, 2000) // Save after 2 seconds of inactivity
  }, [autoSave])

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      CharacterCount.configure({
        limit: 1000000, // 1M characters
      }),
      Typography,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline cursor-pointer',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
    ],
    content,
    editable,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      const wordCount = editor.storage.characterCount.words()
      
      onChange?.(html)
      onWordCountChange?.(wordCount)
      
      // Auto-save if enabled
      if (enableAutoSave && projectId) {
        debouncedSave(html)
      }
    },
    onSelectionUpdate: ({ editor }) => {
      const { from, to } = editor.state.selection
      const isEmpty = from === to
      
      if (!isEmpty && editable) {
        // Get selected text
        const selectedText = editor.state.doc.textBetween(from, to, ' ')
        setSelectedText(selectedText)
        
        setShowFloatingToolbar(true)
        
        // Calculate toolbar position
        const { view } = editor
        const { state } = view
        const { selection } = state
        const { $from } = selection
        
        const coords = view.coordsAtPos($from.pos)
        const editorRect = view.dom.getBoundingClientRect()
        
        // Calculate toolbar position closer to selection
        const toolbarHeight = 40 // Approximate toolbar height
        const toolbarWidth = 400 // Width for all formatting buttons + AI menu
        
        let top = coords.top - editorRect.top - toolbarHeight - 10
        let left = coords.left - editorRect.left - (toolbarWidth / 2)
        
        // Boundary checks
        if (top < 10) {
          top = coords.bottom - editorRect.top + 10 // Show below selection if too close to top
        }
        if (left < 10) {
          left = 10
        } else if (left + toolbarWidth > editorRect.width - 10) {
          left = editorRect.width - toolbarWidth - 10
        }
        
        setToolbarPosition({ top, left })
      } else {
        setShowFloatingToolbar(false)
        setSelectedText('')
      }
    },
  })

  useImperativeHandle(ref, () => editor, [editor])

  // AI Service Functions
  const callAIService = async (action: 'write' | 'rewrite' | 'describe', text: string, options: AIOptions) => {
    setIsAILoading(true)
    
    try {
      // Simulate AI API call - replace with actual API call
      const prompt = generatePrompt(action, text, options)
      
      // Mock response - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      let response = ''
      switch (action) {
        case 'write':
          response = `Here's a creative piece based on your request: "${text}". The writing flows naturally with ${options.proseMode} prose style, incorporating the key details you provided.`
          break
        case 'rewrite':
          response = `Here's a rewritten version of your text: "${text}". I've enhanced it with better flow, improved clarity, and more engaging language while maintaining your original meaning.`
          break
        case 'describe':
          response = `Here's a detailed description based on: "${text}". I've expanded this into a rich, vivid description that brings the scene to life with sensory details and atmospheric elements.`
          break
      }
      
      // Replace selected text with AI response
      if (editor) {
        const { from, to } = editor.state.selection
        editor.chain().focus().deleteRange({ from, to }).insertContent(response).run()
      }
      
    } catch (error) {
      console.error('AI service error:', error)
      // Handle error - could show toast notification
    } finally {
      setIsAILoading(false)
      setShowAIOptions(false)
      setAiAction(null)
    }
  }

  const generatePrompt = (action: 'write' | 'rewrite' | 'describe', text: string, options: AIOptions) => {
    const creativityLevel = options.creativity === 1 ? 'very conservative' : 
                          options.creativity === 10 ? 'highly creative' : 
                          options.creativity <= 3 ? 'conservative' :
                          options.creativity <= 7 ? 'balanced' : 'creative'
    
    const proseStyle = options.proseMode === 'formal' ? 'formal academic style' :
                      options.proseMode === 'casual' ? 'casual conversational style' :
                      options.proseMode === 'poetic' ? 'poetic lyrical style' :
                      'balanced professional style'
    
    let basePrompt = ''
    switch (action) {
      case 'write':
        basePrompt = `Write new content based on: "${text}". `
        break
      case 'rewrite':
        basePrompt = `Rewrite and improve this text: "${text}". `
        break
      case 'describe':
        basePrompt = `Create a detailed description based on: "${text}". `
        break
    }
    
    return `${basePrompt}Use a ${creativityLevel} approach with ${proseStyle}. Target approximately ${options.length} words. ${options.keyDetails ? `Additional context: ${options.keyDetails}` : ''}`
  }

  const handleAIAction = (action: 'write' | 'rewrite' | 'describe') => {
    setAiAction(action)
    setShowAIOptions(true)
  }

  if (!editor) {
    return (
      <div className={cn("bg-background h-full flex flex-col", className)}>
        <div className="flex-1 p-4">
          <div className="animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </div>
        </div>
      </div>
    )
  }

  const ToolbarButton = ({ 
    onClick, 
    isActive = false, 
    disabled = false, 
    children,
    className
  }: {
    onClick: () => void
    isActive?: boolean
    disabled?: boolean
    children: React.ReactNode
    className?: string
  }) => (
    <Button
      variant={isActive ? "default" : "ghost"}
      size="sm"
      onClick={onClick}
      disabled={disabled}
      className={cn("h-8 w-8 p-0", className)}
    >
      {children}
    </Button>
  )

  return (
    <div className={cn("bg-background relative h-full flex flex-col", className)}>
      {/* Floating Toolbar */}
      {editable && showFloatingToolbar && (
        <div
          className="absolute z-[9999] bg-popover text-popover-foreground border border-border rounded-lg shadow-xl p-2 flex items-center gap-1 animate-in fade-in-0 zoom-in-95 duration-200"
          style={{
            top: `${toolbarPosition.top}px`,
            left: `${toolbarPosition.left}px`,
          }}
        >
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            className="text-popover-foreground hover:bg-accent"
          >
            <Bold className="h-4 w-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
            className="text-popover-foreground hover:bg-accent"
          >
            <Italic className="h-4 w-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive('strike')}
            className="text-popover-foreground hover:bg-accent"
          >
            <Strikethrough className="h-4 w-4" />
          </ToolbarButton>
          
          <div className="w-px h-6 bg-border mx-1" />
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            isActive={editor.isActive('heading', { level: 1 })}
            className="text-popover-foreground hover:bg-accent"
          >
            <Heading1 className="h-4 w-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive('heading', { level: 2 })}
            className="text-popover-foreground hover:bg-accent"
          >
            <Heading2 className="h-4 w-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            isActive={editor.isActive('heading', { level: 3 })}
            className="text-popover-foreground hover:bg-accent"
          >
            <Heading3 className="h-4 w-4" />
          </ToolbarButton>
          
          <div className="w-px h-6 bg-border mx-1" />
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
            className="text-popover-foreground hover:bg-accent"
          >
            <List className="h-4 w-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
            className="text-popover-foreground hover:bg-accent"
          >
            <ListOrdered className="h-4 w-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive('blockquote')}
            className="text-popover-foreground hover:bg-accent"
          >
            <Quote className="h-4 w-4" />
          </ToolbarButton>
          
          <div className="w-px h-6 bg-border mx-1" />
          
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="text-popover-foreground hover:bg-accent disabled:opacity-50"
          >
            <Undo className="h-4 w-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="text-popover-foreground hover:bg-accent disabled:opacity-50"
          >
            <Redo className="h-4 w-4" />
          </ToolbarButton>
          
          <div className="w-px h-6 bg-border mx-1" />
          
          {/* AI Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-3 text-popover-foreground hover:bg-accent"
                disabled={isAILoading}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                AI
                {isAILoading && <div className="ml-2 w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuLabel>AI Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleAIAction('write')}>
                <PenTool className="h-4 w-4 mr-2" />
                Write
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAIAction('rewrite')}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Rewrite
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAIAction('describe')}>
                <FileText className="h-4 w-4 mr-2" />
                Describe
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
      
      {/* Toolbar Caret */}
      {editable && showFloatingToolbar && (
        <div
          className="absolute z-[9999]"
          style={{
            top: `${toolbarPosition.top + 40}px`,
            left: `${toolbarPosition.left + 200}px`,
          }}
        >
          <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-popover"></div>
        </div>
      )}

      {/* AI Options Dialog */}
      <Dialog open={showAIOptions} onOpenChange={setShowAIOptions}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              AI {aiAction === 'write' ? 'Write' : aiAction === 'rewrite' ? 'Rewrite' : 'Describe'} Options
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Selected Text Preview */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Selected Text</Label>
              <div className="p-3 bg-muted rounded-md text-sm text-muted-foreground max-h-20 overflow-y-auto">
                {selectedText || 'No text selected'}
              </div>
            </div>

            {/* Creativity Slider */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Creativity Level</Label>
              <div className="space-y-2">
                <Slider
                  value={[aiOptions.creativity]}
                  onValueChange={(value: number[]) => setAiOptions(prev => ({ ...prev, creativity: value[0] }))}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Conservative</span>
                  <span className="font-medium">{aiOptions.creativity}/10</span>
                  <span>Creative</span>
                </div>
              </div>
            </div>

            {/* Length Input */}
            <div className="space-y-2">
              <Label htmlFor="length" className="text-sm font-medium">Length (words)</Label>
              <Input
                id="length"
                type="number"
                value={aiOptions.length}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAiOptions(prev => ({ ...prev, length: parseInt(e.target.value) || 100 }))}
                min={10}
                max={1000}
                className="w-full"
              />
            </div>

            {/* Prose Mode Select */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Prose Mode</Label>
              <Select
                value={aiOptions.proseMode}
                onValueChange={(value: string) => setAiOptions(prev => ({ ...prev, proseMode: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="balanced">Balanced</SelectItem>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="poetic">Poetic</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Key Details Textarea */}
            <div className="space-y-2">
              <Label htmlFor="keyDetails" className="text-sm font-medium">Key Details (Optional)</Label>
              <Textarea
                id="keyDetails"
                placeholder="Add any specific context, style preferences, or additional details..."
                value={aiOptions.keyDetails}
                onChange={(e) => setAiOptions(prev => ({ ...prev, keyDetails: e.target.value }))}
                className="min-h-[80px] resize-none"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAIOptions(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => aiAction && callAIService(aiAction, selectedText, aiOptions)}
              disabled={isAILoading || !selectedText.trim()}
            >
              {isAILoading ? (
                <>
                  <div className="mr-2 w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                `Apply ${aiAction === 'write' ? 'Write' : aiAction === 'rewrite' ? 'Rewrite' : 'Describe'}`
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Editor Content */}
      <div className="flex-1 overflow-auto">
        <EditorContent 
          editor={editor} 
          className="prose prose-sm max-w-none focus:outline-none h-full [&_.ProseMirror]:outline-none [&_.ProseMirror]:focus:outline-none [&_.ProseMirror]:min-h-full [&_.ProseMirror]:cursor-text [&_.ProseMirror]:h-full [&_.ProseMirror]:p-4 [&_.ProseMirror]:m-0"
        />
      </div>
      
      {/* Status Bar */}
      {editable && (
        <div className="border-t border-border px-4 py-2 flex items-center justify-between text-sm text-muted-foreground flex-shrink-0">
          <div className="flex items-center gap-4">
            <span>Words: {editor.storage.characterCount.words()}</span>
            <span>Characters: {editor.storage.characterCount.characters()}</span>
          </div>
          <div className="flex items-center gap-2">
            {isSaving ? (
              <span className="text-yellow-600">Saving...</span>
            ) : lastSaved ? (
              <span className="text-primary">✓ Saved</span>
            ) : (
              <span className="text-muted-foreground">Not saved</span>
            )}
          </div>
        </div>
      )}
    </div>
  )
})

RichTextEditor.displayName = 'RichTextEditor'

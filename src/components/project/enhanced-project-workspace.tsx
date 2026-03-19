'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { StoryEditorWrapper } from '@/components/editor/story-editor-wrapper'
import { AIChat } from '@/components/chat/ai-chat'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft,
  Sparkles,
  Save,
  Eye,
  EyeOff,
  Menu,
  X,
  Feather,
  BookOpen,
  Users,
  MessageSquare,
  Settings,
  Maximize2,
  Minimize2,
  Plus,
  ChevronRight,
  ChevronDown,
  FileText,
  Globe,
  Lightbulb,
  Search,
  MoreVertical,
  Edit3,
  Trash2,
  FolderOpen,
  StickyNote
} from 'lucide-react'
import { RichTextEditor } from '../editor/rich-text-editor'
import { cn } from '@/lib/utils'

interface Chapter {
  id: string
  title: string
  wordCount: number
  order: number
}

interface StoryBibleItem {
  id: string
  type: 'character' | 'location' | 'lore' | 'note'
  title: string
  icon: typeof Users
}

interface ProjectWorkspaceProps {
  projectId: string
  projectTitle?: string
  onBack?: () => void
}

type ViewMode = 'write' | 'bible' | 'research'

export function EnhancedProjectWorkspace({ projectId, projectTitle = "Untitled", onBack }: ProjectWorkspaceProps) {
  const editorRef = useRef<any>(null)
  const [wordCount, setWordCount] = useState(0)
  const [showToolbar, setShowToolbar] = useState(true)
  const [showLeftSidebar, setShowLeftSidebar] = useState(true)
  const [showAIChat, setShowAIChat] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isFocusMode, setIsFocusMode] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date>(new Date())
  const [viewMode, setViewMode] = useState<ViewMode>('write')
  const [activeChapterId, setActiveChapterId] = useState<string>('1')
  const [chatWidth, setChatWidth] = useState(380)

  // Mock data - replace with real data from API
  const [chapters, setChapters] = useState<Chapter[]>([
    { id: '1', title: 'Chapter 1: The Beginning', wordCount: 2340, order: 1 },
    { id: '2', title: 'Chapter 2: Discovery', wordCount: 1890, order: 2 },
    { id: '3', title: 'Chapter 3', wordCount: 0, order: 3 },
  ])

  const [storyBibleItems] = useState<StoryBibleItem[]>([
    { id: '1', type: 'character', title: 'Main Characters', icon: Users },
    { id: '2', type: 'location', title: 'World Map', icon: Globe },
    { id: '3', type: 'lore', title: 'Magic System', icon: Sparkles },
    { id: '4', type: 'note', title: 'Plot Ideas', icon: Lightbulb },
  ])

  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['chapters', 'bible']))

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diff < 60) return 'Just now'
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return date.toLocaleDateString()
  }

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev)
      if (newSet.has(section)) {
        newSet.delete(section)
      } else {
        newSet.add(section)
      }
      return newSet
    })
  }

  const addNewChapter = () => {
    const newChapter: Chapter = {
      id: Date.now().toString(),
      title: `Chapter ${chapters.length + 1}`,
      wordCount: 0,
      order: chapters.length + 1
    }
    setChapters([...chapters, newChapter])
    setActiveChapterId(newChapter.id)
  }

  const activeChapter = chapters.find(c => c.id === activeChapterId)

  return (
    <div className={cn(
      "min-h-screen bg-background relative overflow-hidden transition-all duration-300",
      isFullscreen && "fixed inset-0 z-50"
    )}>
      {/* Ambient background effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-background via-background to-accent/5 pointer-events-none" />
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-primary/3 rounded-full blur-[150px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Navigation Bar */}
      <AnimatePresence>
        {(!isFocusMode || showToolbar) && (
          <motion.header
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 right-0 z-40 bg-card/80 backdrop-blur-xl border-b border-border/50"
          >
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                {/* Left Section */}
                <div className="flex items-center gap-4">
                  <motion.div whileHover={{ x: -2 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => setShowLeftSidebar(!showLeftSidebar)}
                    >
                      <Menu className="h-5 w-5" />
                    </Button>
                  </motion.div>

                  {onBack && !isFullscreen && (
                    <motion.div whileHover={{ x: -2 }} whileTap={{ scale: 0.95 }}>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={onBack}
                        className="gap-2"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Dashboard
                      </Button>
                    </motion.div>
                  )}
                  
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Feather className="h-6 w-6 text-primary" />
                      <motion.div
                        className="absolute inset-0 blur-lg bg-primary/30"
                        animate={{ 
                          scale: [1, 1.2, 1],
                          opacity: [0.3, 0.5, 0.3]
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    </div>
                    <div>
                      <h1 className="text-xl font-bold tracking-tight">
                        {projectTitle}
                      </h1>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{activeChapter?.title}</span>
                        <span>•</span>
                        <span>{wordCount.toLocaleString()} words</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Save className="h-3 w-3" />
                          {formatTime(lastSaved)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Center Section - View Mode Tabs */}
                <motion.div 
                  className="flex items-center gap-2 bg-secondary/50 p-1 rounded-lg"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Button 
                    variant={viewMode === 'write' ? 'default' : 'ghost'} 
                    size="sm" 
                    onClick={() => setViewMode('write')}
                    className="gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    Write
                  </Button>
                  <Button 
                    variant={viewMode === 'bible' ? 'default' : 'ghost'} 
                    size="sm" 
                    onClick={() => setViewMode('bible')}
                    className="gap-2"
                  >
                    <BookOpen className="h-4 w-4" />
                    Story Bible
                  </Button>
                  <Button 
                    variant={viewMode === 'research' ? 'default' : 'ghost'} 
                    size="sm" 
                    onClick={() => setViewMode('research')}
                    className="gap-2"
                  >
                    <Search className="h-4 w-4" />
                    Research
                  </Button>
                </motion.div>

                {/* Right Section */}
                <div className="flex items-center gap-3">
                  <Badge 
                    variant="secondary" 
                    className="gap-1 bg-primary/10 text-primary border-0"
                  >
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    Auto-saved
                  </Badge>

                  <div className="flex items-center gap-2">
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant={showAIChat ? 'default' : 'ghost'}
                        size="icon"
                        onClick={() => setShowAIChat(!showAIChat)}
                        className="relative"
                      >
                        <Sparkles className="h-5 w-5" />
                      </Button>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsFocusMode(!isFocusMode)}
                      >
                        {isFocusMode ? (
                          <Eye className="h-5 w-5" />
                        ) : (
                          <EyeOff className="h-5 w-5" />
                        )}
                      </Button>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsFullscreen(!isFullscreen)}
                      >
                        {isFullscreen ? (
                          <Minimize2 className="h-5 w-5" />
                        ) : (
                          <Maximize2 className="h-5 w-5" />
                        )}
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className={cn(
        "relative flex transition-all duration-300",
        (!isFocusMode || showToolbar) ? "pt-24" : "pt-8"
      )}>
        {/* Left Sidebar - Navigator */}
        <AnimatePresence>
          {showLeftSidebar && !isFocusMode && (
            <motion.aside
              initial={{ x: -320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -320, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed left-0 w-80 h-[calc(100vh-6rem)] bg-card/80 backdrop-blur-xl border-r border-border/50 overflow-y-auto z-30"
            >
              <div className="p-6 space-y-6">
                {/* Chapters Section */}
                <div>
                  <div 
                    className="flex items-center justify-between mb-3 cursor-pointer"
                    onClick={() => toggleSection('chapters')}
                  >
                    <div className="flex items-center gap-2">
                      {expandedSections.has('chapters') ? (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      )}
                      <h3 className="text-sm font-semibold">Chapters</h3>
                    </div>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); addNewChapter(); }}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <AnimatePresence>
                    {expandedSections.has('chapters') && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="space-y-1"
                      >
                        {chapters.map((chapter) => (
                          <motion.div
                            key={chapter.id}
                            whileHover={{ x: 4 }}
                            className={cn(
                              "flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors group",
                              activeChapterId === chapter.id 
                                ? "bg-primary/10 text-primary" 
                                : "hover:bg-secondary/50"
                            )}
                            onClick={() => setActiveChapterId(chapter.id)}
                          >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <FileText className="h-4 w-4 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium truncate">
                                  {chapter.title}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {chapter.wordCount.toLocaleString()} words
                                </div>
                              </div>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-7 w-7 opacity-0 group-hover:opacity-100"
                              onClick={(e) => { e.stopPropagation(); }}
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Story Bible Section */}
                <div>
                  <div 
                    className="flex items-center justify-between mb-3 cursor-pointer"
                    onClick={() => toggleSection('bible')}
                  >
                    <div className="flex items-center gap-2">
                      {expandedSections.has('bible') ? (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      )}
                      <h3 className="text-sm font-semibold">Story Bible</h3>
                    </div>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <AnimatePresence>
                    {expandedSections.has('bible') && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="space-y-1"
                      >
                        {storyBibleItems.map((item) => {
                          const Icon = item.icon
                          return (
                            <motion.div
                              key={item.id}
                              whileHover={{ x: 4 }}
                              className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors"
                              onClick={() => setViewMode('bible')}
                            >
                              <Icon className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{item.title}</span>
                            </motion.div>
                          )
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Research Section */}
                <div>
                  <div 
                    className="flex items-center justify-between mb-3 cursor-pointer"
                    onClick={() => toggleSection('research')}
                  >
                    <div className="flex items-center gap-2">
                      {expandedSections.has('research') ? (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      )}
                      <h3 className="text-sm font-semibold">Research</h3>
                    </div>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <AnimatePresence>
                    {expandedSections.has('research') && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="space-y-1"
                      >
                        {[
                          { id: '1', title: 'Historical Notes', icon: FolderOpen },
                          { id: '2', title: 'Character References', icon: StickyNote },
                          { id: '3', title: 'Plot Outline', icon: FileText },
                        ].map((item) => {
                          const Icon = item.icon
                          return (
                            <motion.div
                              key={item.id}
                              whileHover={{ x: 4 }}
                              className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors"
                              onClick={() => setViewMode('research')}
                            >
                              <Icon className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{item.title}</span>
                            </motion.div>
                          )
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Quick Stats */}
                <div className="pt-4 border-t border-border/50">
                  <h3 className="text-sm font-semibold mb-3">Project Stats</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Words</span>
                      <span className="font-medium">{chapters.reduce((sum, ch) => sum + ch.wordCount, 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Chapters</span>
                      <span className="font-medium">{chapters.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Characters</span>
                      <span className="font-medium">8</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Writing/Content Area */}
        <motion.div 
          className={cn(
            "flex-1 transition-all duration-300",
            showLeftSidebar && !isFocusMode ? "ml-80" : "ml-0",
            showAIChat ? "mr-[380px]" : "mr-0"
          )}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="max-w-5xl mx-auto px-8 pb-32">
            {/* Writing Paper Effect */}
            <div className="relative">
              {/* Paper glow */}
              <div className="absolute -inset-4 bg-card/30 rounded-3xl blur-2xl" />
              
              {/* Main editor card */}
              <motion.div 
                className="relative bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 shadow-2xl overflow-hidden"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {/* Subtle paper texture overlay */}
                <div className="absolute inset-0 opacity-[0.02] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuOSIgbnVtT2N0YXZlcz0iNCIgLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjbm9pc2UpIiAvPjwvc3ZnPg==')] pointer-events-none" />

                {/* Content based on view mode */}
                <StoryEditorWrapper className="min-h-[80vh]">
                  <div className="p-12">
                    {viewMode === 'write' && (
                      <RichTextEditor
                        ref={editorRef}
                        projectId={projectId}
                        chapterId={activeChapterId}
                        enableAutoSave={true}
                        onWordCountChange={setWordCount}
                        placeholder="Begin your story..."
                        className="prose-writer"
                      />
                    )}

                    {viewMode === 'bible' && (
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-3xl font-bold mb-2">Story Bible</h2>
                          <p className="text-muted-foreground">
                            Build your world, characters, and lore
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          {storyBibleItems.map((item) => {
                            const Icon = item.icon
                            return (
                              <div
                                key={item.id}
                                className="p-6 rounded-xl border border-border/50 bg-card/30 hover:bg-card/50 transition-colors cursor-pointer group"
                              >
                                <Icon className="h-8 w-8 text-primary mb-3" />
                                <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                                  {item.title}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  Click to edit
                                </p>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {viewMode === 'research' && (
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-3xl font-bold mb-2">Research & Notes</h2>
                          <p className="text-muted-foreground">
                            Organize your reference materials
                          </p>
                        </div>
                        <Button className="gap-2">
                          <Plus className="h-4 w-4" />
                          Add New Research Note
                        </Button>
                        <div className="space-y-3">
                          {['Historical Notes', 'Character References', 'Plot Outline'].map((title) => (
                            <div
                              key={title}
                              className="p-4 rounded-xl border border-border/50 bg-card/30 hover:bg-card/50 transition-colors cursor-pointer"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <FileText className="h-5 w-5 text-primary" />
                                  <span className="font-medium">{title}</span>
                                </div>
                                <span className="text-sm text-muted-foreground">Last edited today</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </StoryEditorWrapper>
              </motion.div>
            </div>

            {/* Floating Word Count */}
            <AnimatePresence>
              {viewMode === 'write' && wordCount > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="fixed bottom-8 right-8 z-30"
                  style={{ right: showAIChat ? '404px' : '32px' }}
                >
                  <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-xl px-6 py-4 shadow-xl">
                    <div className="text-sm text-muted-foreground mb-1">Chapter Progress</div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-primary">{wordCount.toLocaleString()}</span>
                      <span className="text-sm text-muted-foreground">words</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Focus Mode Indicator */}
            <AnimatePresence>
              {isFocusMode && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="fixed bottom-8 left-8 z-30"
                >
                  <div className="bg-primary/10 backdrop-blur-xl border border-primary/30 rounded-xl px-4 py-2">
                    <div className="flex items-center gap-2 text-sm text-primary">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      Focus Mode
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Right Sidebar - AI Chat */}
        <AnimatePresence>
          {showAIChat && (
            <motion.div
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed right-0 top-24 bottom-0 z-30"
            >
              <AIChat 
                width={chatWidth} 
                onWidthChange={setChatWidth} 
                projectId={projectId} 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}


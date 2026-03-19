'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StoryEditorWrapper } from '@/components/editor/story-editor-wrapper'
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
  Minimize2
} from 'lucide-react'
import { RichTextEditor } from '../editor/rich-text-editor'
import { useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface ProjectWorkspaceProps {
  projectId: string
  projectTitle?: string
  onBack?: () => void
}

export function ProjectWorkspace({ projectId, projectTitle = "Untitled", onBack }: ProjectWorkspaceProps) {
  const editorRef = useRef<any>(null)
  const [wordCount, setWordCount] = useState(0)
  const [showToolbar, setShowToolbar] = useState(true)
  const [showSidebar, setShowSidebar] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isFocusMode, setIsFocusMode] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date>(new Date())

  // Auto-hide toolbar on scroll
  useEffect(() => {
    if (isFocusMode) return
    
    let timeout: NodeJS.Timeout
    const handleScroll = () => {
      setShowToolbar(true)
      clearTimeout(timeout)
      timeout = setTimeout(() => setShowToolbar(false), 2000)
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(timeout)
    }
  }, [isFocusMode])

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diff < 60) return 'Just now'
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return date.toLocaleDateString()
  }

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
                  {onBack && !isFullscreen && (
                    <motion.div whileHover={{ x: -2 }} whileTap={{ scale: 0.95 }}>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={onBack}
                        className="gap-2"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Back
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

                {/* Center Section - AI Tools */}
                <motion.div 
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="gap-2"
                  >
                    <Sparkles className="h-4 w-4 text-primary" />
                    AI Assist
                  </Button>
                  <div className="w-px h-6 bg-border" />
                  <Button variant="ghost" size="sm">Write</Button>
                  <Button variant="ghost" size="sm">Rewrite</Button>
                  <Button variant="ghost" size="sm">Describe</Button>
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
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsFocusMode(!isFocusMode)}
                        className="relative"
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

                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowSidebar(!showSidebar)}
                      >
                        {showSidebar ? (
                          <X className="h-5 w-5" />
                        ) : (
                          <Menu className="h-5 w-5" />
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

      {/* Main Writing Area */}
      <div className={cn(
        "relative transition-all duration-300",
        (!isFocusMode || showToolbar) ? "pt-24" : "pt-8"
      )}>
        <motion.div 
          className="max-w-5xl mx-auto px-8 pb-32"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
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

              {/* Editor with font wrapper */}
              <StoryEditorWrapper className="min-h-[80vh]">
                <div className="p-12">
                  <RichTextEditor
                    ref={editorRef}
                    projectId={projectId}
                    enableAutoSave={true}
                    onWordCountChange={setWordCount}
                    placeholder="Begin your story..."
                    className="prose-writer"
                  />
                </div>
              </StoryEditorWrapper>
            </motion.div>
          </div>

          {/* Floating Word Count */}
          <AnimatePresence>
            {wordCount > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="fixed bottom-8 right-8 z-30"
              >
                <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-xl px-6 py-4 shadow-xl">
                  <div className="text-sm text-muted-foreground mb-1">Progress</div>
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
        </motion.div>
      </div>

      {/* Right Sidebar - Quick Actions */}
      <AnimatePresence>
        {showSidebar && (
          <motion.aside
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed right-0 top-0 bottom-0 w-80 bg-card/80 backdrop-blur-xl border-l border-border/50 z-30 overflow-y-auto"
          >
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">Quick Access</h2>
                <Button variant="ghost" size="icon" onClick={() => setShowSidebar(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-3 h-12"
                >
                  <BookOpen className="h-5 w-5 text-primary" />
                  <span>Story Bible</span>
                </Button>

                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-3 h-12"
                >
                  <Users className="h-5 w-5 text-blue-500" />
                  <span>Characters</span>
                </Button>

                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-3 h-12"
                >
                  <MessageSquare className="h-5 w-5 text-purple-500" />
                  <span>AI Chat</span>
                </Button>

                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-3 h-12"
                >
                  <Settings className="h-5 w-5 text-rose-500" />
                  <span>Settings</span>
                </Button>
              </div>

              <div className="pt-6 border-t border-border/50">
                <h3 className="text-sm font-semibold mb-3">Today's Goal</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{Math.min(100, Math.round((wordCount / 500) * 100))}%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary to-primary/80"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (wordCount / 500) * 100)}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {wordCount} / 500 words today
                  </p>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Keyboard Shortcuts Hint */}
      {!isFocusMode && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-20"
        >
          <div className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-lg px-4 py-2 text-xs text-muted-foreground">
            Press <kbd className="px-2 py-1 bg-secondary rounded text-foreground">Ctrl</kbd> + <kbd className="px-2 py-1 bg-secondary rounded text-foreground">F</kbd> for Focus Mode
          </div>
        </motion.div>
      )}
    </div>
  )
}

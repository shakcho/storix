'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { chatApi, ApiError } from '@/lib/api'
import {
  Send,
  Plus,
  MoreHorizontal,
  Bot,
  User,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Settings,
  MessageSquare,
  Trash2,
  Edit3,
  Sparkles,
  History,
  Search,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  isTyping?: boolean
}

interface Conversation {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: Date
  updatedAt: Date
}

interface AIChatProps {
  className?: string
  width?: number
  onWidthChange?: (width: number) => void
  projectId?: string
}

export function AIChat({ className, width = 320, onWidthChange, projectId }: AIChatProps) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingConversationId, setEditingConversationId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  const activeConversation = conversations.find(c => c.id === activeConversationId)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [activeConversation?.messages])

  // Load conversations when projectId changes
  useEffect(() => {
    if (projectId) {
      loadConversations()
    }
  }, [projectId])

  const loadConversations = async () => {
    if (!projectId) return

    try {
      setIsLoading(true)
      const chats = await chatApi.getProjectChats(projectId)

      // Transform backend data to frontend format
      const transformedChats: Conversation[] = (chats as any[]).map((chat: any) => ({
        id: chat.id,
        title: chat.title,
        messages: chat.messages || [],
        createdAt: new Date(chat.createdAt),
        updatedAt: new Date(chat.updatedAt)
      }))

      setConversations(transformedChats)

      // Set first chat as active if none is selected
      if (transformedChats.length > 0 && !activeConversationId) {
        setActiveConversationId(transformedChats[0].id)
      }
    } catch (error) {
      console.error('Error loading conversations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Cleanup resize state on unmount
  useEffect(() => {
    return () => {
      if (isResizing) {
        document.body.style.cursor = ''
        document.body.style.userSelect = ''
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isResizing])

  const createNewConversation = async () => {
    if (!projectId) return

    try {
      const newChat = await chatApi.create({
        projectId,
        title: 'New Chat'
      })

      const newConversation: Conversation = {
        id: (newChat as any).id,
        title: (newChat as any).title,
        messages: (newChat as any).messages || [],
        createdAt: new Date((newChat as any).createdAt),
        updatedAt: new Date((newChat as any).updatedAt)
      }

      setConversations(prev => [newConversation, ...prev])
      setActiveConversationId(newConversation.id)
    } catch (error) {
      console.error('Error creating conversation:', error)
    }
  }

  const sendMessage = async (content: string) => {
    if (!content.trim() || !activeConversation || !activeConversationId) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    }

    // Update conversation with user message
    setConversations(prev => prev.map(conv =>
      conv.id === activeConversationId
        ? { ...conv, messages: [...conv.messages, userMessage], updatedAt: new Date() }
        : conv
    ))

    setInputValue('')
    setIsTyping(true)

    try {
      // Send message to backend
      await chatApi.sendMessage(activeConversationId, content.trim())

      // Simulate AI response (replace with actual AI service call)
      setTimeout(async () => {
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: "That's an interesting question! Let me help you with that. Based on what you've shared, I'd suggest considering the following aspects:\n\n1. **Character Development**: Think about your protagonist's motivations and how they drive the story forward.\n\n2. **Plot Structure**: Consider the three-act structure or whatever framework works best for your genre.\n\n3. **World-building**: Make sure your setting supports and enhances your story.\n\nWould you like me to elaborate on any of these points, or do you have specific questions about your project?",
          timestamp: new Date()
        }

        // Send AI response to backend
        await chatApi.sendMessage(activeConversationId, aiMessage.content, 'assistant')

        setConversations(prev => prev.map(conv =>
          conv.id === activeConversationId
            ? { ...conv, messages: [...conv.messages, aiMessage], updatedAt: new Date() }
            : conv
        ))
        setIsTyping(false)
      }, 2000)
    } catch (error) {
      console.error('Error sending message:', error)
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(inputValue)
    }
  }

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  const deleteConversation = async (conversationId: string) => {
    if (conversations.length <= 1) return

    try {
      await chatApi.delete(conversationId)
      setConversations(prev => prev.filter(conv => conv.id !== conversationId))

      if (conversationId === activeConversationId) {
        const remainingConversations = conversations.filter(conv => conv.id !== conversationId)
        setActiveConversationId(remainingConversations[0]?.id || null)
      }
    } catch (error) {
      console.error('Error deleting conversation:', error)
    }
  }

  const updateConversationTitle = async (conversationId: string, newTitle: string) => {
    try {
      await chatApi.updateTitle(conversationId, newTitle.trim() || 'New Chat')
      setConversations(prev => prev.map(conv =>
        conv.id === conversationId
          ? { ...conv, title: newTitle.trim() || 'New Chat' }
          : conv
      ))
      setEditingConversationId(null)
      setEditingTitle('')
    } catch (error) {
      console.error('Error updating conversation title:', error)
    }
  }

  const startEditingTitle = (conversationId: string, currentTitle: string) => {
    setEditingConversationId(conversationId)
    setEditingTitle(currentTitle)
  }

  const cancelEditing = () => {
    setEditingConversationId(null)
    setEditingTitle('')
  }

  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getRelativeTime = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
      return `${diffInMinutes}m`
    } else if (diffInHours < 24) {
      return `${diffInHours}h`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays}d ago`
    }
  }

  const groupConversationsByDate = (convs: Conversation[]) => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)

    const groups: { [key: string]: Conversation[] } = {
      'Today': [],
      'Yesterday': [],
      'Previous': []
    }

    convs.forEach(conv => {
      const convDate = new Date(conv.updatedAt)
      if (convDate >= today) {
        groups['Today'].push(conv)
      } else if (convDate >= yesterday) {
        groups['Yesterday'].push(conv)
      } else {
        groups['Previous'].push(conv)
      }
    })

    return groups
  }

  const formatMessage = (content: string) => {
    return content.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        {index < content.split('\n').length - 1 && <br />}
      </span>
    ))
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (isResizing) {
      const newWidth = Math.max(280, Math.min(600, window.innerWidth - e.clientX))
      onWidthChange?.(newWidth)
    }
  }

  const handleMouseUp = () => {
    setIsResizing(false)
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }

  if (showHistory) {
    const groupedConversations = groupConversationsByDate(filteredConversations)

    return (
      <div
        className={cn("h-full flex flex-col bg-background border-l border-border relative", className)}
        style={{ width: `${width}px` }}
      >
        {/* History Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setShowHistory(false)}>
              <X className="h-4 w-4" />
            </Button>
            <h2 className="font-semibold text-foreground">Chat History</h2>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={createNewConversation}>
              <Plus className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-border">
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

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-6">
            {Object.entries(groupedConversations).map(([groupName, convs]) => {
              if (convs.length === 0) return null

              return (
                <div key={groupName}>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">{groupName}</h3>
                  <div className="space-y-1">
                    {convs.map((conversation) => (
                      <div
                        key={conversation.id}
                        className={cn(
                          "flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-accent transition-colors group",
                          activeConversationId === conversation.id && "bg-accent"
                        )}
                        onClick={() => {
                          setActiveConversationId(conversation.id)
                          setShowHistory(false)
                        }}
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <MessageSquare className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            {editingConversationId === conversation.id ? (
                              <Input
                                value={editingTitle}
                                onChange={(e) => setEditingTitle(e.target.value)}
                                onBlur={() => updateConversationTitle(conversation.id, editingTitle)}
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    updateConversationTitle(conversation.id, editingTitle)
                                  } else if (e.key === 'Escape') {
                                    cancelEditing()
                                  }
                                }}
                                className="h-6 text-sm"
                                autoFocus
                                onClick={(e) => e.stopPropagation()}
                              />
                            ) : (
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium truncate">{conversation.title}</span>
                                {activeConversationId === conversation.id && (
                                  <span className="text-xs text-muted-foreground">Current</span>
                                )}
                              </div>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground flex-shrink-0">
                            {getRelativeTime(conversation.updatedAt)}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={(e) => {
                              e.stopPropagation()
                              startEditingTitle(conversation.id, conversation.title)
                            }}
                          >
                            <Edit3 className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteConversation(conversation.id)
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Resize Handle */}
        <div
          className={cn(
            "absolute left-0 top-0 bottom-0 w-1 cursor-col-resize transition-colors z-10",
            isResizing ? "bg-primary/30" : "hover:bg-primary/20"
          )}
          onMouseDown={handleMouseDown}
        />
      </div>
    )
  }

  return (
    <div
      className={cn("h-full flex flex-col bg-background border-l border-border relative", className)}
      style={{ width: `${width}px` }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-foreground">AI Assistant</h2>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => setShowHistory(true)}>
            <History className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={createNewConversation}>
            <Plus className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-4">
            {activeConversation?.messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3 group",
                  message.role === 'user' ? "justify-end" : "justify-start"
                )}
              >
                {message.role === 'assistant' && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                )}

                <div
                  className={cn(
                    "max-w-[80%] rounded-lg px-4 py-2",
                    message.role === 'user'
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  <div className="text-sm whitespace-pre-wrap">
                    {formatMessage(message.content)}
                  </div>

                  {message.role === 'assistant' && (
                    <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => copyMessage(message.content)}>
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <ThumbsUp className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <ThumbsDown className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <RefreshCw className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>

                {message.role === 'user' && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3 justify-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div className="bg-muted rounded-lg px-4 py-2">
                  <div className="flex items-center gap-1">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm text-muted-foreground ml-2">AI is typing...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-border">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about your project..."
              className="flex-1"
              disabled={isTyping}
            />
            <Button
              onClick={() => sendMessage(inputValue)}
              disabled={!inputValue.trim() || isTyping}
              size="sm"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
            <span>Press Enter to send, Shift+Enter for new line</span>
            <span>AI can make mistakes. Check important info.</span>
          </div>
        </div>
      </div>

      {/* Resize Handle */}
      <div
        className={cn(
          "absolute left-0 top-0 bottom-0 w-1 cursor-col-resize transition-colors z-10",
          isResizing ? "bg-primary/30" : "hover:bg-primary/20"
        )}
        onMouseDown={handleMouseDown}
      />
    </div>
  )
}
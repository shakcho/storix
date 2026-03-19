'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BookOpen, 
  FileText, 
  BarChart3,
  Settings,
  Feather,
  ChevronLeft,
  ChevronRight,
  Plus,
  Home,
  Sparkles
} from 'lucide-react'

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home, badge: null },
  { name: 'Projects', href: '/dashboard/project', icon: FileText, badge: '3' },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3, badge: null },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings, badge: null },
]

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname()
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  return (
    <motion.div 
      className={cn(
        "fixed left-0 top-0 h-full bg-card/80 backdrop-blur-xl border-r border-border/50 transition-all duration-500 ease-out z-50 flex flex-col",
        collapsed ? "w-20" : "w-64"
      )}
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header with Logo */}
      <div className="flex items-center justify-between p-6 border-b border-border/50">
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div 
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative">
                <Feather className="h-7 w-7 text-primary" />
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
                <h1 className="text-xl font-bold tracking-tight">Storix</h1>
                <p className="text-xs text-muted-foreground">Creative Writing</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="h-9 w-9 hover:bg-secondary/80"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </motion.div>
      </div>

      {/* Quick Action - New Project */}
      <div className="p-4 border-b border-border/50">
        <AnimatePresence mode="wait">
          {!collapsed ? (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  className="w-full justify-start gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
                  size="lg"
                >
                  <Plus className="h-5 w-5" />
                  <span className="font-medium">New Story</span>
                </Button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button 
                size="icon"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
              >
                <Plus className="h-5 w-5" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navigation.map((item, index) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          const isHovered = hoveredItem === item.name

          return (
            <Link key={item.name} href={item.href}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                onHoverStart={() => setHoveredItem(item.name)}
                onHoverEnd={() => setHoveredItem(null)}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 relative overflow-hidden transition-all",
                    collapsed ? "px-0 justify-center" : "px-4",
                    isActive && "bg-secondary/80 shadow-sm",
                    !isActive && "hover:bg-secondary/50"
                  )}
                  size="lg"
                >
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent"
                      layoutId="activeTab"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  
                  <Icon className={cn(
                    "h-5 w-5 relative z-10",
                    isActive && "text-primary"
                  )} />
                  
                  <AnimatePresence mode="wait">
                    {!collapsed && (
                      <motion.span 
                        className={cn(
                          "relative z-10 font-medium",
                          isActive && "text-primary"
                        )}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  
                  {!collapsed && item.badge && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Badge 
                        variant="secondary" 
                        className="ml-auto bg-primary/10 text-primary border-0"
                      >
                        {item.badge}
                      </Badge>
                    </motion.div>
                  )}
                </Button>
              </motion.div>
            </Link>
          )
        })}
      </nav>

      {/* Footer - Word Count Progress */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div 
            className="p-4 border-t border-border/50 space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5" />
                Monthly Goal
              </span>
              <Badge variant="outline" className="font-mono text-xs">
                73%
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                <motion.div 
                  className="bg-gradient-to-r from-primary to-primary/80 h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: '73%' }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
                />
              </div>
              <p className="text-xs text-muted-foreground font-mono">
                36,470 / 50,000 words
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

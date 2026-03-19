'use client'

import { UserButton, useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  Bell, 
  Settings, 
  Moon, 
  Sun,
  Zap,
  Sparkles
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export function Header() {
  const { user } = useUser()
  const { theme, setTheme } = useTheme()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)

  return (
    <header className="bg-card/50 backdrop-blur-xl border-b border-border/50 sticky top-0 z-40">
      <div className="px-8 py-4">
        <div className="flex items-center justify-between gap-6">
          {/* Search */}
          <motion.div 
            className="flex-1 max-w-xl"
            animate={{ 
              scale: searchFocused ? 1.02 : 1
            }}
            transition={{ duration: 0.2 }}
          >
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
              <Input
                placeholder="Search your stories, characters, and worlds..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="pl-11 h-11 bg-secondary/50 border-border/50 hover:border-primary/30 focus:border-primary transition-all"
              />
              {searchFocused && (
                <motion.div
                  className="absolute inset-0 bg-primary/5 rounded-lg -z-10"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </div>
          </motion.div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* AI Status */}
            <motion.div 
              className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/50 border border-border/50"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-sm font-medium">AI Assist</span>
              <Badge variant="secondary" className="text-xs font-normal bg-primary/10 text-primary border-0">
                Ready
              </Badge>
            </motion.div>

            {/* Notifications */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button variant="ghost" size="icon" className="relative hover:bg-secondary/80">
                <Bell className="h-5 w-5" />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1"
                >
                  <Badge 
                    variant="destructive" 
                    className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    3
                  </Badge>
                </motion.div>
              </Button>
            </motion.div>

            {/* Theme Toggle */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="hover:bg-secondary/80"
              >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </motion.div>

            {/* Settings */}
            <Link href="/dashboard/settings">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Button variant="ghost" size="icon" className="hover:bg-secondary/80">
                  <Settings className="h-5 w-5" />
                </Button>
              </motion.div>
            </Link>

            {/* User Menu */}
            <motion.div whileHover={{ scale: 1.05 }}>
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "h-9 w-9 ring-2 ring-border hover:ring-primary transition-all"
                  }
                }}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </header>
  )
}

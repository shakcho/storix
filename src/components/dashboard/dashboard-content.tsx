'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { 
  Plus, 
  FileText, 
  Users, 
  Sparkles, 
  TrendingUp, 
  Clock,
  Target,
  BookOpen,
  Star,
  Flame,
  Zap,
  ArrowUpRight
} from 'lucide-react'

export function DashboardContent() {
  const [recentProjects] = useState([
    {
      id: 1,
      title: "The Last Kingdom",
      genre: "Fantasy",
      wordCount: 15420,
      lastModified: "2 hours ago",
      status: "draft",
      progress: 65,
      cover: "bg-gradient-to-br from-purple-500/20 to-pink-500/20"
    },
    {
      id: 2,
      title: "Space Odyssey",
      genre: "Sci-Fi",
      wordCount: 8750,
      lastModified: "1 day ago",
      status: "editing",
      progress: 40,
      cover: "bg-gradient-to-br from-blue-500/20 to-cyan-500/20"
    },
    {
      id: 3,
      title: "Mystery Manor",
      genre: "Mystery",
      wordCount: 12300,
      lastModified: "3 days ago",
      status: "review",
      progress: 80,
      cover: "bg-gradient-to-br from-rose-500/15 to-pink-500/15"
    }
  ])

  const [stats] = useState({
    totalWords: 36470,
    monthlyGoal: 50000,
    projectsCompleted: 2,
    writingStreak: 15,
    aiSuggestions: 47
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <motion.div 
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Welcome Section */}
      <motion.div 
        className="flex items-center justify-between"
        variants={itemVariants}
      >
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">
            Welcome back, Writer
          </h1>
          <p className="text-lg text-muted-foreground">
            Ready to continue your creative journey?
          </p>
        </div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button size="lg" className="gap-2 shadow-lg shadow-primary/20">
            <Plus className="h-5 w-5" />
            <span>New Story</span>
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </motion.div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="relative overflow-hidden border-border/50 bg-card/50 backdrop-blur">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Words
                </CardTitle>
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalWords.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  +12% from last month
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="relative overflow-hidden border-border/50 bg-card/50 backdrop-blur">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Monthly Goal
                </CardTitle>
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Target className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {Math.round((stats.totalWords / stats.monthlyGoal) * 100)}%
                </div>
                <Progress 
                  value={(stats.totalWords / stats.monthlyGoal) * 100} 
                  className="mt-3 h-2" 
                />
                <p className="text-xs text-muted-foreground mt-2">
                  {stats.totalWords.toLocaleString()} / {stats.monthlyGoal.toLocaleString()} words
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="relative overflow-hidden border-border/50 bg-card/50 backdrop-blur">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Writing Streak
                </CardTitle>
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Flame className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold flex items-center gap-2">
                  {stats.writingStreak} 
                  <span className="text-lg">days</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  Keep the momentum going! 🔥
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="relative overflow-hidden border-border/50 bg-card/50 backdrop-blur">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  AI Suggestions
                </CardTitle>
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.aiSuggestions}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Used this month
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Recent Projects & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Projects */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Recent Projects
                  </CardTitle>
                  <CardDescription>
                    Your latest writing projects
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">View All</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  whileHover={{ x: 4, scale: 1.01 }}
                  className="group"
                >
                  <div className="flex items-center gap-4 p-4 rounded-xl border border-border/50 hover:border-primary/30 bg-secondary/30 hover:bg-secondary/50 transition-all cursor-pointer">
                    {/* Project Cover */}
                    <div className={cn(
                      "w-16 h-16 rounded-lg flex items-center justify-center relative overflow-hidden",
                      project.cover
                    )}>
                      <FileText className="h-7 w-7 text-primary relative z-10" />
                    </div>
                    
                    {/* Project Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg truncate group-hover:text-primary transition-colors">
                          {project.title}
                        </h3>
                        <Badge variant="outline" className="text-xs shrink-0">
                          {project.genre}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <FileText className="h-3.5 w-3.5" />
                          {project.wordCount.toLocaleString()} words
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {project.lastModified}
                        </span>
                      </div>
                      <div className="mt-2">
                        <div className="flex items-center gap-2">
                          <Progress value={project.progress} className="h-1.5 flex-1" />
                          <span className="text-xs text-muted-foreground font-medium">{project.progress}%</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Button */}
                    <Button variant="ghost" size="sm" className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      Open
                      <ArrowUpRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants}>
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Quick Actions
              </CardTitle>
              <CardDescription>
                Jump into your workflow
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { icon: Plus, label: 'Start New Story', color: 'text-primary' },
                { icon: Users, label: 'Create Character', color: 'text-blue-500' },
                { icon: FileText, label: 'Research Topic', color: 'text-purple-500' },
                { icon: Star, label: 'AI Writing Assistant', color: 'text-rose-500' },
              ].map((action, index) => (
                <motion.div
                  key={action.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                  whileHover={{ x: 4 }}
                >
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-3 h-12 border-border/50 hover:border-primary/30 hover:bg-secondary/50"
                  >
                    <action.icon className={cn("h-5 w-5", action.color)} />
                    <span className="font-medium">{action.label}</span>
                  </Button>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Writing Tip */}
      <motion.div variants={itemVariants}>
        <Card className="border-border/50 bg-gradient-to-br from-card/50 to-accent/20 backdrop-blur overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Today's Writing Inspiration
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <blockquote className="border-l-4 border-primary pl-6 py-2 italic text-lg leading-relaxed">
              "The first draft of anything is shit."
              <footer className="text-sm text-muted-foreground mt-2 not-italic">
                — Ernest Hemingway
              </footer>
            </blockquote>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Don't worry about perfection in your first draft. Focus on getting your ideas down on paper. 
              You can always revise and improve later. The important thing is to keep writing!
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}

'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Plus, 
  FileText, 
  Users, 
  Zap, 
  TrendingUp, 
  Clock,
  Target,
  BookOpen,
  Calendar,
  Star
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
      progress: 65
    },
    {
      id: 2,
      title: "Space Odyssey",
      genre: "Sci-Fi",
      wordCount: 8750,
      lastModified: "1 day ago",
      status: "editing",
      progress: 40
    },
    {
      id: 3,
      title: "Mystery Manor",
      genre: "Mystery",
      wordCount: 12300,
      lastModified: "3 days ago",
      status: "review",
      progress: 80
    }
  ])

  const [stats] = useState({
    totalWords: 36470,
    monthlyGoal: 50000,
    projectsCompleted: 2,
    writingStreak: 15,
    aiSuggestions: 47
  })

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Welcome back!</h1>
          <p className="text-muted-foreground mt-2">
            Ready to continue your writing journey?
          </p>
        </div>
        <Button size="lg" className="flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>New Story</span>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Words</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalWords.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Goal</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((stats.totalWords / stats.monthlyGoal) * 100)}%
            </div>
            <Progress value={(stats.totalWords / stats.monthlyGoal) * 100} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {stats.totalWords.toLocaleString()} / {stats.monthlyGoal.toLocaleString()} words
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Writing Streak</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.writingStreak} days</div>
            <p className="text-xs text-muted-foreground">
              Keep it up! 🔥
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Suggestions</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.aiSuggestions}</div>
            <p className="text-xs text-muted-foreground">
              Used this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5" />
              <span>Recent Projects</span>
            </CardTitle>
            <CardDescription>
              Your latest writing projects
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentProjects.map((project) => (
              <div key={project.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium">{project.title}</h3>
                    <Badge variant="outline" className="text-xs">
                      {project.genre}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
                    <span>{project.wordCount.toLocaleString()} words</span>
                    <span>•</span>
                    <span>{project.lastModified}</span>
                  </div>
                  <Progress value={project.progress} className="mt-2" />
                </div>
                <Button variant="ghost" size="sm">
                  Open
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5" />
              <span>Quick Actions</span>
            </CardTitle>
            <CardDescription>
              Jump into your writing workflow
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Plus className="h-4 w-4 mr-2" />
              Start New Story
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Users className="h-4 w-4 mr-2" />
              Create Character
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <FileText className="h-4 w-4 mr-2" />
              Research Topic
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Star className="h-4 w-4 mr-2" />
              AI Writing Assistant
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Writing Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Today's Writing Tip</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <blockquote className="border-l-4 border-primary pl-4 italic">
            "The first draft of anything is shit." - Ernest Hemingway
          </blockquote>
          <p className="mt-3 text-sm text-muted-foreground">
            Don't worry about perfection in your first draft. Focus on getting your ideas down on paper. 
            You can always revise and improve later. The important thing is to keep writing!
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { EnhancedProjectWorkspace } from '@/components/project/enhanced-project-workspace'
import { useProject } from '@/hooks/use-projects'

interface ProjectPageProps {
  params: {
    id: string
  }
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const { data: project, isLoading, error } = useProject(params.id)

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/sign-in')
    }
  }, [isLoaded, user, router])

  if (!isLoaded || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
        <div className="fixed inset-0 bg-gradient-to-br from-background via-background to-accent/5 pointer-events-none" />
        <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-primary/3 rounded-full blur-[150px] pointer-events-none" />
        <div className="relative text-center">
          <div className="relative inline-block mb-6">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/20 border-t-primary"></div>
            <div className="absolute inset-0 rounded-full bg-primary/10 blur-xl animate-pulse"></div>
          </div>
          <p className="text-lg text-muted-foreground animate-pulse">Loading your story...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl">📖</div>
          <h2 className="text-2xl font-bold">Story Not Found</h2>
          <p className="text-muted-foreground">{error.message}</p>
          <button 
            onClick={() => router.back()} 
            className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  const handleBack = () => {
    router.back()
  }

  return (
    <EnhancedProjectWorkspace 
      projectId={params.id} 
      projectTitle={project?.title}
      onBack={handleBack}
    />
  )
}

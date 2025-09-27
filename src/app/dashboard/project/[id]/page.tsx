'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { ProjectWorkspace } from '@/components/project/project-workspace'
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  const handleBack = () => {
    router.back()
  }

  return (
    <ProjectWorkspace 
      projectId={params.id} 
      projectTitle={project?.title}
      onBack={handleBack}
    />
  )
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/nextjs'
import { projectApi } from '@/lib/api'

export interface Project {
  id: string
  title: string
  description?: string
  genre?: string
  status: 'draft' | 'in-progress' | 'completed' | 'published'
  wordCount: number
  characterCount: number
  createdAt: string
  updatedAt: string
  authorId: string
  author?: {
    id: string
    username: string
    firstName?: string
    lastName?: string
  }
  _count?: {
    chapters: number
    collaborators: number
  }
}

export interface ProjectsResponse {
  projects: Project[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export interface UseProjectsOptions {
  page?: number
  limit?: number
  status?: string
  genre?: string
}

export function useProjects(options: UseProjectsOptions = {}) {
  const { page = 1, limit = 10, status, genre } = options
  const { getToken } = useAuth()

  return useQuery({
    queryKey: ['projects', { page, limit, status, genre }],
    queryFn: async (): Promise<ProjectsResponse> => {
      const token = await getToken()
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      })
      
      if (status) params.append('status', status)
      if (genre) params.append('genre', genre)
      
      const queryString = params.toString()
      const endpoint = queryString ? `/projects?${queryString}` : '/projects'
      
      return projectApi.getAll(endpoint, token || undefined) as Promise<ProjectsResponse>
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  })
}

export function useProject(id: string) {
  const { getToken } = useAuth()
  
  return useQuery({
    queryKey: ['project', id],
    queryFn: async () => {
      const token = await getToken()
      return projectApi.getById(id, token || undefined) as Promise<Project>
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export interface CreateProjectData {
  title?: string
  description?: string
  genre?: string
}

export function useCreateProject() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: CreateProjectData): Promise<Project> => {
      const token = await getToken()
      if (!token) {
        throw new Error('Authentication required')
      }
      return projectApi.create(data, token) as Promise<Project>
    },
    onSuccess: (newProject) => {
      // Invalidate and refetch projects list
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      
      // Optionally add the new project to the cache
      queryClient.setQueryData(['project', newProject.id], newProject)
    },
    onError: (error) => {
      console.error('Error creating project:', error)
    }
  })
}

export interface UpdateProjectData {
  title?: string
  description?: string
  genre?: string
  status?: 'draft' | 'in-progress' | 'completed' | 'published'
  isPublic?: boolean
}

export function useUpdateProject() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateProjectData }): Promise<Project> => {
      const token = await getToken()
      if (!token) {
        throw new Error('Authentication required')
      }
      return projectApi.update(id, data, token) as Promise<Project>
    },
    onSuccess: (updatedProject) => {
      // Update the specific project in cache
      queryClient.setQueryData(['project', updatedProject.id], updatedProject)
      
      // Invalidate projects list to reflect changes
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
    onError: (error) => {
      console.error('Error updating project:', error)
    }
  })
}

export function useDeleteProject() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const token = await getToken()
      if (!token) {
        throw new Error('Authentication required')
      }
      return projectApi.delete(id, token)
    },
    onSuccess: (_, projectId) => {
      // Remove the project from cache
      queryClient.removeQueries({ queryKey: ['project', projectId] })
      
      // Invalidate projects list to reflect changes
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
    onError: (error) => {
      console.error('Error deleting project:', error)
    }
  })
}

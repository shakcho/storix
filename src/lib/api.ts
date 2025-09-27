const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit & { token?: string } = {}
): Promise<T> {
  const url = `${API_BASE_URL}/api${endpoint}`;
  const { token, ...fetchOptions } = options;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...fetchOptions.headers,
      },
      credentials: 'include',
      ...fetchOptions,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new ApiError(response.status, errorData.error || 'Request failed');
    }

    return response.json();
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new ApiError(0, 'Network error - please check if the backend server is running');
    }
    throw error;
  }
}

// Project API
export const projectApi = {
  getAll: (endpoint: string = '/projects', token?: string) => apiRequest(endpoint, { token }),
  getById: (id: string, token?: string) => apiRequest(`/projects/${id}`, { token }),
  create: (data: { title?: string; description?: string; genre?: string }, token?: string) =>
    apiRequest('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    }),
  update: (id: string, data: any, token?: string) =>
    apiRequest(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      token,
    }),
  delete: (id: string, token?: string) =>
    apiRequest(`/projects/${id}`, {
      method: 'DELETE',
      token,
    }),
  getContent: (id: string, token?: string) => apiRequest(`/projects/${id}/content`, { token }),
  updateContent: (id: string, content: string, token?: string) =>
    apiRequest(`/projects/${id}/content`, {
      method: 'PUT',
      body: JSON.stringify({ content }),
      token,
    }),
  
  // Chapter management
  getChapters: (id: string) => apiRequest(`/projects/${id}/chapters`),
  createChapter: (id: string, data: { title: string; content?: string; order?: number }) =>
    apiRequest(`/projects/${id}/chapters`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getChapter: (id: string, chapterId: string) =>
    apiRequest(`/projects/${id}/chapters/${chapterId}`),
  updateChapter: (id: string, chapterId: string, data: any) =>
    apiRequest(`/projects/${id}/chapters/${chapterId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteChapter: (id: string, chapterId: string) =>
    apiRequest(`/projects/${id}/chapters/${chapterId}`, {
      method: 'DELETE',
    }),
};

// Chat API
export const chatApi = {
  getProjectChats: (projectId: string) => apiRequest(`/chats/project/${projectId}`),
  create: (data: { projectId: string; title?: string }) =>
    apiRequest('/chats', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getMessages: (chatId: string) => apiRequest(`/chats/${chatId}/messages`),
  sendMessage: (chatId: string, content: string, role: 'user' | 'assistant' = 'user') =>
    apiRequest(`/chats/${chatId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content, role }),
    }),
  updateTitle: (chatId: string, title: string) =>
    apiRequest(`/chats/${chatId}/title`, {
      method: 'PATCH',
      body: JSON.stringify({ title }),
    }),
  delete: (chatId: string) =>
    apiRequest(`/chats/${chatId}`, {
      method: 'DELETE',
    }),
};

// Research API
export const researchApi = {
  getProjectResearch: (projectId: string) => apiRequest(`/research/project/${projectId}`),
  create: (data: {
    projectId: string;
    title: string;
    description?: string;
    fileType: 'image' | 'audio' | 'video' | 'text' | 'link' | 'document';
    content?: string;
    fileUrl?: string;
    metadata?: any;
    tags?: string[];
  }) =>
    apiRequest('/research', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getById: (researchId: string) => apiRequest(`/research/${researchId}`),
  update: (researchId: string, data: any) =>
    apiRequest(`/research/${researchId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  delete: (researchId: string) =>
    apiRequest(`/research/${researchId}`, {
      method: 'DELETE',
    }),
};

export { ApiError };

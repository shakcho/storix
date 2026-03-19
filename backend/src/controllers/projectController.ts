import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';
import { AuthenticatedRequest } from '../middleware/auth';

const prisma = new PrismaClient();

// Helper function to get or create user from Clerk ID
async function getOrCreateUser(clerkId: string, userData?: any): Promise<string> {
  try {
    // First, try to find existing user by clerkId
    let user = await prisma.user.findUnique({
      where: { clerkId }
    });

    if (!user) {
      // Create new user if doesn't exist
      user = await prisma.user.create({
        data: {
          clerkId,
          email: userData?.email || `user-${clerkId}@example.com`,
          username: userData?.username || `user-${clerkId}`,
          firstName: userData?.firstName,
          lastName: userData?.lastName,
          imageUrl: userData?.imageUrl
        }
      });
      logger.info(`Created new user for Clerk ID: ${clerkId}`);
    }

    return user.id;
  } catch (error) {
    logger.error('Error getting or creating user:', error);
    throw error;
  }
}

export class ProjectController {
  // Get all projects for the authenticated user
  static async getAllProjects(req: AuthenticatedRequest, res: Response) {
    try {
      const { page = 1, limit = 10, status, genre } = req.query;
      const clerkId = req.userId;

      if (!clerkId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Get or create user from Clerk ID
      const userId = await getOrCreateUser(clerkId, req.user);

      const skip = (Number(page) - 1) * Number(limit);
      
      const where: any = {
        OR: [
          { authorId: userId },
          { collaborators: { some: { userId } } }
        ]
      };

      if (status) where.status = status;
      if (genre) where.genre = genre;

      const [projects, total] = await Promise.all([
        prisma.project.findMany({
          where,
          include: {
            author: {
              select: { id: true, username: true, firstName: true, lastName: true }
            },
            _count: {
              select: { chapters: true, collaborators: true }
            }
          },
          orderBy: { updatedAt: 'desc' },
          skip,
          take: Number(limit)
        }),
        prisma.project.count({ where })
      ]);

      res.json({
        projects,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      });
    } catch (error) {
      logger.error('Error fetching projects:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Create a new project
  static async createProject(req: AuthenticatedRequest, res: Response) {
    try {
      const { title = 'Untitled', description, genre } = req.body;
      const clerkId = req.userId;

      if (!clerkId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Get or create user from Clerk ID
      const userId = await getOrCreateUser(clerkId, req.user);

      const project = await prisma.project.create({
        data: {
          title: title.trim(),
          description: description?.trim(),
          genre,
          authorId: userId
        },
        include: {
          author: {
            select: { id: true, username: true, firstName: true, lastName: true }
          }
        }
      });

      res.status(201).json(project);
    } catch (error) {
      logger.error('Error creating project:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get a specific project
  static async getProject(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const clerkId = req.userId;

      if (!clerkId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      if (!id) {
        return res.status(400).json({ error: 'Project ID is required' });
      }

      // Get or create user from Clerk ID
      const userId = await getOrCreateUser(clerkId, req.user);

      const project = await prisma.project.findFirst({
        where: {
          id,
          OR: [
            { authorId: userId },
            { collaborators: { some: { userId } } }
          ]
        },
        include: {
          author: {
            select: { id: true, username: true, firstName: true, lastName: true }
          },
          chapters: {
            orderBy: { order: 'asc' }
          },
          collaborators: {
            include: {
              user: {
                select: { id: true, username: true, firstName: true, lastName: true }
              }
            }
          }
        }
      });

      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }

      res.json(project);
    } catch (error) {
      logger.error('Error fetching project:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Update a project
  static async updateProject(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const clerkId = req.userId;
      const updates = req.body;

      if (!clerkId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Get or create user from Clerk ID
      const userId = await getOrCreateUser(clerkId, req.user);

      if (!id) {
        return res.status(400).json({ error: 'Project ID is required' });
      }

      // Verify user has permission to update
      const project = await prisma.project.findFirst({
        where: {
          id,
          OR: [
            { authorId: userId },
            { collaborators: { some: { userId, role: { in: ['editor', 'co-author'] } } } }
          ]
        }
      });

      if (!project) {
        return res.status(404).json({ error: 'Project not found or insufficient permissions' });
      }

      const updatedProject = await prisma.project.update({
        where: { id },
        data: {
          ...(updates.title && { title: updates.title.trim() }),
          ...(updates.description !== undefined && { description: updates.description?.trim() }),
          ...(updates.genre !== undefined && { genre: updates.genre }),
          ...(updates.status !== undefined && { status: updates.status }),
          ...(updates.isPublic !== undefined && { isPublic: updates.isPublic }),
          updatedAt: new Date()
        },
        include: {
          author: {
            select: { id: true, username: true, firstName: true, lastName: true }
          }
        }
      });

      res.json(updatedProject);
    } catch (error) {
      logger.error('Error updating project:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Delete a project
  static async deleteProject(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const clerkId = req.userId;

      if (!clerkId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Get or create user from Clerk ID
      const userId = await getOrCreateUser(clerkId, req.user);

      if (!id) {
        return res.status(400).json({ error: 'Project ID is required' });
      }

      // Only the author can delete the project
      const project = await prisma.project.findFirst({
        where: {
          id,
          authorId: userId
        }
      });

      if (!project) {
        return res.status(404).json({ error: 'Project not found or insufficient permissions' });
      }

      await prisma.project.delete({
        where: { id }
      });

      res.status(204).send();
    } catch (error) {
      logger.error('Error deleting project:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get project content
  static async getProjectContent(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const clerkId = req.userId;

      if (!clerkId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Get or create user from Clerk ID
      const userId = await getOrCreateUser(clerkId, req.user);

      if (!id) {
        return res.status(400).json({ error: 'Project ID is required' });
      }

      const project = await prisma.project.findFirst({
        where: {
          id,
          OR: [
            { authorId: userId },
            { collaborators: { some: { userId } } }
          ]
        },
        select: { content: true }
      });

      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }

      res.json({ content: project.content || '' });
    } catch (error) {
      logger.error('Error fetching project content:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Update project content
  static async updateProjectContent(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const clerkId = req.userId;
      const { content } = req.body;

      if (!clerkId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Get or create user from Clerk ID
      const userId = await getOrCreateUser(clerkId, req.user);

      if (!id) {
        return res.status(400).json({ error: 'Project ID is required' });
      }

      // Verify user has permission to update
      const project = await prisma.project.findFirst({
        where: {
          id,
          OR: [
            { authorId: userId },
            { collaborators: { some: { userId, role: { in: ['editor', 'co-author'] } } } }
          ]
        }
      });

      if (!project) {
        return res.status(404).json({ error: 'Project not found or insufficient permissions' });
      }

      // Calculate word and character counts
      const wordCount = content ? content.replace(/<[^>]*>/g, '').split(/\s+/).filter((word: string) => word.length > 0).length : 0;
      const characterCount = content ? content.replace(/<[^>]*>/g, '').length : 0;

      await prisma.project.update({
        where: { id },
        data: {
          content,
          wordCount,
          characterCount,
          updatedAt: new Date()
        }
      });

      // Create version for content changes
      await prisma.version.create({
        data: {
          title: 'Content Update',
          content,
          wordCount,
          characterCount,
          changes: 'Content updated',
          userId,
          projectId: id
        }
      });

      res.json({ success: true });
    } catch (error) {
      logger.error('Error updating project content:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Chapter management
  static async getChapters(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      if (!id) {
        return res.status(400).json({ error: 'Project ID is required' });
      }

      // Verify user has access to project
      const project = await prisma.project.findFirst({
        where: {
          id,
          OR: [
            { authorId: userId },
            { collaborators: { some: { userId } } }
          ]
        }
      });

      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }

      const chapters = await prisma.chapter.findMany({
        where: { projectId: id },
        orderBy: { order: 'asc' }
      });

      res.json(chapters);
    } catch (error) {
      logger.error('Error fetching chapters:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async createChapter(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      const { title, content, order } = req.body;

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      if (!id) {
        return res.status(400).json({ error: 'Project ID is required' });
      }

      if (!title?.trim()) {
        return res.status(400).json({ error: 'Chapter title is required' });
      }

      // Verify user has permission to create chapters
      const project = await prisma.project.findFirst({
        where: {
          id,
          OR: [
            { authorId: userId },
            { collaborators: { some: { userId, role: { in: ['editor', 'co-author'] } } } }
          ]
        }
      });

      if (!project) {
        return res.status(404).json({ error: 'Project not found or insufficient permissions' });
      }

      // Get the next order number if not provided
      let chapterOrder = order;
      if (!chapterOrder) {
        const lastChapter = await prisma.chapter.findFirst({
          where: { projectId: id },
          orderBy: { order: 'desc' }
        });
        chapterOrder = lastChapter ? lastChapter.order + 1 : 1;
      }

      const wordCount = content ? content.replace(/<[^>]*>/g, '').split(/\s+/).filter((word: string) => word.length > 0).length : 0;
      const characterCount = content ? content.replace(/<[^>]*>/g, '').length : 0;

      const chapter = await prisma.chapter.create({
        data: {
          title: title.trim(),
          content: content?.trim(),
          order: chapterOrder,
          wordCount,
          characterCount,
          projectId: id
        }
      });

      res.status(201).json(chapter);
    } catch (error) {
      logger.error('Error creating chapter:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getChapter(req: AuthenticatedRequest, res: Response) {
    try {
      const { id, chapterId } = req.params;
      const clerkId = req.userId;

      if (!clerkId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Get or create user from Clerk ID
      const userId = await getOrCreateUser(clerkId, req.user);

      if (!id || !chapterId) {
        return res.status(400).json({ error: 'Project ID and Chapter ID are required' });
      }

      // Verify user has access to project
      const project = await prisma.project.findFirst({
        where: {
          id,
          OR: [
            { authorId: userId },
            { collaborators: { some: { userId } } }
          ]
        }
      });

      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }

      const chapter = await prisma.chapter.findFirst({
        where: {
          id: chapterId,
          projectId: id
        }
      });

      if (!chapter) {
        return res.status(404).json({ error: 'Chapter not found' });
      }

      res.json(chapter);
    } catch (error) {
      logger.error('Error fetching chapter:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async updateChapter(req: AuthenticatedRequest, res: Response) {
    try {
      const { id, chapterId } = req.params;
      const clerkId = req.userId;
      const updates = req.body;

      if (!clerkId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Get or create user from Clerk ID
      const userId = await getOrCreateUser(clerkId, req.user);

      if (!id || !chapterId) {
        return res.status(400).json({ error: 'Project ID and Chapter ID are required' });
      }

      // Verify user has permission to update chapters
      const project = await prisma.project.findFirst({
        where: {
          id,
          OR: [
            { authorId: userId },
            { collaborators: { some: { userId, role: { in: ['editor', 'co-author'] } } } }
          ]
        }
      });

      if (!project) {
        return res.status(404).json({ error: 'Project not found or insufficient permissions' });
      }

      const chapter = await prisma.chapter.findFirst({
        where: {
          id: chapterId,
          projectId: id
        }
      });

      if (!chapter) {
        return res.status(404).json({ error: 'Chapter not found' });
      }

      // Calculate word and character counts if content is being updated
      let wordCount = chapter.wordCount;
      let characterCount = chapter.characterCount;
      
      if (updates.content !== undefined) {
        wordCount = updates.content ? updates.content.replace(/<[^>]*>/g, '').split(/\s+/).filter((word: string) => word.length > 0).length : 0;
        characterCount = updates.content ? updates.content.replace(/<[^>]*>/g, '').length : 0;
      }

      const updatedChapter = await prisma.chapter.update({
        where: { id: chapterId },
        data: {
          ...(updates.title && { title: updates.title.trim() }),
          ...(updates.content !== undefined && { content: updates.content?.trim() }),
          ...(updates.order !== undefined && { order: updates.order }),
          wordCount,
          characterCount,
          updatedAt: new Date()
        }
      });

      // Create version for chapter changes
      await prisma.version.create({
        data: {
          title: `Chapter Update: ${updatedChapter.title}`,
          content: updatedChapter.content || '',
          wordCount: updatedChapter.wordCount,
          characterCount: updatedChapter.characterCount,
          changes: 'Chapter content updated',
          userId,
          projectId: id,
          chapterId: chapterId
        }
      });

      res.json(updatedChapter);
    } catch (error) {
      logger.error('Error updating chapter:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async deleteChapter(req: AuthenticatedRequest, res: Response) {
    try {
      const { id, chapterId } = req.params;
      const clerkId = req.userId;

      if (!clerkId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Get or create user from Clerk ID
      const userId = await getOrCreateUser(clerkId, req.user);

      if (!id || !chapterId) {
        return res.status(400).json({ error: 'Project ID and Chapter ID are required' });
      }

      // Verify user has permission to delete chapters
      const project = await prisma.project.findFirst({
        where: {
          id,
          OR: [
            { authorId: userId },
            { collaborators: { some: { userId, role: { in: ['editor', 'co-author'] } } } }
          ]
        }
      });

      if (!project) {
        return res.status(404).json({ error: 'Project not found or insufficient permissions' });
      }

      const chapter = await prisma.chapter.findFirst({
        where: {
          id: chapterId,
          projectId: id
        }
      });

      if (!chapter) {
        return res.status(404).json({ error: 'Chapter not found' });
      }

      await prisma.chapter.delete({
        where: { id: chapterId }
      });

      res.status(204).send();
    } catch (error) {
      logger.error('Error deleting chapter:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Collaboration methods
  static async getCollaborators(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      
      // TODO: Implement collaborator retrieval
      const collaborators: any[] = [];
      
      res.json(collaborators);
    } catch (error) {
      next(error);
    }
  }

  static async addCollaborator(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { email, role, permissions } = req.body;

      // TODO: Implement collaborator addition
      
      res.status(201).json({ message: 'Collaborator added successfully' });
    } catch (error) {
      next(error);
    }
  }

  static async updateCollaborator(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id, userId } = req.params;
      const updates = req.body;

      // TODO: Implement collaborator update
      
      res.json({ message: 'Collaborator updated successfully' });
    } catch (error) {
      next(error);
    }
  }

  static async removeCollaborator(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id, userId } = req.params;

      // TODO: Implement collaborator removal
      
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  // Version management
  static async getVersions(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      
      // TODO: Implement version retrieval
      const versions: any[] = [];
      
      res.json(versions);
    } catch (error) {
      next(error);
    }
  }

  static async createVersion(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { title, changes } = req.body;

      // TODO: Implement version creation
      
      res.status(201).json({ message: 'Version created successfully' });
    } catch (error) {
      next(error);
    }
  }

  static async getVersion(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id, versionId } = req.params;
      
      // TODO: Implement version retrieval
      
      res.json({ message: 'Version retrieval not implemented yet' });
    } catch (error) {
      next(error);
    }
  }

  static async restoreVersion(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id, versionId } = req.params;

      // TODO: Implement version restoration
      
      res.json({ message: 'Version restored successfully' });
    } catch (error) {
      next(error);
    }
  }


  // Comments and feedback
  static async getComments(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      
      // TODO: Implement comment retrieval
      const comments: any[] = [];
      
      res.json(comments);
    } catch (error) {
      next(error);
    }
  }

  static async addComment(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { content, position } = req.body;

      // TODO: Implement comment addition
      
      res.status(201).json({ message: 'Comment added successfully' });
    } catch (error) {
      next(error);
    }
  }

  static async updateComment(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id, commentId } = req.params;
      const updates = req.body;

      // TODO: Implement comment update
      
      res.json({ message: 'Comment updated successfully' });
    } catch (error) {
      next(error);
    }
  }

  static async deleteComment(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id, commentId } = req.params;

      // TODO: Implement comment deletion
      
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  static async getFeedback(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      
      // TODO: Implement feedback retrieval
      const feedback: any[] = [];
      
      res.json(feedback);
    } catch (error) {
      next(error);
    }
  }

  static async addFeedback(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { content, type, rating } = req.body;

      // TODO: Implement feedback addition
      
      res.status(201).json({ message: 'Feedback added successfully' });
    } catch (error) {
      next(error);
    }
  }

  static async updateFeedback(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id, feedbackId } = req.params;
      const updates = req.body;

      // TODO: Implement feedback update
      
      res.json({ message: 'Feedback updated successfully' });
    } catch (error) {
      next(error);
    }
  }

  // Highlights
  static async getHighlights(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      
      // TODO: Implement highlight retrieval
      const highlights: any[] = [];
      
      res.json(highlights);
    } catch (error) {
      next(error);
    }
  }

  static async addHighlight(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { content, position, color, note } = req.body;

      // TODO: Implement highlight addition
      
      res.status(201).json({ message: 'Highlight added successfully' });
    } catch (error) {
      next(error);
    }
  }

  static async updateHighlight(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id, highlightId } = req.params;
      const updates = req.body;

      // TODO: Implement highlight update
      
      res.json({ message: 'Highlight updated successfully' });
    } catch (error) {
      next(error);
    }
  }

  static async deleteHighlight(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id, highlightId } = req.params;

      // TODO: Implement highlight deletion
      
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
};

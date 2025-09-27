import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';
import { AuthenticatedRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export class ResearchController {
  // Get all research files for a project
  static async getProjectResearch(req: AuthenticatedRequest, res: Response) {
    try {
      const { projectId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Verify user has access to project
      const project = await prisma.project.findFirst({
        where: {
          id: projectId,
          OR: [
            { authorId: userId },
            { collaborators: { some: { userId } } }
          ]
        }
      });

      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }

      const researchFiles = await prisma.researchFile.findMany({
        where: {
          projectId,
          userId
        },
        orderBy: { updatedAt: 'desc' }
      });

      res.json(researchFiles);
    } catch (error) {
      logger.error('Error fetching project research:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Create a new research file
  static async createResearchFile(req: AuthenticatedRequest, res: Response) {
    try {
      const { 
        projectId, 
        title, 
        description, 
        fileType, 
        content, 
        fileUrl, 
        metadata, 
        tags = [] 
      } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      if (!title?.trim()) {
        return res.status(400).json({ error: 'Title is required' });
      }

      // Verify user has access to project
      const project = await prisma.project.findFirst({
        where: {
          id: projectId,
          OR: [
            { authorId: userId },
            { collaborators: { some: { userId } } }
          ]
        }
      });

      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }

      const researchFile = await prisma.researchFile.create({
        data: {
          title: title.trim(),
          description: description?.trim(),
          fileType,
          content: content?.trim(),
          fileUrl,
          metadata,
          tags,
          projectId,
          userId
        }
      });

      res.status(201).json(researchFile);
    } catch (error) {
      logger.error('Error creating research file:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Update a research file
  static async updateResearchFile(req: AuthenticatedRequest, res: Response) {
    try {
      const { researchId } = req.params;
      const { 
        title, 
        description, 
        content, 
        metadata, 
        tags 
      } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const researchFile = await prisma.researchFile.updateMany({
        where: {
          id: researchId,
          userId
        },
        data: {
          ...(title && { title: title.trim() }),
          ...(description !== undefined && { description: description?.trim() }),
          ...(content !== undefined && { content: content?.trim() }),
          ...(metadata !== undefined && { metadata }),
          ...(tags !== undefined && { tags }),
          updatedAt: new Date()
        }
      });

      if (researchFile.count === 0) {
        return res.status(404).json({ error: 'Research file not found' });
      }

      res.json({ success: true });
    } catch (error) {
      logger.error('Error updating research file:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Delete a research file
  static async deleteResearchFile(req: AuthenticatedRequest, res: Response) {
    try {
      const { researchId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const researchFile = await prisma.researchFile.deleteMany({
        where: {
          id: researchId,
          userId
        }
      });

      if (researchFile.count === 0) {
        return res.status(404).json({ error: 'Research file not found' });
      }

      res.json({ success: true });
    } catch (error) {
      logger.error('Error deleting research file:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get a specific research file
  static async getResearchFile(req: AuthenticatedRequest, res: Response) {
    try {
      const { researchId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const researchFile = await prisma.researchFile.findFirst({
        where: {
          id: researchId,
          userId
        }
      });

      if (!researchFile) {
        return res.status(404).json({ error: 'Research file not found' });
      }

      res.json(researchFile);
    } catch (error) {
      logger.error('Error fetching research file:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

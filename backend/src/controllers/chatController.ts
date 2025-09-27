import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';
import { AuthenticatedRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export class ChatController {
  // Get all chats for a project
  static async getProjectChats(req: AuthenticatedRequest, res: Response) {
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

      const chats = await prisma.chat.findMany({
        where: {
          projectId,
          userId
        },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
            take: 1 // Get first message for preview
          }
        },
        orderBy: { updatedAt: 'desc' }
      });

      res.json(chats);
    } catch (error) {
      logger.error('Error fetching project chats:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Create a new chat
  static async createChat(req: AuthenticatedRequest, res: Response) {
    try {
      const { projectId, title = 'New Chat' } = req.body;
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

      const chat = await prisma.chat.create({
        data: {
          title,
          projectId,
          userId,
          messages: {
            create: {
              role: 'assistant',
              content: "Hello! I'm your AI writing assistant. I can help you with character development, plot structure, world-building, dialogue, and much more. What would you like to work on today?"
            }
          }
        },
        include: {
          messages: true
        }
      });

      res.status(201).json(chat);
    } catch (error) {
      logger.error('Error creating chat:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get chat messages
  static async getChatMessages(req: AuthenticatedRequest, res: Response) {
    try {
      const { chatId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const chat = await prisma.chat.findFirst({
        where: {
          id: chatId,
          userId
        },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' }
          }
        }
      });

      if (!chat) {
        return res.status(404).json({ error: 'Chat not found' });
      }

      res.json(chat);
    } catch (error) {
      logger.error('Error fetching chat messages:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Send a message
  static async sendMessage(req: AuthenticatedRequest, res: Response) {
    try {
      const { chatId } = req.params;
      const { content, role = 'user' } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      if (!chatId) {
        return res.status(400).json({ error: 'Chat ID is required' });
      }

      if (!content?.trim()) {
        return res.status(400).json({ error: 'Message content is required' });
      }

      // Verify user owns the chat
      const chat = await prisma.chat.findFirst({
        where: {
          id: chatId,
          userId
        }
      });

      if (!chat) {
        return res.status(404).json({ error: 'Chat not found' });
      }

      const message = await prisma.chatMessage.create({
        data: {
          chatId,
          role,
          content: content.trim()
        }
      });

      // Update chat's updatedAt timestamp
      await prisma.chat.update({
        where: { id: chatId },
        data: { updatedAt: new Date() }
      });

      res.status(201).json(message);
    } catch (error) {
      logger.error('Error sending message:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Update chat title
  static async updateChatTitle(req: AuthenticatedRequest, res: Response) {
    try {
      const { chatId } = req.params;
      const { title } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      if (!title?.trim()) {
        return res.status(400).json({ error: 'Title is required' });
      }

      const chat = await prisma.chat.updateMany({
        where: {
          id: chatId,
          userId
        },
        data: {
          title: title.trim()
        }
      });

      if (chat.count === 0) {
        return res.status(404).json({ error: 'Chat not found' });
      }

      res.json({ success: true });
    } catch (error) {
      logger.error('Error updating chat title:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Delete a chat
  static async deleteChat(req: AuthenticatedRequest, res: Response) {
    try {
      const { chatId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const chat = await prisma.chat.deleteMany({
        where: {
          id: chatId,
          userId
        }
      });

      if (chat.count === 0) {
        return res.status(404).json({ error: 'Chat not found' });
      }

      res.json({ success: true });
    } catch (error) {
      logger.error('Error deleting chat:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

import { Server, Socket } from 'socket.io';
import { logger } from '../utils/logger';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  storyId?: string;
}

interface CollaborationEvent {
  type: 'cursor' | 'selection' | 'edit' | 'comment' | 'highlight';
  data: any;
  position?: {
    start: number;
    end: number;
  };
  timestamp: number;
}

export const setupSocketHandlers = (io: Server) => {
  // Authentication middleware for socket connections
  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error'));
      }

      // Verify token with Clerk (simplified for now)
      // In production, you'd want to verify the JWT token properly
      socket.userId = token; // This should be the actual user ID from token verification
      next();
    } catch (error) {
      logger.error('Socket authentication error:', error);
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    logger.info(`User ${socket.userId} connected`);

    // Join story room for collaboration
    socket.on('join-story', (storyId: string) => {
      socket.storyId = storyId;
      socket.join(`story:${storyId}`);
      logger.info(`User ${socket.userId} joined story ${storyId}`);
      
      // Notify other users in the room
      socket.to(`story:${storyId}`).emit('user-joined', {
        userId: socket.userId,
        timestamp: Date.now()
      });
    });

    // Leave story room
    socket.on('leave-story', () => {
      if (socket.storyId) {
        socket.to(`story:${socket.storyId}`).emit('user-left', {
          userId: socket.userId,
          timestamp: Date.now()
        });
        socket.leave(`story:${socket.storyId}`);
        socket.storyId = undefined as any;
      }
    });

    // Real-time collaboration events
    socket.on('collaboration-event', (event: CollaborationEvent) => {
      if (!socket.storyId) return;

      const enrichedEvent = {
        ...event,
        userId: socket.userId,
        timestamp: Date.now()
      };

      // Broadcast to other users in the same story
      socket.to(`story:${socket.storyId}`).emit('collaboration-event', enrichedEvent);
    });

    // Cursor position tracking
    socket.on('cursor-position', (position: { x: number; y: number; offset: number }) => {
      if (!socket.storyId) return;

      socket.to(`story:${socket.storyId}`).emit('user-cursor', {
        userId: socket.userId,
        position,
        timestamp: Date.now()
      });
    });

    // Selection tracking
    socket.on('selection-change', (selection: { start: number; end: number; text: string }) => {
      if (!socket.storyId) return;

      socket.to(`story:${socket.storyId}`).emit('user-selection', {
        userId: socket.userId,
        selection,
        timestamp: Date.now()
      });
    });

    // Live editing events
    socket.on('text-change', (change: {
      type: 'insert' | 'delete' | 'replace';
      position: number;
      text?: string;
      length?: number;
    }) => {
      if (!socket.storyId) return;

      socket.to(`story:${socket.storyId}`).emit('text-change', {
        userId: socket.userId,
        change,
        timestamp: Date.now()
      });
    });

    // Comment events
    socket.on('comment-added', (comment: {
      id: string;
      content: string;
      position: { start: number; end: number };
      storyId: string;
    }) => {
      if (!socket.storyId) return;

      socket.to(`story:${socket.storyId}`).emit('comment-added', {
        ...comment,
        userId: socket.userId,
        timestamp: Date.now()
      });
    });

    // Highlight events
    socket.on('highlight-added', (highlight: {
      id: string;
      content: string;
      position: { start: number; end: number };
      color: string;
      note?: string;
    }) => {
      if (!socket.storyId) return;

      socket.to(`story:${socket.storyId}`).emit('highlight-added', {
        ...highlight,
        userId: socket.userId,
        timestamp: Date.now()
      });
    });

    // Typing indicators
    socket.on('typing-start', () => {
      if (!socket.storyId) return;

      socket.to(`story:${socket.storyId}`).emit('user-typing', {
        userId: socket.userId,
        isTyping: true,
        timestamp: Date.now()
      });
    });

    socket.on('typing-stop', () => {
      if (!socket.storyId) return;

      socket.to(`story:${socket.storyId}`).emit('user-typing', {
        userId: socket.userId,
        isTyping: false,
        timestamp: Date.now()
      });
    });

    // Disconnect handling
    socket.on('disconnect', () => {
      logger.info(`User ${socket.userId} disconnected`);
      
      if (socket.storyId) {
        socket.to(`story:${socket.storyId}`).emit('user-left', {
          userId: socket.userId,
          timestamp: Date.now()
        });
      }
    });
  });

  // Error handling
  io.on('error', (error) => {
    logger.error('Socket.io error:', error);
  });
};

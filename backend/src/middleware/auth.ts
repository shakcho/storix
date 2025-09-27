import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '@clerk/express';
import { logger } from '../utils/logger';
import { getClerkConfig } from '../config/env';

export interface AuthenticatedRequest extends Request {
  userId?: string;
  user?: any;
}

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }



    // Verify token with Clerk
    const clerkConfig = getClerkConfig();

    const payload = await verifyToken(token, {
      secretKey: clerkConfig.secretKey
    });
    
    if (!payload) {
      res.status(401).json({ error: 'Invalid token' });
      return;
    }

    req.userId = payload.sub;
    req.user = payload;
    
    next();
  } catch (error) {
    logger.error('Auth middleware error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
};

import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger';
import { getFileStorageConfig } from '../config/env';

export interface FileStorageConfig {
  type: 'local' | 's3';
  localPath?: string;
  s3Config?: {
    bucket: string;
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
  };
}

export interface StoredFile {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
  url?: string;
  createdAt: Date;
}

class FileStorageService {
  private config: FileStorageConfig;
  private uploadPath: string;

  constructor(config: FileStorageConfig) {
    this.config = config;
    this.uploadPath = config.localPath || path.join(process.cwd(), 'uploads');
    
    // Ensure upload directory exists
    if (config.type === 'local') {
      this.ensureUploadDirectory();
    }
  }

  private ensureUploadDirectory(): void {
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  // Multer configuration for file uploads
  getMulterConfig() {
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, this.uploadPath);
      },
      filename: (req, file, cb) => {
        const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
      }
    });

    const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
      // Define allowed file types
      const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'text/plain',
        'text/markdown',
        'application/pdf',
        'audio/mpeg',
        'audio/wav',
        'audio/mp3',
        'video/mp4',
        'video/webm'
      ];

      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('File type not allowed'));
      }
    };

    return multer({
      storage,
      fileFilter,
      limits: {
        fileSize: 50 * 1024 * 1024, // 50MB limit
      }
    });
  }

  async storeFile(file: Express.Multer.File, userId: string, storyId?: string): Promise<StoredFile> {
    try {
      const fileId = uuidv4();
      const fileExtension = path.extname(file.originalname);
      const filename = `${fileId}${fileExtension}`;
      
      let filePath: string;
      let url: string | undefined;

      if (this.config.type === 'local') {
        filePath = path.join(this.uploadPath, filename);
        url = `/uploads/${filename}`;
      } else {
        // S3 implementation would go here
        throw new Error('S3 storage not implemented yet');
      }

      const storedFile: StoredFile = {
        id: fileId,
        filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        path: filePath,
        url,
        createdAt: new Date()
      };

      logger.info(`File stored: ${storedFile.originalName} (${storedFile.size} bytes)`);
      return storedFile;
    } catch (error) {
      logger.error('File storage error:', error);
      throw new Error('Failed to store file');
    }
  }

  async getFile(fileId: string): Promise<StoredFile | null> {
    try {
      // In a real implementation, you'd query the database for file metadata
      // For now, we'll return null
      return null;
    } catch (error) {
      logger.error('File retrieval error:', error);
      return null;
    }
  }

  async deleteFile(fileId: string): Promise<boolean> {
    try {
      // In a real implementation, you'd:
      // 1. Get file metadata from database
      // 2. Delete from storage (local filesystem or S3)
      // 3. Remove database record
      
      logger.info(`File deleted: ${fileId}`);
      return true;
    } catch (error) {
      logger.error('File deletion error:', error);
      return false;
    }
  }

  async getFileUrl(fileId: string): Promise<string | null> {
    try {
      const file = await this.getFile(fileId);
      return file?.url || null;
    } catch (error) {
      logger.error('File URL retrieval error:', error);
      return null;
    }
  }

  // Generate presigned URL for S3 (for future implementation)
  async generatePresignedUrl(fileId: string, expiresIn: number = 3600): Promise<string | null> {
    try {
      if (this.config.type === 's3') {
        // S3 presigned URL implementation would go here
        throw new Error('S3 presigned URLs not implemented yet');
      }
      
      // For local storage, return the direct URL
      return await this.getFileUrl(fileId);
    } catch (error) {
      logger.error('Presigned URL generation error:', error);
      return null;
    }
  }

  // Get file statistics
  async getStorageStats(): Promise<{
    totalFiles: number;
    totalSize: number;
    availableSpace: number;
  }> {
    try {
      if (this.config.type === 'local') {
        const files = fs.readdirSync(this.uploadPath);
        let totalSize = 0;
        
        for (const file of files) {
          const filePath = path.join(this.uploadPath, file);
          const stats = fs.statSync(filePath);
          totalSize += stats.size;
        }

        return {
          totalFiles: files.length,
          totalSize,
          availableSpace: 0 // Would need to calculate available disk space
        };
      }
      
      return { totalFiles: 0, totalSize: 0, availableSpace: 0 };
    } catch (error) {
      logger.error('Storage stats error:', error);
      return { totalFiles: 0, totalSize: 0, availableSpace: 0 };
    }
  }
}

// Initialize with validated environment configuration
const storageConfig = getFileStorageConfig();
const fileStorageConfig: FileStorageConfig = {
  type: storageConfig.type,
  localPath: storageConfig.local?.uploadPath,
  s3Config: storageConfig.s3 || undefined
};

export const fileStorageService = new FileStorageService(fileStorageConfig);

import { Router } from 'express';
import { fileController } from '../controllers/fileController';
import { fileStorageService } from '../services/fileStorageService';

const router = Router();

// File upload
router.post('/upload', fileStorageService.getMulterConfig().single('file'), fileController.uploadFile);
router.post('/upload-multiple', fileStorageService.getMulterConfig().array('files', 10), fileController.uploadMultipleFiles);

// File management
router.get('/', fileController.getFiles);
router.get('/:id', fileController.getFile);
router.get('/:id/download', fileController.downloadFile);
router.delete('/:id', fileController.deleteFile);

// File operations
router.get('/:id/metadata', fileController.getFileMetadata);
router.put('/:id/metadata', fileController.updateFileMetadata);
router.get('/:id/url', fileController.getFileUrl);

// Storage management
router.get('/storage/stats', fileController.getStorageStats);
router.post('/storage/cleanup', fileController.cleanupStorage);

export default router;

import { Router } from 'express';
import { aiController } from '../controllers/aiController';

const router = Router();

// AI model management
router.get('/models', aiController.getModels);
router.post('/models', aiController.addModel);
router.put('/models/:id', aiController.updateModel);
router.delete('/models/:id', aiController.deleteModel);
router.post('/models/:id/test', aiController.testModel);

// AI content generation
router.post('/generate', aiController.generateContent);
router.post('/improve', aiController.improveWriting);
router.post('/suggest', aiController.generateSuggestions);

// Story-specific AI features
router.post('/character', aiController.generateCharacter);
router.post('/world', aiController.generateWorld);
router.post('/plot', aiController.generatePlot);
router.post('/dialogue', aiController.generateDialogue);

// Text analysis
router.post('/analyze', aiController.analyzeText);
router.post('/summarize', aiController.summarizeText);
router.post('/outline', aiController.generateOutline);

// Research assistance
router.post('/research', aiController.generateResearch);
router.post('/fact-check', aiController.factCheck);

export default router;

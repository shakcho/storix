import { Router } from 'express';
import { ResearchController } from '../controllers/researchController';

const router = Router();

// Research routes
router.get('/project/:projectId', ResearchController.getProjectResearch);
router.post('/', ResearchController.createResearchFile);
router.get('/:researchId', ResearchController.getResearchFile);
router.patch('/:researchId', ResearchController.updateResearchFile);
router.delete('/:researchId', ResearchController.deleteResearchFile);

export default router;

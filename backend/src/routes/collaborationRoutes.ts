import { Router } from 'express';
import { collaborationController } from '../controllers/collaborationController';

const router = Router();

// Real-time collaboration
router.get('/:storyId/active-users', collaborationController.getActiveUsers);
router.post('/:storyId/join', collaborationController.joinStory);
router.post('/:storyId/leave', collaborationController.leaveStory);

// Collaboration permissions
router.get('/:storyId/permissions', collaborationController.getPermissions);
router.put('/:storyId/permissions', collaborationController.updatePermissions);

// Shared resources
router.get('/:storyId/shared-resources', collaborationController.getSharedResources);
router.post('/:storyId/shared-resources', collaborationController.addSharedResource);
router.delete('/:storyId/shared-resources/:resourceId', collaborationController.removeSharedResource);

// Collaboration history
router.get('/:storyId/history', collaborationController.getCollaborationHistory);
router.get('/:storyId/changes', collaborationController.getRecentChanges);

// Invitations
router.get('/invitations', collaborationController.getInvitations);
router.post('/invitations', collaborationController.sendInvitation);
router.put('/invitations/:invitationId', collaborationController.respondToInvitation);
router.delete('/invitations/:invitationId', collaborationController.cancelInvitation);

export default router;

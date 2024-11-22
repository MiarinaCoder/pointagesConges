
const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.put('/:id_session/terminer',  sessionController.terminerSession);
router.get('/:id_utilisateur',  sessionController.getSessionsByUser);
router.get('/:sessionId/heureDebut',  sessionController.getHeureDebut);
router.get('/weekly/:userId', sessionController.getWeeklyHours);
router.post('/cleanup', sessionController.cleanupSession);

module.exports = router;

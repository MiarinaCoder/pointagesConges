
const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');
const authMiddleware = require('../middleware/authMiddleware');

router.put('/:id_session/terminer', authMiddleware, sessionController.terminerSession);
router.get('/:id_utilisateur', authMiddleware, sessionController.getSessionsByUser);

module.exports = router;

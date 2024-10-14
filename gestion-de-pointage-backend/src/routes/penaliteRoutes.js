const express = require('express');
const router = express.Router();
const penaliteController = require('../controllers/penaliteController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, penaliteController.getAllPenalites);
router.post('/', authMiddleware, penaliteController.createPenalite);
router.put('/:id', authMiddleware, penaliteController.updatePenalite);
router.delete('/:id', authMiddleware, penaliteController.deletePenalite);

module.exports = router;

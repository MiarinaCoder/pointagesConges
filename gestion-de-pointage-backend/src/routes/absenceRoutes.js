const express = require('express');
const router = express.Router();
const absencesController = require('../controllers/absenceController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', absencesController.getAllAbsences);
router.get('/:id', absencesController.getAbsenceById);
router.post('/', absencesController.createAbsence);
router.put('/:id', absencesController.updateAbsence);
router.delete('/:id', absencesController.deleteAbsence);

module.exports = router;

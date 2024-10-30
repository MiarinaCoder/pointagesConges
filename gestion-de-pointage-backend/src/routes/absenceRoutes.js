const express = require('express');
const router = express.Router();
const absencesController = require('../controllers/absenceController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/abs', absencesController.getAllAbsences);
router.get('/conge', absencesController.getAllConges);
router.get('/:id', absencesController.getAbsenceById);
router.post('/', absencesController.createAbsence);
router.put('/:id', absencesController.updateAbsence);
router.delete('/:id', absencesController.deleteAbsence);

//recuperer absence et conge where id_utilisateur
router.get('/abs/user/:userId', absencesController.getAbsencesByUserId);
router.get('/conge/user/:userId', absencesController.getCongesByUserId);

//modifier le status
router.patch('/conge/status/:id', absencesController.updateStatus);

module.exports = router;

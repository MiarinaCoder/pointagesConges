const express = require('express');
const router = express.Router();
const penaliteController = require('../controllers/penaliteController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/',  penaliteController.getAllPenalites);
router.post('/',  penaliteController.createPenalite);
router.put('/:id',  penaliteController.updatePenalite);
router.delete('/:id',  penaliteController.deletePenalite);
router.get('/user/:userId',  penaliteController.getPenalitesByUserId);

module.exports = router;

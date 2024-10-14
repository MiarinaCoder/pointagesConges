const express = require('express');
const router = express.Router();
const rattrapageController = require('../controllers/rattrapageController');
const authMiddleware=require('../middleware/authMiddleware')

router.post('/', authMiddleware, rattrapageController.addRattrapage);
router.put('/:id', authMiddleware,rattrapageController.updateRattrapage);
router.delete('/:id', authMiddleware, rattrapageController.deleteRattrapage);
router.get('/', authMiddleware, rattrapageController.getAllRattrapages);

module.exports = router;

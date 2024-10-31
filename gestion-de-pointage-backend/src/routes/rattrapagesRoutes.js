const express = require('express');
const router = express.Router();
const rattrapageController = require('../controllers/rattrapageController');
const authMiddleware=require('../middleware/authMiddleware')

router.use(authMiddleware);

router.post('/',  rattrapageController.addRattrapage);
router.put('/:id', rattrapageController.updateRattrapage);
router.delete('/:id',  rattrapageController.deleteRattrapage);
router.get('/',  rattrapageController.getAllRattrapages);
router.get('/:userId',  rattrapageController.getRattrapageByUserId);

module.exports = router;

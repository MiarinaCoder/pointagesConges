const express = require('express');
const router = express.Router();
const retardController = require('../controllers/retardController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);
router.get('/check/:sessionId', retardController.checkRetard);
router.put('/justify/:idRetard', retardController.updateJustification);
router.put('/description/:idRetard', retardController.updateDescription);
module.exports = router;
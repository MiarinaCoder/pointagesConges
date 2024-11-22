const express = require('express');
const router = express.Router();
const retardController = require('../controllers/retardController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);
router.get('/check/:sessionId', retardController.checkRetard);

module.exports = router;

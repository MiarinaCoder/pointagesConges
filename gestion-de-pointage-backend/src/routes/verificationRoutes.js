const express = require('express');
const router = express.Router();
const verificationController = require('../controllers/verificationController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/', verificationController.createVerification);
router.put('/:idVerification/respond', verificationController.respondToVerification);
router.get('/user', verificationController.getUserVerifications);

module.exports = router;

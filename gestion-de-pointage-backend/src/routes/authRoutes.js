const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { body } = require('express-validator');

router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').not().isEmpty().trim().escape()
], authController.login);

router.post('/request-reset', [
  body('email').isEmail().normalizeEmail()
], authController.requestPasswordReset);

router.post('/approve-reset/:requestId', authController.approvePasswordReset);

router.post('/reset-password', [
  body('email').isEmail().normalizeEmail(),
  body('newPassword').isLength({ min: 6 })
], authController.resetPassword);

router.get('/all-forget-password-requests', authController.getAllPasswordResetRequests);

module.exports = router;

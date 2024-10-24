const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { body } = require('express-validator');

router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').not().isEmpty().trim().escape()
], authController.login);

router.post('/mot-de-passe-oublie', authController.forgotPassword);

module.exports = router;

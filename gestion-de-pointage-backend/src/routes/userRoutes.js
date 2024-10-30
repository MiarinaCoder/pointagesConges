const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/',  userController.getAllUsers);
router.post('/',  userController.createUser);
router.put('/:id',  userController.updateUser);
router.delete('/:id',  userController.deleteUser);
router.get('/:id',  userController.getUserById);

module.exports = router;

const express = require('express');
const router = express.Router();
const multer = require('multer');
const justificationController = require('../controllers/justificationAbsenceController');
const authMiddleware = require('../middleware/authMiddleware');

const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

router.use(authMiddleware);

router.post('/',  upload.single('file'), justificationController.create);
router.get('/',justificationController.getAll);
router.get('/:id',  justificationController.getById);
router.delete('/:id',  justificationController.delete);

module.exports = router;

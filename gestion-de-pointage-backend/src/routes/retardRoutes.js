const express = require('express');
const router = express.Router();
const multer = require('multer');
const retardController = require('../controllers/retardController');
const authMiddleware = require('../middleware/authMiddleware');

const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

router.use(authMiddleware);
router.get('/check/:sessionId', retardController.checkRetard);
router.put('/justify/:idRetard', retardController.updateJustification);
router.put('/description/:idRetard', retardController.updateDescription);
router.post('/:idRetard/justification', upload.single('fichierJustificatif'), retardController.submitJustification);

module.exports = router;
const Retard = require('../models/retard');
const multer = require('multer');
const path = require('path');

// Configure multer for file upload
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/justifications/')
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + '-' + file.originalname)
//   }
// });

// const upload = multer({ storage: storage });

exports.checkRetard = async (req, res) => {
  try {
    const idSession = req.params.sessionId;
    if (!idSession) {
      return res.status(400).json({ message: 'Session ID is required' });
    }
    const retardInfo = await Retard.checkRetard(idSession);
    res.json(retardInfo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateJustification = async (req, res) => {
  try {
    const { idRetard } = req.params;
    const retardInfo = await Retard.updateJustification(idRetard);
    res.json(retardInfo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateDescription = async (req, res) => {
  try {
    const { idRetard } = req.params;
    const { description } = req.body;
    const result = await Retard.updateDescription(idRetard, description);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

  // exports.submitJustification = async (req, res) => {
  //   try {
  //     const idRetard = req.params.idRetard;
  //     const idUtilisateur = req.user.id;
    
  //     if (!req.file) {
  //       return res.status(400).json({
  //         success: false,
  //         message: "Fichier justificatif requis"
  //       });
  //     }

  //     const data = {
  //       fichierJustificatif: req.file.buffer.toString('base64'),
  //       nomFichier: req.file.originalname,
  //       typeDeFichier: req.file.mimetype,
  //       description: req.body.description || '',
  //       id_utilisateur: idUtilisateur
  //     };

  //     const result = await Retard.submitJustification(idRetard, data);

  //     res.status(200).json({
  //       success: true,
  //       message: "Justification soumise avec succès",
  //       data: result
  //     });

  //   } catch (error) {
  //     console.error('Error in submitJustification:', error);
  //     res.status(500).json({
  //       success: false,
  //       message: "Une erreur s'est produite lors de la soumission",
  //       error: error.message
  //     });
//     }
// }; 
exports.submitJustification = async (req, res) => {
  try {
      const idRetard = req.params.idRetard;
      const idUtilisateur = req.user.id;

      if (!req.file) {
          return res.status(400).json({
              success: false,
              message: "Fichier justificatif requis"
          });
      }

      const data = {
          fichierJustificatif: req.file.buffer,
          nomFichier: req.file.originalname,
          typeDeFichier: req.file.mimetype,
          description: req.body.description || '',
          id_utilisateur: idUtilisateur
      };

      const result = await Retard.submitJustification(idRetard, data);

      res.status(200).json({
          success: true,
          message: "Justification soumise avec succès",
          data: result
      });

  } catch (error) {
      console.error('Error in submitJustification:', error);
      res.status(500).json({
          success: false,
          message: "Une erreur s'est produite lors de la soumission",
          error: error.message
      });
  }
};

const JustificationAbsence = require('../models/justification');
const { validationResult } = require('express-validator');

const justificationController = {
  create: async (req, res) => {
    try {
      if (!req.file) {
          return res.status(400).json({
              success: false,
              message: "No file uploaded"
          });
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const result = await JustificationAbsence.create({
        idRetard: req.body.idRetard,
        fichierJustificatif: req.file.buffer,
        nomFichier: req.file.originalname,
        typeDeFichier: req.file.mimetype,
        id_utilisateur: req.user.id // Get user ID from auth middleware
      });

      res.status(201).json({
        success: true,
        message: 'Justification uploaded successfully',
        file: req.file,
        id: result.insertId
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
        error: error.message
      });
    }
  },

  getById: async (req, res) => {
    try {
      const justification = await JustificationAbsence.getById(req.params.id);
  
      if (!justification) {
        return res.status(404).json({
          success: false,
          message: 'Justification not found',
        });
      }
  
      res.setHeader('Content-Type', justification.typeDeFichier);
      res.setHeader('Content-Disposition', `attachment; filename="${justification.nomFichier}"`);
      res.send(justification.fichierJustificatif);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving justification',
        error: error.message,
      });
    }
  },

  getAll: async (req, res) => {
    try {
      const justifications = await JustificationAbsence.getAll();
  
      res.json({
        success: true,
        data: justifications,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving justifications',
        error: error.message,
      });
    }
  },

  delete: async (req, res) => {
    try {
      const result = await JustificationAbsence.delete(req.params.id);

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Justification not found'
        });
      }

      res.json({
        success: true,
        message: 'Justification deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting justification',
        error: error.message
      });
    }
  }
};

module.exports = justificationController;

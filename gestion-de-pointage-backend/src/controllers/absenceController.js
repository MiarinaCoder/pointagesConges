const Absence = require('../models/absence');

exports.getAllAbsences = async (req, res) => {
    try {
        const [absence] = await Absence.findAllAbsence();
        res.status(200).json(absence);
      } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
        res.status(500).json({ message: 'Erreur serveur lors de la récupération des utilisateurs' });
      }
};

exports.getAbsencesByUserId = async (req, res) => {
  try {
    const [absences] = await Absence.getAbsencesByUserId(req.params.userId);
    res.status(200).json(absences);
  } catch (error) {
    console.error('Erreur lors de la récupération des absences:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.getAllConges = async (req, res) => {
    try {
        const [absence] = await Absence.findAllConge();
        res.status(200).json(absence);
      } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
        res.status(500).json({ message: 'Erreur serveur lors de la récupération des utilisateurs' });
      }
};

exports.getCongesByUserId = async (req, res) => {
  try {
    const [conges] = await Absence.getCongesByUserId(req.params.userId);
    res.status(200).json(conges);
  } catch (error) {
    console.error('Erreur lors de la récupération des congés:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.getAbsenceById = async (req, res) => {
    try {
        const [absence] = await Absence.findById(req.params.id);
        res.status(200).json(absence);
      } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
        res.status(500).json({ message: 'Erreur serveur lors de la récupération des utilisateurs' });
      }
};

exports.createAbsence = async (req, res) => {
  try {
    const result = await Absence.create(req.body);
    res.status(201).json({ message: "Absence créée avec succès", id: result.insertId });
  } catch (error) {
    if (error.message.includes('ne peut pas dépasser') || error.message.includes('ne pouvez pas prendre plus de')) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Erreur lors de la création de l'absence" });
    }
  }
};

exports.updateAbsence = async (req, res) => {
  try {
    const result = await Absence.update(req.body, req.params.id);
    if (result.affectedRows > 0) {
      res.json({ message: 'Absence updated successfully' });
    } else {
      res.status(404).json({ message: 'Absence not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteAbsence = async (req, res) => {
  try {
    const deleted = await Absence.delete(req.params.id);
    if (deleted) {
      res.json({ message: 'Absence supprimée avec succès' });
    } else {
      res.status(404).json({ message: 'Absence non trouvée' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'absence', error });
  }
};

exports.updateStatus= async (req, res) => {
  try {
    const result = await Absence.updateStatus(req.body.statut,req.params.id);
    if (result.affectedRows > 0) {
      res.json({ message: 'Absence updated successfully' });
    } else {
      res.status(404).json({ message: 'Absence not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
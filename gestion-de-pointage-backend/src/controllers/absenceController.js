const Absence = require('../models/absence');

exports.getAllAbsences = async (req, res) => {
    try {
        const [absence] = await Absence.findAll();
        res.status(200).json(absence);
      } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
        res.status(500).json({ message: 'Erreur serveur lors de la récupération des utilisateurs' });
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
    const newAbsence = await Absence.create(req.body);
    res.status(201).json(newAbsence);
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la création de l\'absence', error });
  }
};

exports.updateAbsence = async (req, res) => {
  try {
    const [updated] = await Absence.update(req.body, req.params.id);
    if (updated) {
      const updatedAbsence = await Absence.update(req.body, req.params.id);
      res.json(updatedAbsence);
    } else {
      res.status(404).json({ message: 'Absence non trouvée' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la mise à jour de l\'absence', error });
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

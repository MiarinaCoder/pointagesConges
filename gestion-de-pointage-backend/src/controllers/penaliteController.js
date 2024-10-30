const Penalite = require('../models/Penalite');

exports.getAllPenalites = async (req, res) => {
  try {
    const [penalites] = await Penalite.getAllPenalites();
    res.status(200).json(penalites);
  } catch (error) {
    console.error('Erreur lors de la récupération des pénalités:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des pénalités' });
  }
};

exports.createPenalite = async (req, res) => {
  const { id_utilisateur, montant, date, estApprouve } = req.body;

  try {
    const [result] = await Penalite.createPenalite({ id_utilisateur, montant, date, estApprouve });
    res.status(201).json({ message: 'Pénalité créée avec succès', id: result.insertId });
  } catch (error) {
    console.error('Erreur lors de la création de la pénalité:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la création de la pénalité' });
  }
};

exports.updatePenalite = async (req, res) => {
  const { id } = req.params;
  const { id_utilisateur, montant, date, estApprouve } = req.body;

  try {
    await Penalite.updatePenalite({ id_utilisateur, montant, date, estApprouve }, id);
    res.status(200).json({ message: 'Pénalité mise à jour avec succès' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la pénalité:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la mise à jour de la pénalité' });
  }
};

exports.deletePenalite = async (req, res) => {
  const { id } = req.params;

  try {
    await Penalite.deletePenalite(id);
    res.status(200).json({ message: 'Pénalité supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la pénalité:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la suppression de la pénalité' });
  }
};

exports.getPenalitesByUserId = async (req, res) => {
  try {
    const [penalites] = await Penalite.getPenalitesByUserId(req.params.userId);
    res.status(200).json(penalites);
  } catch (error) {
    console.error('Erreur lors de la récupération des pénalités:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
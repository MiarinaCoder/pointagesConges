const ParametresTravail = require('../models/parametresTravail');

// Récupérer les paramètres actuels
exports.getParametres = async (req, res) => {
  try {
    const [rows] = await ParametresTravail.getAll();
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des paramètres.' });
  }
};

// Mettre à jour les paramètres de travail
exports.updateParametres = async (req, res) => {
  const { tempsDebutTravail, dureeJourneeTravail, seuilHeuresSupp, montantPenalite, heurePause } = req.body;
  try {
    await ParametresTravail.update({ tempsDebutTravail, dureeJourneeTravail, seuilHeuresSupp, montantPenalite, heurePause });
    res.status(200).json({ message: 'Paramètres mis à jour avec succès.' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour des paramètres.' });
  }
};

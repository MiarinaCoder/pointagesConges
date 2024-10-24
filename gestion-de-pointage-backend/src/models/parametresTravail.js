const db = require('../config/db');

const ParametresTravail = {
  // Récupérer les paramètres actuels
  getAll: () => {
    return db.query('SELECT * FROM parametrestravail');
  },

  // Mettre à jour les paramètres
  update: (params) => {
    const { tempsDebutTravail, dureeJourneeTravail, seuilHeuresSupp, montantPenalite, heurePause } = params;
    return db.query(
      'UPDATE parametrestravail SET tempsDebutTravail = ?, dureeJourneeTravail = ?, seuilHeuresSupp = ?, montantPenalite = ?, heurePause = ?, dateModification = NOW()',
      [tempsDebutTravail, dureeJourneeTravail, seuilHeuresSupp, montantPenalite, heurePause]
    );
  }
};

module.exports = ParametresTravail;

const db = require('../config/db');

const Retard = {
  create: (retardData) => {
    return db.query(
      'INSERT INTO retard (idUtilisateur, dateRetard, heureArrivee, dureeRetard) VALUES (?, ?, ?, ?)',
      [retardData.idUtilisateur, retardData.dateRetard, retardData.heureArrivee, retardData.dureeRetard]
    );
  },

  getByUserId: (userId) => {
    return db.query(
      'SELECT r.*, u.nom, u.prenom FROM retard r JOIN utilisateur u ON r.idUtilisateur = u.id WHERE r.idUtilisateur = ?',
      [userId]
    );
  },

  checkRetard: async (userId) => {
    const [parametres] = await db.query('SELECT tempsDebutTravail FROM parametrestravail LIMIT 1');
    const currentTime = new Date().toLocaleTimeString('fr-FR', { hour12: false });
    
    return {
      heureDebut: parametres[0].tempsDebutTravail,
      heureArrivee: currentTime
    };
  }};

module.exports = Retard;

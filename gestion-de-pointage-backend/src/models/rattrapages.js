const db = require('../config/db');

const Rattrapages = {
  addRattrapage: (rattrapage) => {
    const { id_utilisateur, date_penalite, heures_a_rattraper, raison } = rattrapage;
  
    const query = 'INSERT INTO rattrapages (id_utilisateur, date_penalite, heures_a_rattraper, raison) VALUES (?, ?, ?, ?)';
  
    return db.query(query, [id_utilisateur, date_penalite, heures_a_rattraper, raison]);
  },
  updateRattrapage: (rattrapage,id) => {
    const query = 'UPDATE rattrapages SET ? WHERE id_rattrapage = ?';
    return db.query(
        query,
        [rattrapage, id]
      );
  },
  deleteRattrapage: (id) => {
    const query = 'DELETE FROM rattrapages WHERE id_rattrapage = ?';
    return db.query(query, [
        id
      ]);
  },
  getAllRattrapages: () => {
    const query = `SELECT r.*, u.nom, u.prenom 
    FROM rattrapages r
    JOIN utilisateur u ON r.id_utilisateur = u.id`;
    return db.query(query)
      .then(([results, fields]) => results)
      .catch(error => { throw error });
  },
  getRattrapagesByUserId: (userId) => {
    const query= `SELECT r.*, u.nom, u.prenom 
       FROM rattrapages r
       JOIN utilisateur u ON r.id_utilisateur = u.id 
       WHERE r.id_utilisateur = ?`;
       return db.query(
        query,
        [userId]
      );
  }
};

module.exports = Rattrapages;
const db = require("../config/db");

const Penalite = {
  getAllPenalites: () => {
    return db.query(
      "SELECT p.*, u.nom, u.prenom FROM penalite p JOIN utilisateur u ON p.id_utilisateur = u.id"
    );
  },
  createPenalite: (penalite) => {
    return db.query(
      "INSERT INTO penalite (id_utilisateur, montant, date, estApprouve) VALUES (?, ?, ?, ?)",
      [penalite.id_utilisateur, penalite.montant, penalite.date, penalite.estApprouve]
    );
  },
  updatePenalite: (penalite, id) => {
    return db.query(
      "UPDATE penalite SET id_utilisateur=?, montant=?, date=?, estApprouve=? WHERE idPenalite=?",
      [penalite.id_utilisateur, penalite.montant, penalite.date, penalite.estApprouve, id]
    );
  },
  deletePenalite: (id) => {
    return db.query("DELETE FROM penalite WHERE idPenalite=?", [id]);
  },
  getPenaliteById: (id) => {
    return db.query("SELECT * FROM penalite WHERE idPenalite = ?", [id]);
  },
  getPenalitesByUserId: (userId) => {
    return db.query(
      `SELECT p.*, u.nom, u.prenom 
       FROM penalite p 
       JOIN utilisateur u ON p.id_utilisateur = u.id 
       WHERE p.id_utilisateur = ?`,
      [userId]
    );
  }
};

module.exports = Penalite;

const db = require("../config/db");

const Absence = {
  findAll: () => {
    return db.query("SELECT * FROM absence");
  },
  findById: (id) => {
    return db.query("SELECT * FROM absence WHERE idAbsence = ?", [id]);
  },
  create: (absence) => {
    return db.query(
      "INSERT INTO absence (id_utilisateur, dateDebutAbsence, dateFinAbsence, motif, statut, type) VALUES (?, ?, ?, ?, ?, ?)",
      [absence.id_utilisateur, absence.dateDebutAbsence, absence.dateFinAbsence, absence.motif, absence.statut, absence.type]
    );
  },
  update: (absence, id) => {
    return db.query(
      "UPDATE absence SET id_utilisateur = ?, dateDebutAbsence = ?, dateFinAbsence = ?, motif = ?, statut = ?, type = ? WHERE idAbsence = ?",
      [absence.id_utilisateur, absence.dateDebutAbsence, absence.dateFinAbsence, absence.motif, absence.statut, absence.type, id]
    );
  },
  delete: (id) => {
    return db.query("DELETE FROM absence WHERE idAbsence = ?", [id]);
  },
  findByUserId: (userId) => {
    return db.query("SELECT * FROM absence WHERE id_utilisateur = ?", [userId]);
  }
};

module.exports = Absence;

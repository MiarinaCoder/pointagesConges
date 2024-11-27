const db = require('../config/db');

const JustificationAbsence = {
  create: async (data) => {
    const [result] = await db.execute(
      'INSERT INTO justification (fichierJustificatif, nomFichier, typeDeFichier, idRetard, id_utilisateur) VALUES (?, ?, ?, ?, ?)',
      [
        data.fichierJustificatif || null,
        data.nomFichier || null,
        data.typeDeFichier || null,
        data.idRetard || null,
        data.id_utilisateur || null
      ]
    );
    return result;
  },
  getById: async (id) => {
    const [rows] = await db.execute(
      'SELECT * FROM justification WHERE idJustification = ?', 
      [id]
    );
    return rows[0];
  },

  getAll: async () => {
    const [rows] = await db.execute(
      `SELECT j.idJustification, j.idRetard, j.nomFichier, j.typeDeFichier, j.dateAjout, 
       u.nom, u.prenom, r.description as retardDescription
       FROM justification j 
       JOIN utilisateur u ON j.id_utilisateur = u.id
       LEFT JOIN retards r ON j.idRetard = r.idRetard`
    );
    return rows;
  },
  

  delete: async (id) => {
    const [result] = await db.execute(
      'DELETE FROM justification WHERE idJustification = ?',
      [id]
    );
    return result;
  },

  getAllByAbsence: async (idAbsence) => {
    const [rows] = await db.execute(
      'SELECT * FROM justification WHERE idRetard = ?',
      [idRetard]
    );
    return rows;
  }
};

module.exports = JustificationAbsence;

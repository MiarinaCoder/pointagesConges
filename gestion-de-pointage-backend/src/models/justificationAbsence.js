const db = require('../config/db');

const JustificationAbsence = {
  create: async (data) => {
    const [result] = await db.execute(
      'INSERT INTO justificationabsence ( fichierJustificatif, nomFichier, typeDeFichier) VALUES ( ?, ?, ?)',
      [data.fichierJustificatif, data.nomFichier, data.typeDeFichier]
    );
    //idAbsence,  data.idAbsence, 
    return result;
  },

  getById: async (id) => {
    const [rows] = await db.execute(
      'SELECT * FROM justificationabsence WHERE idJustification = ?', 
      [id]
    );
    return rows[0];
  },

  // getAll: async () => {
  //   const [rows] = await db.execute(
  //     'SELECT * FROM justificationabsence', 
  //   );
  //   return rows[0];
  // },
  getAll: async () => {
    const [rows] = await db.execute(
      'SELECT idJustification, idAbsence, nomFichier, typeDeFichier, dateAjout FROM justificationabsence'
    );
    return rows; // Retournez tous les fichiers sans leur contenu
  },
  

  delete: async (id) => {
    const [result] = await db.execute(
      'DELETE FROM justificationabsence WHERE idJustification = ?',
      [id]
    );
    return result;
  },

  getAllByAbsence: async (idAbsence) => {
    const [rows] = await db.execute(
      'SELECT * FROM justificationabsence WHERE idAbsence = ?',
      [idAbsence]
    );
    return rows;
  }
};

module.exports = JustificationAbsence;

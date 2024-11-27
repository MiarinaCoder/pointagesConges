const db = require('../config/db');

const Verification = {
  create: async (idUtilisateur,aRepondu) => {
    const [result] = await db.execute(
      'INSERT INTO Verification (idUtilisateur, dateVerification, aRepondu, delaiReponse) VALUES (?, NOW(), ?, 60)',
      [idUtilisateur,aRepondu]
    );
    return result.insertId;
  },

  updateResponse: async (idVerification, aRepondu) => {
    const [result] = await db.execute(
      'UPDATE Verification SET aRepondu = ? WHERE idVerification = ?',
      [aRepondu, idVerification]
    );
    return result;
  },

  getByUser: async (idUtilisateur) => {
    const [rows] = await db.execute(
      'SELECT * FROM Verification WHERE idUtilisateur = ? ORDER BY dateVerification DESC',
      [idUtilisateur]
    );
    return rows;
  }
};

module.exports = Verification;

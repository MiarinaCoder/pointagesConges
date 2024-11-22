const db = require("../config/db");

const Retard = {
  getByUserId: (userId) => {
    return db.query(
      "SELECT r.*, u.nom, u.prenom FROM retard r JOIN utilisateur u ON r.idUtilisateur = u.id WHERE r.idUtilisateur = ?",
      [userId]
    );
  },

  checkRetard: async (idSession) => {
    console.log("Checking retard for session:", idSession);

    if (!idSession) {
      return {
        estEnRetard: false,
        message: "Session non trouvée",
      };
    }

    //TIME_FORMAT(r.dureeRetard, '%i') as dureeRetard,
    const [retards] = await db.query(
      `
    SELECT 
    r.idRetard,
    r.idSession,
    TIME_FORMAT(r.dureeRetard, '%H') AS heuresRetard,
    TIME_FORMAT(r.dureeRetard, '%i') AS minutesRetard,
    TIME_FORMAT(r.dureeRetard, '%s') AS secondesRetard,
    st.heureDebut AS heureArrivee
    FROM retards r
    JOIN sessionTravail st ON r.idSession = st.idSession
    WHERE r.idSession = ?;
    `,
      [idSession]
    );

    console.log("Retards found:", retards);

    if (retards.length === 0) {
      return {
        estEnRetard: false,
        message: "Pas de retard pour cette session",
      };
    }

    const retard = retards[0];
    return {
      estEnRetard: true,
      heuresRetard: retard.heuresRetard,
      minutesRetard: retard.minutesRetard,
      secondesRetard: retard.secondesRetard,
      heureArrivee: retard.heureArrivee,
      idRetard: retard.idRetard,
      idSession: retard.idSession,
    };
  },
};
module.exports = Retard;

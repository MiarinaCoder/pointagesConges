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

    const [retards] = await db.query(
      `
    SELECT 
    r.idRetard,
    r.idSession,
    r.estJustifie,
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
      isJustified: retard.estJustifie === 1
    };
  },

  updateJustification: async (idRetard) => {
    const [result] = await db.query(
      "UPDATE retards SET estJustifie = 1 WHERE idRetard = ?",
      [idRetard]
    );
    
    if (result.affectedRows === 0) {
      throw new Error("Retard not found");
    }
    
    return {
      success: true,
      message: "Justification updated successfully"
    };
  },

  // Nouvelle méthode pour mettre à jour uniquement la description
  updateDescription: async (idRetard, description) => {
    const [result] = await db.query(
      "UPDATE retards SET description = ? WHERE idRetard = ?",
      [description, idRetard]
    );
    
    if (result.affectedRows === 0) {
      throw new Error("Retard not found");
    }
    
    return {
      success: true,
      message: "Description updated successfully"
    };
  },

  submitJustification: async (retardId, data) => {
    const connection = await db.getConnection();
  
    try {
      await connection.beginTransaction();
    
      // Insert into justification table with id_utilisateur
      const [justificationResult] = await connection.query(
        `INSERT INTO justification 
        (idRetard, fichierJustificatif, nomFichier, typeDeFichier, description, id_utilisateur) 
        VALUES (?, ?, ?, ?, ?, ?)`,
        [retardId, data.fichierJustificatif, data.nomFichier, data.typeDeFichier, data.description, data.id_utilisateur]
      );

      // Update retard status
      await connection.query(
        "UPDATE retards SET estJustifie = 1 WHERE idRetard = ?",
        [retardId]
      );

      await connection.commit();
      return justificationResult;
    
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }};

module.exports= Retard;

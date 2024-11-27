const db = require("../config/db");

const Absence = {
  findAllConge: () => {
    return db.query(`
      SELECT a.*, u.nom AS nom_utilisateur, u.prenom AS prenom_utilisateur
      FROM absence a
      JOIN utilisateur u ON a.id_utilisateur = u.id WHERE type='congé' ORDER BY a.horodatageCreation DESC
    `);
  },
  getCongesByUserId: (userId) => {
    return db.query(
      `SELECT a.*, u.nom as nom_utilisateur, u.prenom as prenom_utilisateur 
       FROM absence a 
       JOIN utilisateur u ON a.id_utilisateur = u.id 
       WHERE a.id_utilisateur = ? AND a.type = 'conge' ORDER BY a.horodatageCreation DESC`,
      [userId]
    );
  },
  findAllAbsence: () => {
    return db.query(`
      SELECT a.*, u.nom AS nom_utilisateur, u.prenom AS prenom_utilisateur
      FROM absence a
      JOIN utilisateur u ON a.id_utilisateur = u.id WHERE type='absence'
    `);
  },
  getAbsencesByUserId: (userId) => {
    return db.query(
      `SELECT a.*, u.nom as nom_utilisateur, u.prenom as prenom_utilisateur 
       FROM absence a 
       JOIN utilisateur u ON a.id_utilisateur = u.id 
       WHERE a.id_utilisateur = ? AND a.type = 'absence'`,
      [userId]
    );
  },
  findById: (id) => {
    return db.query("SELECT * FROM absence WHERE idAbsence = ?", [id]);
  },
  create: async (absence) => {
    const mois = new Date(absence.dateDebutAbsence).getMonth() + 1; // Les mois en JavaScript sont de 0 à 11
    const annee = new Date(absence.dateDebutAbsence).getFullYear();
    const idUtilisateur = absence.id_utilisateur;

    // Interroger la base de données pour obtenir le nombre total de jours de congé standard pris par l'utilisateur pour le mois en cours
    const result = await db.query(
      "SELECT SUM(nombre_jour_conge) AS total_jours FROM absence WHERE id_utilisateur = ? AND type_de_conge = 'congé standard' AND MONTH(dateDebutAbsence) = ? AND YEAR(dateDebutAbsence) = ?",
      [idUtilisateur, mois, annee]
    );

    const totalJoursPris = result[0].total_jours || 0;
    const totalJoursApresAjout = totalJoursPris + absence.nombre_jour_conge;

    // Vérification du type de congé et du nombre de jours
    if (
      absence.type_de_conge === "congé de maternité" ||
      absence.type_de_conge === "congé de paternité"
    ) {
      if (absence.nombre_jour_conge !== 15) {
        throw new Error(
          `Le nombre de jours pour un ${absence.type_de_conge} ne peut pas dépasser 15 jours.`
        );
      }
    } else if (absence.type_de_conge === "congé standard") {
      if (totalJoursApresAjout > 2.5) {
        throw new Error(
          "Vous ne pouvez pas prendre plus de 2,5 jours de congé standard par mois."
        );
      }
    }
    return db.query(
      "INSERT INTO absence (id_utilisateur, dateDebutAbsence, dateFinAbsence, type_de_conge, nombre_jour_conge, motif,type) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        absence.id_utilisateur,
        absence.dateDebutAbsence,
        absence.dateFinAbsence,
        absence.type_de_conge,
        absence.nombre_jour_conge,
        absence.motif || 'Congé légal',  // Set a default value
        "congé",
      ]
    );
  },
  update: async (absence, id) => {
    const mois = new Date(absence.dateDebutAbsence).getMonth() + 1;
    const annee = new Date(absence.dateDebutAbsence).getFullYear();
    const idUtilisateur = absence.id_utilisateur;

    const result = await db.query(
      "SELECT SUM(nombre_jour_conge) AS total_jours FROM absence WHERE id_utilisateur = ? AND type_de_conge = 'congé standard' AND MONTH(dateDebutAbsence) = ? AND YEAR(dateDebutAbsence) = ?",
      [idUtilisateur, mois, annee]
    );

    const totalJoursPris = result[0].total_jours || 0;
    const totalJoursApresAjout = totalJoursPris + absence.nombre_jour_conge;

    if (
      absence.type_de_conge === "congé de maternité" ||
      absence.type_de_conge === "congé de paternité"
    ) {
      if (absence.nombre_jour_conge !== 15) {
        throw new Error(
          `Le nombre de jours pour un ${absence.type_de_conge} ne peut pas dépasser 15 jours.`
        );
      }
    } else if (absence.type_de_conge === "congé standard") {
      if (totalJoursApresAjout > 2.5) {
        throw new Error(
          "Vous ne pouvez pas prendre plus de 2,5 jours de congé standard par mois."
        );
      }
    }

    const updateResult = await db.query(
      "UPDATE absence SET id_utilisateur = ?, dateDebutAbsence = ?, dateFinAbsence = ?, type_de_conge = ?, nombre_jour_conge=?, motif = ? WHERE idAbsence = ?",
      [
        absence.id_utilisateur,
        absence.dateDebutAbsence,
        absence.dateFinAbsence,
        absence.type_de_conge,
        absence.nombre_jour_conge,
        absence.motif,
        id
      ]
    );
    
    return updateResult[0];
  },  
  delete: (id) => {
    return db.query("DELETE FROM absence WHERE idAbsence = ?", [id]);
  },
  findByUserId: (userId) => {
    return db.query("SELECT * FROM absence WHERE id_utilisateur = ?", [userId]);
  },
  updateStatus: async(statut,id) => {
    const updateResultStatus = await db.query("UPDATE absence SET statut = ? WHERE idAbsence = ?", [statut,id]);
    return updateResultStatus[0];
  },
  getAbsencesByPeriod: async(period, offset)=> {
    let query = `
      SELECT a.*, u.nom, u.prenom 
      FROM absence a
      JOIN utilisateur u ON a.id_utilisateur = u.id
      WHERE 1=1 AND  a.type = 'absence'
    `;

    switch (period) {
      case 'today':
        query += ` AND DATE(a.dateDebutAbsence) = DATE_SUB(CURDATE(), INTERVAL ? DAY)`;
        break;
      case 'week':
        query += ` AND YEARWEEK(a.dateDebutAbsence, 1) = YEARWEEK(DATE_SUB(CURDATE(), INTERVAL ? WEEK), 1)`;
        break;
      case 'month':
        query += ` AND DATE_FORMAT(a.dateDebutAbsence, '%Y-%m') = DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL ? MONTH), '%Y-%m')`;
        break;
    }

    return await db.query(query, [offset]);
  },
 
  getAbsencesByPeriodWhereUser: async( userId, period, offset)=> {
    // Validate and set default values
    const validUserId = userId || null;
    const validOffset = offset || 0;
    const validPeriod = period || 'month';

    let params = [validUserId];


    let query = `
      SELECT a.*, u.nom, u.prenom 
      FROM absence a
      JOIN utilisateur u ON a.id_utilisateur = u.id
      WHERE 1=1 AND  a.type = 'absence' AND a.id_utilisateur = ?
    `;
    // if (period) {
    switch (validPeriod) {
      case 'today':
        query += ` AND DATE(a.dateDebutAbsence) = DATE_SUB(CURDATE(), INTERVAL ? DAY)`;
        params.push(validOffset);
        break;
      case 'week':
        query += ` AND YEARWEEK(a.dateDebutAbsence, 1) = YEARWEEK(DATE_SUB(CURDATE(), INTERVAL ? WEEK), 1)`;
        params.push(validOffset);
        break;
      case 'month':
        query += ` AND DATE_FORMAT(a.dateDebutAbsence, '%Y-%m') = DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL ? MONTH), '%Y-%m')`;
        params.push(validOffset);
        break;
    }
  // }
    
    const mimi= await db.query(query, params);
    return mimi;
  },

  getUserAttendanceStats : (userId, period = 'month') => {
  return db.query(`
    WITH all_days AS (
      SELECT DISTINCT DATE(heureDebut) as work_date
      FROM sessionTravail 
      WHERE id_utilisateur = ?
      AND DATE(heureDebut) >= DATE_SUB(CURDATE(), INTERVAL 1 ${period})
    ),
    day_status AS (
      SELECT 
        ad.work_date,
        CASE
          WHEN r.idRetard IS NOT NULL THEN 'LATE'
          WHEN a.idAbsence IS NOT NULL THEN 'ABSENT'
          ELSE 'PRESENT'
        END as status
      FROM all_days ad
      LEFT JOIN sessionTravail s ON DATE(s.heureDebut) = ad.work_date
      LEFT JOIN retards r ON r.idSession = s.idSession
      LEFT JOIN absence a ON DATE(a.dateDebutAbsence) = ad.work_date AND a.id_utilisateur = s.id_utilisateur
      WHERE s.id_utilisateur = ?
    )
    SELECT
      (COUNT(CASE WHEN status = 'PRESENT' THEN 1 END) * 100.0 / COUNT(*)) as present_percentage,
      (COUNT(CASE WHEN status = 'ABSENT' THEN 1 END) * 100.0 / COUNT(*)) as absent_percentage,
      (COUNT(CASE WHEN status = 'LATE' THEN 1 END) * 100.0 / COUNT(*)) as late_percentage
    FROM day_status
  `, [userId, userId]);
},

  getGlobalAttendanceStats : () => {
    return db.query(`
      WITH total_users AS (
        SELECT COUNT(*) as total_count 
        FROM utilisateur 
      ),
      user_status AS (
      SELECT 
  u.id,
  CASE
    WHEN EXISTS (
      SELECT 1 
      FROM sessionTravail s 
      JOIN retards r ON s.idSession = r.idSession 
      WHERE s.id_utilisateur = u.id 
      AND DATE(s.heureDebut) = CURDATE()
    ) THEN 'LATE'
    WHEN EXISTS (
      SELECT 1 
      FROM absence a 
      WHERE a.id_utilisateur = u.id 
      AND DATE(a.dateDebutAbsence) = CURDATE() 
      AND type='absence'
    ) THEN 'ABSENT'
    WHEN EXISTS (
      SELECT 1 
      FROM sessionTravail s 
      WHERE s.id_utilisateur = u.id 
      AND DATE(s.heureDebut) = CURDATE()
    ) THEN 'PRESENT'
    ELSE 'ABSENT'
  END as status
FROM utilisateur u
      )
      SELECT 
        (COUNT(CASE WHEN status = 'PRESENT' THEN 1 END)) as present_count,
        (COUNT(CASE WHEN status = 'ABSENT' THEN 1 END)) as absent_count,
        (COUNT(CASE WHEN status = 'LATE' THEN 1 END)) as late_count,
        (COUNT(CASE WHEN status = 'PRESENT' THEN 1 END) * 100.0 / COUNT(*)) as present_percentage,
        (COUNT(CASE WHEN status = 'ABSENT' THEN 1 END) * 100.0 / COUNT(*)) as absent_percentage,
        (COUNT(CASE WHEN status = 'LATE' THEN 1 END) * 100.0 / COUNT(*)) as late_percentage
      FROM user_status
    `);
  },
  

  suggestDates: async (idAbsence, suggestionData) => {
    return db.query(
      `UPDATE absence 
       SET date_suggere = ?,
           dateFinSuggere = ?, 
           status_suggestion = 'attente',
           statut = 'suggestion_attente'
       WHERE idAbsence = ?`,
      [suggestionData.dateDebutAbsence,suggestionData.dateFinAbsence, idAbsence]
    );
  },

  respondToSuggestion: async (idAbsence, accepted) => {
    console.log('suggestionData:', accepted);
    
    if (accepted) {
      return db.query(
        `UPDATE absence 
         SET dateDebutAbsence = date_suggere,
             dateFinAbsence = datefinSuggere,
             date_suggere = NULL,
             datefinsuggere=NULL,
             status_suggestion = 'oui',
             statut = 'approuvee'
         WHERE idAbsence = ?`,
        [idAbsence]
      );
    } else {
      return db.query(
        `UPDATE absence 
         SET date_suggere = NULL,
             status_suggestion = 'non',
             statut = 'rejete'
         WHERE idAbsence = ?`,
        [idAbsence]
      );
    }
  },
};

module.exports = Absence;

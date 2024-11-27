const db = require('../config/db');

const SessionsTravail = {



  create: async (session) => {
    try {
      const currentHour = new Date(session.heureDebut).getHours();
      
      if (currentHour < 0 || currentHour > 23) {

        const error = new Error('Les sessions ne peuvent être créées qu\'entre 8h et 16h');
        error.code = 'HOURS_RESTRICTION';
        throw error;
      }

      const [existingSessions] = await db.query(
        'SELECT * FROM sessionTravail WHERE id_utilisateur = ? AND heureFin IS NULL', 
        [session.id_utilisateur]
      );

      if (existingSessions.length > 0) {
        const error = new Error('Une session active existe déjà pour cet utilisateur');
        error.code = 'ACTIVE_SESSION';
        throw error;
      }


      return db.query(`CALL sp_create_session(?, ?)`, 
        [session.id_utilisateur, session.heureDebut]
      );
    } catch (error) {
      throw error;
    }
  },    
  
  addSession: (session) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // set time to 00:00:00.000
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
  
    // Check if a session already exists for today
    return db.query('SELECT * FROM sessionTravail WHERE date >= ? AND date < ?', [today, tomorrow])
      .then(([results, fields]) => {
        if (results.length > 0) {
          // A session already exists for today, throw an error
          throw new Error('A session already exists for today');
        } else {
          // No session exists for today, proceed with adding the session
          const query = 'INSERT INTO sessionTravail SET ?';
          return db.query(query, session);
        }
      })
      .catch(error => { throw error });
  },

  update: (idSession, session) => {
    return db.query('CALL sp_update_session(?, ?)', [idSession, session.heureFin]);
  },
  update1: async (idSession, session) => {
    try {
      const result = await db.query(
        'UPDATE sessionTravail SET heureFin = ? WHERE idSession = ? AND heureFin IS NULL',
        [session.heureFin, idSession]
      );
      return result;
    } catch (error) {
      throw error;
    }
  },
  getSessionTravail: (id_utilisateur) => {
    return db.query('SELECT * FROM sessionTravail WHERE id_utilisateur = ? ORDER BY heureDebut DESC', [id_utilisateur]);
  },

  getHeureDebut: (sessionId) => {
    return db.query('SELECT heureDebut FROM sessionTravail WHERE idSession = ?', [sessionId]);
  },

  getWeeklyHours: (userId) => {
    return db.query(`
      SELECT (heureDebut) as jour,
        SUM(TIMESTAMPDIFF(HOUR, heuredebut, heurefin)) as heures_jour,
        SUM(TIMESTAMPDIFF(MINUTE, heuredebut, heurefin))/60 as heures_precises
      FROM sessionTravail 
      WHERE id_utilisateur = ? 
        AND WEEK(heureDebut) = WEEK(CURRENT_DATE)
        AND DAYOFWEEK(heureDebut) BETWEEN 2 AND 6
      GROUP BY DAYNAME(heureDebut)
      ORDER BY DAYOFWEEK(heureDebut)`,
      [userId]
    );
  },

  getTotalWeeklyHours: (userId) => {
    return db.query(`
      SELECT 
        SUM(TIMESTAMPDIFF(MINUTE, heureDebut, heurefin))/60 as total_heures_semaine
      FROM sessiontravail
      WHERE id_utilisateur = ?
        AND WEEK(heuredebut) = WEEK(CURRENT_DATE)
        AND DAYOFWEEK(heuredebut) BETWEEN 2 AND 6`,
      [userId]
    );
  },

  getSessionById: (sessionId) => {
    return db.query('SELECT * FROM sessionTravail WHERE idSession = ?', [sessionId]);
  }

};

module.exports = SessionsTravail;

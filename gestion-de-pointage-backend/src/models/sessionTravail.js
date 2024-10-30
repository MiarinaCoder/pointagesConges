const db = require('../config/db');
const moment = require('moment');

const SessionsTravail = {
  // create: (session) => {
  //   return db.query('INSERT INTO sessionTravail (id_utilisateur, heureDebut) VALUES (?, ?)', [session.id_utilisateur, session.heureDebut]);
  // },
  create: (session) => {
    return db.query(`
      CALL sp_create_session(?, ?)
    `, [session.id_utilisateur, session.heureDebut]);
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

//   addSession: (session) => {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0); // set time to 00:00:00.000
//     const tomorrow = new Date(today);
//     tomorrow.setDate(tomorrow.getDate() + 1);
    
//     // Vérification de la présence d'une session existante
//     return db.query('SELECT * FROM sessionTravail WHERE id_utilisateur = ? AND heureDebut >= ? AND heureDebut < ?', 
//     [session.id_utilisateur, today, tomorrow])
//         .then(([rows]) => {
//             if (rows.length > 0) {
//                 // Une session existe déjà pour cet utilisateur aujourd'hui
//                 throw new Error('Une session existe déjà pour cet utilisateur aujourd\'hui');
//             } else {
//                 // Insérer la nouvelle session si aucune n'existe
//                 return db.query('INSERT INTO sessionTravail (id_utilisateur, heureDebut) VALUES (?, ?)', [session.id_utilisateur, session.heureDebut]);
//             }
//         })
//         .catch(error => {
//             throw error;
//         });
// },


  // update: (idSession, session) => {
  //   return db.query('UPDATE sessionTravail SET heureFin = ?, heuresTravaillees = ? WHERE idSession = ?', [session.heureFin, session.heuresTravaillees, idSession]);
  // },

  // update: function(idSession, session) {
  //   return db.query('SELECT heureDebut FROM sessionTravail WHERE idSession = ?', [idSession])
  //     .then(([rows]) => {
  //       if (!rows.length) {
  //         throw new Error('Session non trouvée');
  //       }
  //       const debut = moment(rows[0].heureDebut);
  //       const fin = moment(session.heureFin);
  //       const duree = moment.duration(fin.diff(debut));
  //       const heuresTravaillees = duree.asHours();
  //       return db.query('UPDATE sessionTravail SET heureFin = ?, heuresTravaillees = ? WHERE idSession = ?', [session.heureFin, heuresTravaillees, idSession]);
  //     });
  // },

  update: (idSession, session) => {
    return db.query('CALL sp_update_session(?, ?)', [idSession, session.heureFin]);
  },
  getSessionTravail: (id_utilisateur) => {
    return db.query('SELECT * FROM sessionTravail WHERE id_utilisateur = ?', [id_utilisateur]);
  },
  // getTotalHeuresTravaillees: async function(id_utilisateur) {
  //   const sessions = await this.getSessionTravail(id_utilisateur);
    
  //   let totalHeuresTravaillees = 0;
  //   for (let session of sessions) {
  //     const debut = moment(session.heureDebut);
  //     const fin = moment(session.heureFin);
  //     const duree = moment.duration(fin.diff(debut));
  //     totalHeuresTravaillees += duree.asHours();
  //   }

  //   return totalHeuresTravaillees;
  // },
};

module.exports = SessionsTravail;

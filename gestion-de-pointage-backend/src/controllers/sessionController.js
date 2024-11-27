const moment = require('moment');
const SessionsTravail = require('../models/sessionTravail');

exports.getSessionsByUser = async (req, res) => {
  const { id_utilisateur } = req.params;
  try {
    const ui=await SessionsTravail.getSessionTravail(id_utilisateur);
    res.status(200).json({ ui });
  } catch (error) {
    console.error('Erreur lors de l\'affichage selon id l\'utilisateur:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la selection de l\'utilisateur' });
  }
};

exports.getHeureDebut= async (req, res) => {
  const { sessionId } = req.params;
  try {
    const ui=await SessionsTravail.getHeureDebut(sessionId);
    res.status(200).json({ ui });
  } catch (error) {
    console.error('Erreur lors de l\'affichage selon id l\'utilisateur:', error);
    res.status(500).json({ message: 'Erreur serveur lors de recuperation de heureDebut' });
  }
};


exports.getWeeklyHours = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Récupérer les heures par jour
    const [dailyHours] = await SessionsTravail.getWeeklyHours(userId);
    
    // Récupérer le total des heures de la semaine
    const [totalWeekly] = await SessionsTravail.getTotalWeeklyHours(userId);

    // Formater les données pour le front-end
    const weeklyStats = {
      dailyHours: {
        'Lundi': 0,
        'Mardi': 0,
        'Mercredi': 0,
        'Jeudi': 0,
        'Vendredi': 0
      },
      totalWeeklyHours: totalWeekly[0]?.total_heures_semaine || 0
    };

    // Remplir les heures par jour
    dailyHours.forEach(day => {
      weeklyStats.dailyHours[day.jour] = day.heures_precises;
    });

    res.status(200).json(weeklyStats);
  } catch (error) {
    console.error('Erreur lors de la récupération des heures:', error);
    res.status(500).json({ 
      error: "Erreur lors de la récupération des heures",
      details: error.message 
    });
  }
};

exports.cleanupSession = async (req, res) => {
  const { sessionId } = req.body;
  const endTime = moment().format('YYYY-MM-DD HH:mm:ss');

  try {
    const [session] = await SessionsTravail.getSessionById(sessionId);
    
    if (!session) {
      return res.status(404).json({ message: 'Session non trouvée' });
    }

    if (session.heureFin) {
      return res.status(400).json({ message: 'Session déjà terminée' });
    }

    await SessionsTravail.update1(sessionId, { heureFin: endTime });
    
    res.status(200).json({ 
      success: true,
      message: 'Session terminée avec succès',
      timestamp: endTime
    });
  } catch (error) {
    console.error('Erreur lors du nettoyage de la session:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erreur lors de la terminaison de la session'
    });
  }
};

exports.terminerSession = async (req, res) => {
  const { id_session } = req.params;
  let { endTime } = req.body;

  endTime = moment(endTime).format('YYYY-MM-DD HH:mm:ss');
  
  try {
    const [session] = await SessionsTravail.getSessionById(id_session);
    
    if (!session) {
      return res.status(404).json({ message: 'Session non trouvée' });
    }

    if (session.heureFin) {
      return res.status(400).json({ message: 'Cette session est déjà terminée' });
    }

    const [result] = await SessionsTravail.update(id_session, { heureFin: endTime });
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Session non trouvée' });
    }

    res.status(200).json({ message: 'Session terminée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la terminaison de la session:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la terminaison de la session' });
  }
};

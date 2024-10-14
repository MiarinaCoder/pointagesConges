const moment = require('moment');
const SessionsTravail = require('../models/sessionTravail');

exports.terminerSession = async (req, res) => {
  const { id_session } = req.params;
  let { endTime } = req.body;

  // Convertir endTime en format "YYYY-MM-DD HH:mm:ss"
  endTime = moment(endTime).format('YYYY-MM-DD HH:mm:ss');

  try {
    // const heuresTravaillees = await SessionsTravail.getTotalHeuresTravaillees(req.body.id_utilisateur);
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

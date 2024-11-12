const Retard = require('../models/retard');
const moment = require('moment');

exports.checkRetard = async (req, res) => {
  try {
    const userId = req.user.id;
    const retardInfo = await Retard.checkRetard(userId);
    
    if (!retardInfo.heureArrivee) {
      return res.status(404).json({ message: 'Aucune connexion trouvée' });
    }

    const heureDebut = moment(retardInfo.heureDebut, 'HH:mm:ss');
    const heureArrivee = moment(retardInfo.heureArrivee, 'HH:mm:ss');
    
    const estEnRetard = heureArrivee.isAfter(heureDebut);
    const dureeRetard = estEnRetard ? heureArrivee.diff(heureDebut, 'minutes') : 0;

    if (estEnRetard) {
      await Retard.create({
        idUtilisateur: userId,
        dateRetard: moment().format('YYYY-MM-DD'),
        heureArrivee: retardInfo.heureArrivee,
        dureeRetard
      });
    }

    res.json({
      estEnRetard,
      dureeRetard,
      heureArrivee: retardInfo.heureArrivee,
      heureDebut: retardInfo.heureDebut
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

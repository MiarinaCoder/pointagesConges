const Rattrapages = require("../models/rattrapages");
const moment = require("moment");

exports.addRattrapage = async (req, res) => {
    try {
      const { date, hours, reason } = req.body;
      const id_utilisateur = req.user.id;
  
      if (!date || !hours || !reason) {
        return res.status(400).json({ message: 'Tous les champs sont requis' });
      }
  
      const formattedDate = moment(date).format('YYYY-MM-DD');
      
      if (!moment(formattedDate, 'YYYY-MM-DD', true).isValid()) {
        console.log('Invalid date:', date);
        return res.status(400).json({ message: 'Format de date invalide' });
      }
  
      const result = await Rattrapages.addRattrapage({
        id_utilisateur,
        date_penalite: formattedDate,
        heures_a_rattraper: hours,
        raison: reason
      });
      
    //   const result = await Rattrapage.addRattrapage({ id_utilisateur, date: formattedDate, hours, reason });
      res.status(201).json({ message: 'Rattrapage ajouté avec succès', id: result.insertId });
    } catch (error) {
      console.error('Erreur détaillée:', error);
      res.status(500).json({ message: 'Erreur serveur lors de l\'ajout du rattrapage', error: error.message });
    }
  };

exports.updateRattrapage = async (req, res) => {
  try {
    const { id } = req.params;
    const rattrapage = req.body;
    await Rattrapages.updateRattrapage(rattrapage, id);
    console.log("Rattrapage modifié avec succès");
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

exports.deleteRattrapage = async (req, res) => {
  try {
    const { id } = req.params;
    await Rattrapages.deleteRattrapage(id);
    console.log("Rattrapage supprimé avec succès");
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

exports.getAllRattrapages = async (req, res) => {
  try {
    const rattrapages = await Rattrapages.getAllRattrapages();
    res.json(rattrapages);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

exports.getRattrapageByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log("Received id:", userId);
    const rattrapage = await Rattrapages.getRattrapagesByUserId(userId);
    res.json(rattrapage[0]);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};
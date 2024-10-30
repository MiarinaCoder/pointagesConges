const Rattrapages = require("../models/rattrapages");
const moment = require("moment");

// function formatDate(dateString) {
//   return moment(dateString, "YYYY-MM-DD").format("YYYY-MM-DD");
// }

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
  

// exports.addRattrapage = async (req, res) => {
//   try {
//     console.log("Received data:", req.body);
//     const { date, hours, reason } = req.body;
//     const id_utilisateur = req.user.id;
//     const formattedDate = formatDate(date);

//     if (!moment(formattedDate, "YYYY-MM-DD", true).isValid()) {
//       console.log("Invalid date:", date);
//       return res.status(400).json({ message: "Format de date invalide" });
//     }

//     const result = await Rattrapages.addRattrapage({
//       id_utilisateur,
//       date: formattedDate,
//       hours,
//       reason,
//     });
//     res
//       .status(201)
//       .json({ message: "Rattrapage ajouté avec succès", id: result.insertId });
//   } catch (error) {
//     console.error("Erreur détaillée:", error);
//     res
//       .status(500)
//       .json({
//         message: "Erreur serveur lors de l'ajout du rattrapage",
//         error: error.message,
//       });
//   }
// };

// exports.addRattrapage = async (req, res) => {
//   try {
//     const { date, hours, reason } = req.body;
//     const id_utilisateur = req.user.id;
//     const formattedDate = formatDate(date);

//     if (!moment(formattedDate, 'YYYY-MM-DD', true).isValid()) {
//       return res.status(400).json({ message: 'Format de date invalide' });
//     }

//     const result = await Rattrapages.addRattrapage({ id_utilisateur, date: formattedDate, hours, reason });
//     res.status(201).json({ message: 'Rattrapage ajouté avec succès', id: result.insertId });
//   } catch (error) {
//     console.error('Erreur lors de l\'ajout du rattrapage:', error);
//     res.status(500).json({ message: 'Erreur serveur lors de l\'ajout du rattrapage' });
//   }
// };

// exports.addRattrapage = async (req, res) => {
//     try {
//         const rattrapage = req.body;
//         await Rattrapages.addRattrapage(rattrapage);
//         console.log('Rattrapage ajouté avec succès');
//         res.sendStatus(200);
//     } catch (error) {
//         console.error(error);
//         res.sendStatus(500);
//     }
// };

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
    const { id } = req.params;
    const rattrapage = await Rattrapages.getRattrapagesByUserId(id);
    res.json(rattrapage);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};
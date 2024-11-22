const Absence = require('../models/absence');

exports.getAllAbsences = async (req, res) => {
    try {
        const [absence] = await Absence.findAllAbsence();
        res.status(200).json(absence);
      } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
        res.status(500).json({ message: 'Erreur serveur lors de la récupération des utilisateurs' });
      }
};

exports.getAbsencesByUserId = async (req, res) => {
  try {
    const [absences] = await Absence.getAbsencesByUserId(req.params.userId);
    res.status(200).json(absences);
  } catch (error) {
    console.error('Erreur lors de la récupération des absences:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.getAllConges = async (req, res) => {
    try {
        const [absence] = await Absence.findAllConge();
        res.status(200).json(absence);
      } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
        res.status(500).json({ message: 'Erreur serveur lors de la récupération des utilisateurs' });
      }
};

exports.getCongesByUserId = async (req, res) => {
  try {
    const [conges] = await Absence.getCongesByUserId(req.params.userId);
    res.status(200).json(conges);
  } catch (error) {
    console.error('Erreur lors de la récupération des congés:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.getAbsenceById = async (req, res) => {
    try {
        const [absence] = await Absence.findById(req.params.id);
        res.status(200).json(absence);
      } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
        res.status(500).json({ message: 'Erreur serveur lors de la récupération des utilisateurs' });
      }
};

exports.createAbsence = async (req, res) => {
  try {
    const result = await Absence.create(req.body);
    res.status(201).json({ message: "Absence créée avec succès", id: result.insertId });
  } catch (error) {
    if (error.message.includes('ne peut pas dépasser') || error.message.includes('ne pouvez pas prendre plus de')) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Erreur lors de la création de l'absence" });
    }
  }
};

exports.updateAbsence = async (req, res) => {
  try {
    const result = await Absence.update(req.body, req.params.id);
    if (result.affectedRows > 0) {
      res.json({ message: 'Absence updated successfully' });
    } else {
      res.status(404).json({ message: 'Absence not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteAbsence = async (req, res) => {
  try {
    const deleted = await Absence.delete(req.params.id);
    if (deleted) {
      res.json({ message: 'Absence supprimée avec succès' });
    } else {
      res.status(404).json({ message: 'Absence non trouvée' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'absence', error });
  }
};

exports.updateStatus= async (req, res) => {
  try {
    const result = await Absence.updateStatus(req.body.statut,req.params.id);
    if (result.affectedRows > 0) {
      res.json({ message: 'Absence updated successfully' });
    } else {
      res.status(404).json({ message: 'Absence not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
  };
  
exports.getAbsencesByPeriod = async (req, res) => {
  try {
    const { period, offset } = req.body;
    const [absences] = await Absence.getAbsencesByPeriod(period, parseInt(offset));
    res.status(200).json(absences);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des absences", error });
  }
};

exports.getAbsencesByPeriodWhereUser = async (req, res) => {
  try {
    const {userId} = req.params;
    const { period, offset} = req.body;
    const [absences] = await Absence.getAbsencesByPeriodWhereUser(userId, period, parseInt(offset));
    res.status(200).json(absences);
  } catch (error) {
    console.error("Erreur détaillée:", error);
    res.status(500).json({ message: "Erreur lors de la récupération des absences", error });
  }
};

exports.getGlobalTodayStats = async (req, res) => {
  try {
    const [stats] = await Absence.getGlobalAttendanceStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getGlobalTodayStatsEmploye = async (req, res) => {
  try {
    const {userId} = req.params;
    const [stats] = await Absence.getUserAttendanceStats(userId);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// exports.suggestDates = async (req, res) => {
//   try {
//     const { idAbsence } = req.params;
//     const { dateDebutAbsence, dateFinAbsence, nombre_jour_conge } = req.body;

//     const absence = await Absence.getSuggestionStatus(idAbsence);
    
//     if (!absence) {
//       return res.status(404).send({ message: "Absence not found" });
//     }

//     await absence.suggestDates({
//       suggested_dates: {
//         dateDebutAbsence,
//         dateFinAbsence,
//         nombre_jour_conge
//       },
//       status_suggestion: 'attente',
//       statut: 'suggestion_attente'
//     });

//     res.send({ 
//       message: "Suggestion sent successfully",
//       data: absence 
//     });

//   } catch (error) {
//     res.status(500).send({
//       message: error.message || "Error occurred while suggesting dates"
//     });
//   }
// };

// exports.respondToSuggestion = async (req, res) => {
//   try {
//     const { idAbsence } = req.params;
//     const { accepted } = req.body;

//     const absence = await Absence.getSuggestionStatus(idAbsence);
    
//     if (!absence) {
//       return res.status(404).send({ message: "Absence not found" });
//     }

//     if (accepted) {
//       await absence.respondToSuggestion({
//         dateDebutAbsence: absence.suggested_dates.dateDebutAbsence,
//         dateFinAbsence: absence.suggested_dates.dateFinAbsence,
//         nombre_jour_conge: absence.suggested_dates.nombre_jour_conge,
//         suggested_dates: null,
//         suggestion_status: 'oui',
//         statut: 'accepte'
//       });
//     } else {
//       await absence.respondToSuggestion({
//         suggested_dates: null,
//         suggestion_status: 'non',
//         statut: 'refuse'
//       });
//     }

//     res.send({
//       message: `Suggestion ${accepted ? 'accepted' : 'rejected'} successfully`,
//       data: absence
//     });

//   } catch (error) {
//     res.status(500).send({
//       message: error.message || "Error occurred while responding to suggestion"
//     });
//   }
// };


exports.suggestDates = async (req, res) => {
  const { idAbsence } = req.params;
  const suggestionData = {
    dateDebutAbsence: req.body.dateDebutAbsence,
    dateFinAbsence: req.body.dateFinAbsence,
    nombre_jour_conge: req.body.nombre_jour_conge
  };

  try {
    const result = await Absence.suggestDates(idAbsence, suggestionData);
    res.status(200).json({
      success: true,
      message: "Suggestion de dates envoyée avec succès",
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suggestion de dates",
      error: error.message
    });
  }
};

exports.respondToSuggestion = async (req, res) => {
  const { idAbsence } = req.params;
  const { accepted } = req.body;
  console.log(req.body);

  try {
    const result = await Absence.respondToSuggestion(idAbsence, accepted);
    res.status(200).json({
      success: true,
      message: accepted ? "Suggestion acceptée" : "Suggestion refusée",
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la réponse à la suggestion",
      error: error
    });
  }
};

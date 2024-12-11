const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const SessionsTravail = require("../models/sessionTravail");
const { validationResult } = require("express-validator");
const { format } = require("date-fns"); // Pour formater les dates


// Amélioration du nombre de "salt rounds" pour le hashage des mots de passe
const SALT_ROUNDS = 12;

exports.login = async (req, res) => {  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  
  try {
    const [rows] = await User.findByEmail(email);
    if (rows.length === 0) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }

    const utilisateur = rows[0];
    const isPasswordValid = await bcrypt.compare(password, utilisateur.motDePasse);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }

    const currentTimestamp = new Date();
    try {
      const [result] = await SessionsTravail.create({
        id_utilisateur: utilisateur.id,
        heureDebut: currentTimestamp,
      });

      const sessionId = result[0]?.idSession || result[0]?.[0]?.idSession || result.insertId;

      const token = jwt.sign(
        {
          nom: utilisateur.nom,
          prenom: utilisateur.prenom,
          userId: utilisateur.id,
          email: utilisateur.email,
          role: utilisateur.role,
          genre: utilisateur.genre,
          fonction: utilisateur.fonction,
          sessionId: sessionId,
          sessionStart: format(currentTimestamp, "yyyy-MM-dd'T'HH:mm:ssXXX"),
        },
        process.env.JWT_SECRET,
        { expiresIn: "11h", algorithm: "HS256" }
      );

      res.json({
        token,
        sessionStart: format(currentTimestamp, "yyyy-MM-dd'T'HH:mm:ssXXX"),
        nom: utilisateur.nom,
        prenom: utilisateur.prenom,
        userId: utilisateur.id,
        sessionId: sessionId,
        role: utilisateur.role,
        genre: utilisateur.genre,
        fonction: utilisateur.fonction,
        message: "Connexion réussie",
      });
    } catch (error) {
      if (error.code === 'ACTIVE_SESSION') {
        return res.status(400).json({ 
          code: 'ACTIVE_SESSION',
          message: 'Une session active existe déjà pour cet utilisateur'
        });
      }
      
      if (error.code === 'HOURS_RESTRICTION') {
        return res.status(400).json({
          code: 'HOURS_RESTRICTION', 
          message: 'Les sessions ne peuvent être créées qu\'entre 8h et 16h'
        });
      }

      res.status(500).json({ message: error.message || "Erreur serveur" });
    }
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};


// const sendEmail = require("../utils/sendEmail");
// const { haversineDistance } = require('../utils/geoutils');
// const crypto = require("crypto");
// const LieuxTravail = require("../models/lieuxTravail");
// const { sendEmail } = require("../services/emailService");
exports.requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  try {
    const result = await User.requestPasswordReset(email);
    res.status(200).json(result);
  } catch (error) {
    console.error('Erreur lors de la demande de réinitialisation de mot de passe:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la demande de réinitialisation de mot de passe' });
  }
};

exports.approvePasswordReset = async (req, res) => {
  const { requestId } = req.params;
  try {
    await User.approvePasswordResetRequest(requestId);
    res.status(200).json({ message: 'Demande de réinitialisation approuvée' });
  } catch (error) {
    console.error('Erreur lors de l\'approbation de la demande de réinitialisation de mot de passe:', error);
    res.status(500).json({ message: 'Erreur serveur lors de l\'approbation de la demande de réinitialisation de mot de passe' });
  }
};

exports.resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.updatePassword(email, hashedPassword);
    // res.status(200).json({ message: 'Mot de passe changé avec succès' });
    sendEmail(email, "Confirmation de changement de mot de passe", "Votre mot de passe a été changé avec succès.");
  } catch (error) {
    console.error('Erreur lors de la réinitialisation du mot de passe:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la réinitialisation du mot de passe' });
  }
};

exports.getAllPasswordResetRequests = async (req, res) => {
  try {
    const requests = await User.getAllPasswordResetRequests();
    res.status(200).json(requests);
  } catch (error) {
    console.error('Erreur lors de la récupération des demandes de réinitialisation de mot de passe:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des demandes de réinitialisation de mot de passe' });
  }
};
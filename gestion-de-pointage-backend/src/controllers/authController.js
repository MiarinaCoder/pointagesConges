const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const SessionsTravail = require("../models/sessionTravail");
const LieuxTravail = require("../models/lieuxTravail");
const { validationResult } = require("express-validator");
const { format } = require("date-fns"); // Pour formater les dates
const crypto = require("crypto");
// const sendEmail = require("../utils/sendEmail");
const { sendEmail } = require("../services/emailService");
const { haversineDistance } = require('../utils/geoutils');


// Amélioration du nombre de "salt rounds" pour le hashage des mots de passe
const SALT_ROUNDS = 12;

exports.login = async (req, res) => {  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, latitude, longitude } = req.body;

  // Valider coordinates
  if (!latitude || !longitude) {
    console.log('Missing coordinates:', { latitude, longitude });
    return res.status(400).json({
      success: false,
      message: 'Les coordonnées GPS sont requises'
    });
  }

  const userLat = parseFloat(latitude);
  const userLon = parseFloat(longitude);

  if (isNaN(userLat) || isNaN(userLon)) {
    console.log('Invalid coordinate format:', { latitude, longitude });
    return res.status(400).json({
      success: false,
      message: 'Format des coordonnées GPS invalide'
    });
  }
  
  try {
    const [rows] = await User.findByEmail(email);
    if (rows.length === 0) {
      return res
        .status(401)
        .json({ message: "Email ou mot de passe incorrect" });
    }

    const utilisateur = rows[0];

    // Vérifier si le mot de passe est valide
    const isPasswordValid = await bcrypt.compare(
      password,
      utilisateur.motDePasse
    );

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Email ou mot de passe incorrect" });
    }

    // Vérification de la localisation
    const [lieux] = await LieuxTravail.getAllLieux();
    const lieuValide = lieux.some((lieu) => {
      const lieuLat = parseFloat(lieu.latitude);
      const lieuLon = parseFloat(lieu.longitude);

      // Add validation before calculation
      if (!lieuLat || !lieuLon) {
        console.log('Invalid coordinates detected:', {
          user: { lat: userLat, lon: userLon },
          lieu: { lat: lieuLat, lon: lieuLon }
        });
        return false;
      }

    const distance = haversineDistance(userLat, userLon, lieuLat, lieuLon);
    console.log(`Distance: ${distance}m, Lieu: ${lieu.nom}, Coordonnées utilisateur: [${latitude}, ${longitude}], Coordonnées lieu: [${lieu.latitude}, ${lieu.longitude}]`);

      if (distance > lieu.rayon) {
        console.log(`Position non autorisée - Distance: ${(distance/1000).toFixed(2)}km, Lieu: ${lieu.nom}, Coordonnées utilisateur: [${latitude}, ${longitude}], Coordonnées lieu: [${lieu.latitude}, ${lieu.longitude}]`);
        return false;
      }
      return true;
    });

    if (!lieuValide) {
      return res.status(403).json({ message: "Vous n'êtes pas dans un lieu de travail autorisé.",
      success: false,
    });
    }


    // Démarrer une nouvelle session de travail immédiatement après la connexion
    const currentTimestamp = new Date();
    try {
      const [result] = await SessionsTravail.create({
        id_utilisateur: utilisateur.id,
        heureDebut: currentTimestamp,
      });

      // Try these different approaches:
      const sessionId = result[0]?.idSession || result[0]?.[0]?.idSession || result.insertId;

      // Générer un token JWT sécurisé avec le sessionId inclus dans le payload
      const token = jwt.sign(
        {
          nom: utilisateur.nom,
          prenom: utilisateur.prenom,
          userId: utilisateur.id,
          email: utilisateur.email,
          role: utilisateur.role,
          genre: utilisateur.genre,
          fonction: utilisateur.fonction,
          sessionId: sessionId, // On inclut le sessionId dans le token
          sessionStart: format(currentTimestamp, "yyyy-MM-dd'T'HH:mm:ssXXX"),
        },
        process.env.JWT_SECRET, // Utiliser un secret JWT sécurisé via un fichier .env
        { expiresIn: "11h", algorithm: "HS256" } // Configuration d'une expiration de 11 heures et algorithme sécurisé
      );

      // Répondre avec le token, le démarrage de la session et d'autres infos utiles
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
      console.error("Erreur lors de la connexion:", error);
      
      // Add proper error handling
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

      // Default error
      res.status(500).json({ 
        message: error.message || "Erreur serveur"
      });
    }
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

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
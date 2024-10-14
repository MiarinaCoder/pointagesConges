// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const db = require("../config/db");
// const { validationResult } = require("express-validator");
// const { format } = require("date-fns"); // Pour formater les dates si nécessaire

// exports.login = async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }

//   const { email, password } = req.body;

//   try {
//     // Requête pour récupérer les informations de l'employé
//     const [rows] = await db.execute(
//       "SELECT * FROM utilisateur WHERE email = ?",
//       [email]
//     );
//     if (rows.length === 0) {
//       return res
//         .status(401)
//         .json({ message: "Email ou mot de passe incorrect" });
//     }

//     const utilisateur = rows[0];

//     // Vérifier si le mot de passe est valide
//     const isPasswordValid = await bcrypt.compare(
//       password,
//       utilisateur.motDePasse
//     );

//     if (!isPasswordValid) {
//       return res
//         .status(401)
//         .json({ message: "Email ou mot de passe incorrect" });
//     }

//     // Démarrer une nouvelle session de travail
//     const currentTimestamp = new Date();
//     const [result] = await db.execute(
//       "INSERT INTO sessiontravail (id_utilisateur4, heureDebut) VALUES (?, ?)",
//       [utilisateur.id, currentTimestamp]
//     );
//     const sessionId = result.insertId;

//     // Générer le token JWT avec sessionId inclus
//     const token = jwt.sign(
//       {
//         userId: utilisateur.id,
//         email: utilisateur.email,
//         role: utilisateur.role,
//         sessionId: sessionId, // Include sessionId in the token payload
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: "8h" }
//     );

//     // Répondre avec le token et l'heure de début de session
//     res.json({
//       token,
//       sessionStart: format(currentTimestamp, "yyyy-MM-dd'T'HH:mm:ssXXX"),
//       userId: utilisateur.id,
//       sessionId: sessionId,
//       role: utilisateur.role,
//       message: "Connexion réussie",
//     });
//   } catch (error) {
//     console.error("Erreur lors de la connexion:", error);
//     res.status(500).json({ message: "Erreur serveur" });
//   }
// };


const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User=require('../models/User');
const SessionsTravail=require('../models/sessionTravail')
const { validationResult } = require("express-validator");
const { format } = require("date-fns"); // Pour formater les dates

// Amélioration du nombre de "salt rounds" pour le hashage des mots de passe
const SALT_ROUNDS = 12;

exports.login = async (req, res) => {
  // Validation des erreurs d'email et mot de passe
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

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

    // Démarrer une nouvelle session de travail immédiatement après la connexion
    const currentTimestamp = new Date();
    const [result] = await SessionsTravail.create({
              id_utilisateur: utilisateur.id,
              heureDebut: currentTimestamp
            });
    const sessionId = result.insertId;

    // Générer un token JWT sécurisé avec le sessionId inclus dans le payload
    const token = jwt.sign(
      {
        prenom: utilisateur.prenom,
        userId: utilisateur.id,
        email: utilisateur.email,
        role: utilisateur.role,
        sessionId: sessionId, // On inclut le sessionId dans le token
      },
      process.env.JWT_SECRET, // Utiliser un secret JWT sécurisé via un fichier .env
      { expiresIn: "8h", algorithm: "HS256" } // Configuration d'une expiration de 8 heures et algorithme sécurisé
    );

    // Répondre avec le token, le démarrage de la session et d'autres infos utiles
    res.json({
      token,
      sessionStart: format(currentTimestamp, "yyyy-MM-dd'T'HH:mm:ssXXX"),
      prenom: utilisateur.prenom,
      userId: utilisateur.id,
      sessionId: sessionId,
      role: utilisateur.role,
      message: "Connexion réussie",
    });
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
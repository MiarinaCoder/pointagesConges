const db = require('../config/db');
const { sendEmail } = require("../services/emailService");

const User = {
  getUserById: (id) => {
    return db.query(
      "SELECT id,matriculation,nom,prenom,adresse,email,fonction,role,statusMatrimoniale,genre FROM utilisateur WHERE id = ?",
      [id]
    );
  },
  findByEmail: (email) => {
    console.log(`Finding user with email: ${email}`);
    return db.query("SELECT * FROM utilisateur WHERE email = ?", [email]);
  },
  createUser: (user) => {
    return db.query(
      "INSERT INTO utilisateur (nom,email,motDePasse,role,matriculation,fonction,statusMatrimoniale,adresse,prenom,genre) VALUES (?,?,?,?,?,?,?,?,?,?)",
      [user.nom, user.email, user.motDePasse, user.role, user.matriculation, user.fonction, user.statusMatrimoniale, user.adresse, user.prenom,user.genre]
    );
  },
  updateUser: (user, id) => {
    return db.query(
      "UPDATE utilisateur SET email=?, statusMatrimoniale=?,adresse=? WHERE id=?",
      [user.email, user.statusMatrimoniale, user.adresse, id]
    );
  },
  deleteUser: (id) => {
    return db.query("DELETE FROM utilisateur WHERE id=?", [
      id
    ]);
  },
  getAllUsers: () => {
    return db.query(
      "SELECT id,matriculation,nom,prenom,adresse,email,fonction,role,statusMatrimoniale,genre FROM utilisateur"
    );
  },
  // updatePassword: (email, newPassword) => {
  //   return db.query('UPDATE Utilisateur SET motDePasse = ? WHERE email = ?', [newPassword, email]);
  // },
  updatePassword: async (email, newPassword) => {
    const result = await User.isPasswordResetRequestApproved(email);
    if (result.length > 0 && result[0].is_approved) {
      await db.query('UPDATE Utilisateur SET motDePasse = ? WHERE email = ?', [newPassword, email]);
      const adminEmails = await User.getAdminEmails();
      const subject = "Mot de passe réinitialisé";
      const message = `Le mot de passe pour l'utilisateur avec l'email ${email} a été réinitialisé.`;
      adminEmails.forEach(adminEmail => sendEmail(adminEmail.email, subject, message));
    }
  },
  isPasswordResetRequestApproved: (email) => {
    return db.query('SELECT is_approved FROM password_reset_requests WHERE user_email = ? ORDER BY created_at DESC LIMIT 1', [email]);
  },
  getAdminEmails: () => {
    return db.query("SELECT email FROM utilisateur WHERE role = 'administrateur' AND id=16");
  },
  createPasswordResetRequest: (email) => {
    return db.query('INSERT INTO password_reset_requests (user_email) VALUES (?)', [email]);
  },
  approvePasswordResetRequest: async (requestId) => {
    const result = await db.query('SELECT is_approved FROM password_reset_requests WHERE id = ?', [requestId]);
    if (result.length > 0 && result[0].is_approved) {
      throw new Error('Cette demande de réinitialisation a déjà été approuvée.');
    }
    return db.query('UPDATE password_reset_requests SET is_approved = TRUE WHERE id = ?', [requestId]);
  },
  requestPasswordReset: async (email) => {
    try {
      await User.createPasswordResetRequest(email);
      let adminEmails = await User.getAdminEmails();
      console.log(adminEmails);

          // Flatten the array if necessary
    if (Array.isArray(adminEmails[0])) {
      adminEmails = adminEmails.flat();
    }

    const resetUrl = `http://localhost:3000/admin`;

    // Filter out invalid email objects
    adminEmails = adminEmails.filter(admin => admin && admin.email);
      const subject = "Demande de réinitialisation de mot de passe";
      const message = `L'utilisateur avec l'email ${email} a demandé une réinitialisation de mot de passe.
      Cliquez sur le lien suivant pour réinitialiser votre mot de passe : ${resetUrl}`;

      adminEmails.forEach(admin => {
        sendEmail(admin.email, subject, message);
      });

      return { message: "Demande de réinitialisation envoyée aux administrateurs." };
    } catch (error) {
      console.error(error);
      return { message: "Erreur lors de l'envoi de la demande de réinitialisation." };
    }
  },
  getAllPasswordResetRequests: async () => {
    return db.query('SELECT * FROM password_reset_requests');
  }
};

module.exports = User;
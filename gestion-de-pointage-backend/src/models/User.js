const db = require('../config/db');

const User = {
  // updateResetToken: (email, resetToken, resetExpires) => {
  //   return db.query('UPDATE Utilisateur SET resetPasswordToken = ?, resetPasswordExpires = ? WHERE email = ?', [resetToken, resetExpires, email]);
  // },
  findByEmail: (email) => {
    console.log(`Finding user with email: ${email}`);
    return db.query("SELECT * FROM utilisateur WHERE email = ?", [email]);
  },
  createUser: (user) => {
    return db.query(
      "INSERT INTO utilisateur (nom,email,motDePasse,role,matriculation,fonction,statusMatrimoniale,adresse,prenom) VALUES (?,?,?,?,?,?,?,?,?)",
      [user.nom, user.email, user.motDePasse, user.role, user.matriculation, user.fonction, user.statusMatrimoniale, user.adresse, user.prenom]
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
      "SELECT id,matriculation,nom,prenom,adresse,email,fonction,role,statusMatrimoniale FROM utilisateur"
    );
  },
  updatePassword: (email, newPassword) => {
    return db.query('UPDATE Utilisateur SET motDePasse = ? WHERE email = ?', [newPassword, email]);
  },
};

module.exports = User;
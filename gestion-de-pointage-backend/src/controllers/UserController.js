const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.getAllUsers = async (req, res) => {
  try {
    const [users] = await User.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des utilisateurs' });
  }
};

exports.createUser = async (req, res) => {
  const { nom, prenom, email, motDePasse, role, matriculation, fonction, statusMatrimoniale, adresse } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(motDePasse, 12);
    const [result] = await User.createUser({ nom, email, motDePasse: hashedPassword, role, matriculation, fonction, statusMatrimoniale, adresse, prenom });
    res.status(201).json({ message: 'Utilisateur créé avec succès', id: result.insertId });
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la création de l\'utilisateur' });
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { statusMatrimoniale, email, adresse } = req.body;

  try {
    await User.updateUser({ email, statusMatrimoniale, adresse },id);
    res.status(200).json({ message: 'Utilisateur mis à jour avec succès' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la mise à jour de l\'utilisateur' });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  console.log(id);

  try {
    await User.deleteUser(id);
    res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la suppression de l\'utilisateur' });
  }
};
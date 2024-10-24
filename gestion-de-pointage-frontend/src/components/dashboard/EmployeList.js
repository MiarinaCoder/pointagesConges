import React, { useState, useEffect } from 'react';
import UtilisateurForm from '../forms/EmployeeForm';
import Modal from '../common/Modal';
import ModalConfirmation from '../common/ModalConfirmation';
import styles from '../../styles/components/EmployeList.module.css';
import api from "@/services/api";

export default function EmployeeList() {
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedUtilisateur, setSelectedUtilisateur] = useState(null);
  const [utilisateurToDelete, setUtilisateurToDelete] = useState(null);

  useEffect(() => {
    fetchUtilisateurs();
  }, []);

  const fetchUtilisateurs = async () => {
    try {
      const response = await api.get('/users', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUtilisateurs(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
    }
  };

  const handleCreate = async (newUtilisateur) => {
    try {
      await api.post('/users', newUtilisateur, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchUtilisateurs();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur:', error);
    }
  };

  const handleUpdate = async (updatedUtilisateur) => {
    try {
      await api.put(`/users/${updatedUtilisateur.id}`, updatedUtilisateur, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchUtilisateurs();
      setIsModalOpen(false);
      setSelectedUtilisateur(null);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
    }
  };

  const openDeleteConfirmation = (utilisateur) => {
    setUtilisateurToDelete(utilisateur);
    setIsConfirmModalOpen(true);
  };

  const handleDelete = async () => {
    if (utilisateurToDelete) {
      try {
        await api.delete(`/users/${utilisateurToDelete.id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        fetchUtilisateurs();
        setIsConfirmModalOpen(false);
        setUtilisateurToDelete(null);
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'utilisateur:', error);
      }
    }
  };

  const openModal = (utilisateur = null) => {
    setSelectedUtilisateur(utilisateur);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUtilisateur(null);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Liste des utilisateurs</h2>
      <button className={styles.addButton} onClick={() => openModal()}>
        Ajouter un utilisateur
      </button>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <UtilisateurForm 
          utilisateur={selectedUtilisateur} 
          onSubmit={selectedUtilisateur ? handleUpdate : handleCreate} 
          onClose={closeModal}
        />
      </Modal>
      <ModalConfirmation 
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        title="Confirmer la suppression"
        onConfirm={handleDelete}
        confirmText="Supprimer"
      >
        <p>Êtes-vous sûr de vouloir supprimer cet utilisateur ?</p>
      </ModalConfirmation>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Matriculation</th>
            <th>Nom</th>
            <th>Prenom</th>
            <th>Email</th>
            <th>Fonction</th>
            <th>Adresse</th>
            <th>Genre</th>
            <th>Status matrimoniale</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {utilisateurs.map(utilisateur => (
            <tr key={utilisateur.id}>
              <td>{utilisateur.matriculation}</td>
              <td>{utilisateur.nom}</td>
              <td>{utilisateur.prenom}</td>
              <td>{utilisateur.email}</td>
              <td>{utilisateur.fonction}</td>
              <td>{utilisateur.adresse}</td>
              <td>{utilisateur.genre}</td>
              <td>{utilisateur.statusMatrimoniale}</td>
              <td>
                <button onClick={() => openModal(utilisateur)} className={styles.actionButton}>
                  Modifier
                </button>
                <button onClick={() => openDeleteConfirmation(utilisateur)} className={styles.actionButton}>
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import PenaliteForm from '../forms/PenaliteForm';
import Modal from '../common/Modal';
import ModalConfirmation from '../common/ModalConfirmation';
import styles from '../../styles/components/PenaliteList.module.css';
import api from "@/services/api";

export default function PenaliteList({ userId }) {
  const [penalites, setPenalites] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedPenalite, setSelectedPenalite] = useState(null);
  const [penaliteToDelete, setPenaliteToDelete] = useState(null);

  useEffect(() => {
    fetchPenalites();
  }, [userId]);

  const fetchPenalites = async () => {
    try {
      const endpoint = userId 
        ? `/penalites/user/${userId}`
        : '/penalites';
        
      const response = await api.get(endpoint, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setPenalites(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des pénalités:', error);
    }
  };

  const handleCreate = async (newPenalite) => {
    if (userId) return; // Only admin can create
    try {
      await api.post('/penalites', newPenalite, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchPenalites();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Erreur lors de la création de la pénalité:', error);
    }
  };

  const handleUpdate = async (updatedPenalite) => {
    if (userId) return; // Only admin can update
    try {
      await api.put(`/penalites/${updatedPenalite.idPenalite}`, updatedPenalite, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchPenalites();
      setIsModalOpen(false);
      setSelectedPenalite(null);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la pénalité:', error);
    }
  };

  const openDeleteConfirmation = (penalite) => {
    if (userId) return; // Only admin can delete
    setPenaliteToDelete(penalite);
    setIsConfirmModalOpen(true);
  };

  const handleDelete = async () => {
    if (penaliteToDelete && !userId) {
      try {
        await api.delete(`/penalites/${penaliteToDelete.idPenalite}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        fetchPenalites();
        setIsConfirmModalOpen(false);
        setPenaliteToDelete(null);
      } catch (error) {
        console.error('Erreur lors de la suppression de la pénalité:', error);
      }
    }
  };

  const openModal = (penalite = null) => {
    if (userId) return; // Only admin can open modal
    setSelectedPenalite(penalite);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPenalite(null);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        {userId ? 'Mes pénalités' : 'Liste des pénalités'}
      </h2>
      {!userId && (
        <button className={styles.addButton} onClick={() => openModal()}>
          Ajouter une pénalité
        </button>
      )}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <PenaliteForm 
          penalite={selectedPenalite} 
          onSubmit={selectedPenalite ? handleUpdate : handleCreate} 
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
        <p>Êtes-vous sûr de vouloir supprimer cette pénalité ?</p>
      </ModalConfirmation>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Employé</th>
            <th>Montant</th>
            <th>Date</th>
            <th>Approuvé</th>
            {!userId && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {penalites.map(penalite => (
            <tr key={penalite.idPenalite}>
              <td>{`${penalite.nom} ${penalite.prenom}`}</td>
              <td>{penalite.montant}</td>
              <td>{new Date(penalite.date).toLocaleDateString()}</td>
              <td>{penalite.estApprouve ? 'Oui' : 'Non'}</td>
              {!userId && (
                <td>
                  <button onClick={() => openModal(penalite)} className={styles.actionButton}>
                    Modifier
                  </button>
                  <button onClick={() => openDeleteConfirmation(penalite)} className={styles.actionButton}>
                    Supprimer
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
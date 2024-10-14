import React, { useState, useEffect, useCallback } from 'react';
import AbsenceForm from '../forms/AbsenceForm';
import Modal from '../common/Modal';
import ModalConfirmation from '../common/ModalConfirmation';
import styles from '../../styles/components/AbsenceList.module.css';
import api from "@/services/api";

export default function AbsenceList() {
  const [absences, setAbsences] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedAbsence, setSelectedAbsence] = useState(null);
  const [absenceToDelete, setAbsenceToDelete] = useState(null);

  const fetchAbsences = useCallback(async () => {
    try {
      const response = await api.get('/absence', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setAbsences(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des absences:', error);
    }
  }, []);

  useEffect(() => {
    fetchAbsences();
  }, [fetchAbsences]);

  const handleCreate = async (newAbsence) => {
    try {
      await api.post('/absence', newAbsence, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchAbsences();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Erreur lors de la création de l\'absence:', error);
    }
  };

  const handleUpdate = async (updatedAbsence) => {
    try {
      await api.put(`/absence/${updatedAbsence.idAbsence}`, updatedAbsence, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchAbsences();
      setIsModalOpen(false);
      setSelectedAbsence(null);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'absence:', error);
    }
  };

  const openDeleteConfirmation = (absence) => {
    setAbsenceToDelete(absence);
    setIsConfirmModalOpen(true);
  };

  const handleDelete = async () => {
    if (absenceToDelete) {
      try {
        await api.delete(`/absence/${absenceToDelete.idAbsence}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        fetchAbsences();
        setIsConfirmModalOpen(false);
        setAbsenceToDelete(null);
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'absence:', error);
      }
    }
  };

  const openModal = (absence = null) => {
    setSelectedAbsence(absence);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAbsence(null);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Liste des absences</h2>
      <button className={styles.addButton} onClick={() => openModal()}>
        Ajouter une absence
      </button>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <AbsenceForm 
          absence={selectedAbsence} 
          onSubmit={selectedAbsence ? handleUpdate : handleCreate} 
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
        <p>Êtes-vous sûr de vouloir supprimer cette absence ?</p>
      </ModalConfirmation>
      <table className={styles.table}>
        <thead>
          <tr>
            {/* <th>Utilisateur</th> */}
            <th>Date de début</th>
            <th>Date de fin</th>
            <th>Motif</th>
            <th>Statut</th>
            <th>Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {absences.map(absence => (
            <tr key={absence.idAbsence}>
              {/* <td>{absence.utilisateur.nom} {absence.utilisateur.prenom}</td> */}
              <td>{new Date(absence.dateDebutAbsence).toLocaleDateString()}</td>
              <td>{absence.dateFinAbsence ? new Date(absence.dateFinAbsence).toLocaleDateString() : 'N/A'}</td>
              <td>{absence.motif}</td>
              <td>{absence.statut}</td>
              <td>{absence.type}</td>
              <td>
                <button onClick={() => openModal(absence)} className={styles.actionButton}>
                  Modifier
                </button>
                <button onClick={() => openDeleteConfirmation(absence)} className={styles.actionButton}>
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

import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaFilter } from 'react-icons/fa';
import PenaliteForm from '../forms/PenaliteForm';
import Modal from '../common/Modal';
import ModalConfirmation from '../common/ModalConfirmation';
import styles from '../../styles/components/PenaliteList.module.css';
import api from "@/services/api";
import { toast } from 'react-toastify';
import moment from "moment";
import "moment/locale/fr";



const ITEMS_PER_PAGE = 5;
moment.locale('fr');

export default function PenaliteList({ userId }) {
  const [penalites, setPenalites] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedPenalite, setSelectedPenalite] = useState(null);
  const [penaliteToDelete, setPenaliteToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPenalites();
  }, [userId]);

  const fetchPenalites = async () => {
    try {
      setLoading(true);
      const endpoint = userId 
        ? `/penalites/user/${userId}`
        : '/penalites';
        
      const response = await api.get(endpoint, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setPenalites(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des pénalités:', error);
      toast.error('Erreur lors de la récupération des pénalités');
    } finally {
      setLoading(false);
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
      toast.success('Pénalité créée avec succès');
    } catch (error) {
      console.error('Erreur lors de la création de la pénalité:', error);
      toast.error('Erreur lors de la création de la pénalité');
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
      toast.success('Pénalité mise à jour avec succès');
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la pénalité:', error);
      toast.error('Erreur lors de la mise à jour de la pénalité');
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
        toast.success('Pénalité supprimée avec succès');
      } catch (error) {
        console.error('Erreur lors de la suppression de la pénalité:', error);
        toast.error('Erreur lors de la suppression de la pénalité');
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

  const filteredPenalites = penalites.filter(penalite => {
    const matchesSearch = `${penalite.nom} ${penalite.prenom}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
      (filterStatus === 'approved' && penalite.estApprouve) ||
      (filterStatus === 'pending' && !penalite.estApprouve);
    return matchesSearch && matchesFilter;
  });

  const paginatedPenalites = filteredPenalites.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  return (
    <div className={styles.container}>
      <div className={styles.toolBar}>
        <div className={styles.searchBar}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Rechercher une pénalité..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        
        <div className={styles.filterSection}>
          <FaFilter className={styles.filterIcon} />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">Tous les statuts</option>
            <option value="approved">Approuvées</option>
            <option value="pending">En attente</option>
          </select>
        </div>

        {!userId && (
          <button 
            className={styles.addButton}
            onClick={() => openModal()}
          >
            <FaPlus /> Nouvelle pénalité
          </button>
        )}
      </div>

      {loading ? (
        <div className={styles.loader}>Chargement...</div>
      ) : (
        <>
          <div className={styles.penalitesGrid}>
            {paginatedPenalites.map(penalite => (
              <div key={penalite.idPenalite} className={styles.penaliteCard}>
                <div className={styles.cardHeader}>
                  <h3>{`${penalite.nom} ${penalite.prenom}`}</h3>
                  <span className={`${styles.status} ${penalite.estApprouve ? styles.approved : styles.pending}`}>
                    {penalite.estApprouve ? 'Approuvée' : 'En attente'}
                  </span>
                </div>
                <div className={styles.cardBody}>
                  <p className={styles.amount}>
                    <strong>Montant:</strong> {penalite.montant} Ariary
                  </p>
                  <p className={styles.date}>
                    <strong>Date:</strong> {moment(penalite.date).format("DD MMMM YYYY")}
                    {/* {new Date(penalite.date).toLocaleDateString()} */}
                  </p>
                </div>
                {!userId && (
                  <div className={styles.cardActions}>
                    <button 
                      onClick={() => openModal(penalite)}
                      className={styles.editButton}
                    >
                      <FaEdit /> Modifier
                    </button>
                    <button 
                      onClick={() => openDeleteConfirmation(penalite)}
                      className={styles.deleteButton}
                    >
                      <FaTrash /> Supprimer
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className={styles.pagination}>
            <button
              onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
              disabled={currentPage === 0}
              className={styles.pageButton}
            >
              Précédent
            </button>
            <span className={styles.pageInfo}>
              Page {currentPage + 1} sur {Math.ceil(filteredPenalites.length / ITEMS_PER_PAGE)}
            </span>
            <button
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={(currentPage + 1) * ITEMS_PER_PAGE >= filteredPenalites.length}
              className={styles.pageButton}
            >
              Suivant
            </button>
          </div>
        </>
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
    </div>
  );
}
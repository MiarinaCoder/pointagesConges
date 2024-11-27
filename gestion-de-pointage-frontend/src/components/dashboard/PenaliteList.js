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
      
        {/* 
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
        </div> */}
        
        {/* <div className={styles.filterSection}>
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
        </div>*/}

        {/* {!userId && (
          <button 
            className={styles.addButton}
            onClick={() => openModal()}
          >
            <FaPlus /> Nouvelle pénalité
          </button>
        )} */}
      

      {loading ? (
        <div className={styles.loader}>Chargement...</div>
      ) : (
        <div style={{ backgroundColor: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div className={styles.toolBar} style={{ marginBottom: '24px' }}>
            <div className={styles.searchBar} style={{ 
              position: 'relative',
              backgroundColor: '#f8fafc',
              borderRadius: '8px',
              padding: '12px'
            }}>
              <FaSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input
                type="text"
                placeholder="Rechercher une pénalité..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  // width: '100%',
                  padding: '8px 8px 8px 36px',
                  margin: '0',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
            </div>
          </div>

          <div className={styles.penalitesGrid} style={{ 
            display: 'grid',
            gap: '20px',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))'
          }}>
            {paginatedPenalites.map(penalite => (
              <div key={penalite.idPenalite} style={{
                backgroundColor: '#ffffff',
                borderRadius: '10px',
                border: '1px solid #e2e8f0',
                transition: 'transform 0.2s, box-shadow 0.2s',
                ':hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
                }
              }}>
                <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', marginBottom: '16px' }}>
                    {`${penalite.nom} ${penalite.prenom}`}
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#64748b' }}>Montant</span>
                      <span style={{ color: '#0f172a', fontWeight: '500' }}>{penalite.montant.toLocaleString()} Ar</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#64748b' }}>Date</span>
                      <span style={{ color: '#0f172a' }}>{moment(penalite.date).format("DD MMMM YYYY")}</span>
                    </div>
                  </div>
                </div>
                
                {!userId && (
                  <div style={{ 
                    padding: '12px 20px',
                    display: 'flex',
                    gap: '12px',
                    justifyContent: 'flex-end',
                    backgroundColor: '#f8fafc',
                    borderRadius: '0 0 10px 10px'
                  }}>
                    <button onClick={() => openModal(penalite)} style={{
                      padding: '8px 16px',
                      borderRadius: '6px',
                      backgroundColor: '#f1f5f9',
                      color: '#475569',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      border: 'none',
                      cursor: 'pointer'
                    }}>
                      <FaEdit /> Modifier
                    </button>
                    <button onClick={() => openDeleteConfirmation(penalite)} style={{
                      padding: '8px 16px',
                      borderRadius: '6px',
                      backgroundColor: '#fee2e2',
                      color: '#991b1b',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      border: 'none',
                      cursor: 'pointer'
                    }}>
                      <FaTrash /> Supprimer
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{ 
            marginTop: '24px',
            display: 'flex',
            justifyContent: 'center',
            gap: '16px',
            alignItems: 'center'
          }}>
            <button
              onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
              disabled={currentPage === 0}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
                color: currentPage === 0 ? '#94a3b8' : '#475569',
                cursor: currentPage === 0 ? 'not-allowed' : 'pointer'
              }}
            >
              Précédent
            </button>
            <span style={{ color: '#64748b' }}>
              Page {currentPage + 1} sur {Math.ceil(filteredPenalites.length / ITEMS_PER_PAGE)}
            </span>
            <button
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={(currentPage + 1) * ITEMS_PER_PAGE >= filteredPenalites.length}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
                color: (currentPage + 1) * ITEMS_PER_PAGE >= filteredPenalites.length ? '#94a3b8' : '#475569',
                cursor: (currentPage + 1) * ITEMS_PER_PAGE >= filteredPenalites.length ? 'not-allowed' : 'pointer'
              }}
            >
              Suivant
            </button>
          </div>
        </div>
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
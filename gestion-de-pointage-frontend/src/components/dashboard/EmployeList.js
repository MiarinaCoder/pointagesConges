import React, { useState, useEffect, useContext } from 'react';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaFilter } from 'react-icons/fa';
import UtilisateurForm from '../forms/EmployeeForm';
import Modal from '../common/Modal';
import ModalConfirmation from '../common/ModalConfirmation';
import styles from '../../styles/components/PenaliteList.module.css';
import api from "@/services/api";
import AuthContext from '@/context/authContext';

export default function EmployeeList() {
  const { user } = useContext(AuthContext);
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedUtilisateur, setSelectedUtilisateur] = useState(null);
  const [utilisateurToDelete, setUtilisateurToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  useEffect(() => {
    fetchUtilisateurs();
  }, [user]);

  const fetchUtilisateurs = async () => {
    try {
      const endpoint = user?.role === 'administrateur' 
        ? '/users'
        : `/users/${user.id}`;
        
      const response = await api.get(endpoint, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUtilisateurs(user?.role === 'administrateur' ? response.data : [response.data]);
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
    }
  };

  const handleCreate = async (newUtilisateur) => {
    if (user?.role !== 'administrateur') return;
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
    if (user?.role !== 'administrateur') return;
    setUtilisateurToDelete(utilisateur);
    setIsConfirmModalOpen(true);
  };

  const handleDelete = async () => {
    if (utilisateurToDelete && user?.role === 'administrateur') {
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

  const filteredUtilisateurs = utilisateurs.filter(utilisateur => {
    const matchesSearch = Object.values(utilisateur)
      .join(' ')
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || utilisateur.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div>
      <div className={styles.toolBar}>
        <div className={styles.searchBar}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Rechercher un utilisateur..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className={styles.filterSection}>
          <FaFilter />
          <select 
            className={styles.filterSelect}
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="all">Tous les rôles</option>
            <option value="administrateur">Administrateur</option>
            <option value="employe">Employé</option>
          </select>
        </div>

        {user?.role === 'administrateur' && (
          <button className={styles.addButton} onClick={() => openModal()}>
            <FaPlus /> Ajouter un utilisateur
          </button>
        )}
      </div>

      <div className={styles.penalitesGrid}>
        {filteredUtilisateurs.map(utilisateur => (
          <div key={utilisateur.id} className={styles.penaliteCard}>
            <div className={styles.cardHeader}>
              <h3>{utilisateur.matriculation}</h3>
              <span className={`${styles.status} ${styles[utilisateur.role]}`}>
                {utilisateur.role}
              </span>
            </div>
            
            <div className={styles.cardBody}>
              <p><strong>Nom:</strong> {utilisateur.nom} {utilisateur.prenom}</p>
              <p><strong>Email:</strong> {utilisateur.email}</p>
              <p><strong>Fonction:</strong> {utilisateur.fonction}</p>
              <p><strong>Adresse:</strong> {utilisateur.adresse}</p>
              <p><strong>Genre:</strong> {utilisateur.genre}</p>
              <p><strong>Status:</strong> {utilisateur.statusMatrimoniale}</p>
            </div>

            {user?.role === 'administrateur' && (
              <div className={styles.cardActions}>
                <button 
                  className={styles.editButton}
                  onClick={() => openModal(utilisateur)}
                >
                  <FaEdit /> Modifier
                </button>
                <button 
                  className={styles.deleteButton}
                  onClick={() => openDeleteConfirmation(utilisateur)}
                >
                  <FaTrash /> Supprimer
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <UtilisateurForm 
          utilisateur={selectedUtilisateur} 
          onSubmit={selectedUtilisateur ? handleUpdate : handleCreate} 
          onClose={closeModal}
          isadministrateur={user?.role === 'administrateur'}
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
    </div>
  );
}
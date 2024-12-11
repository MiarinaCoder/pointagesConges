"use client";

import React, { useState, useEffect, useContext } from "react";
import Layout from "@/components/layout/Layout";
import { FaPlus, FaCheck, FaTimes, FaPaperclip, FaFilter, FaSearch, FaEye } from "react-icons/fa";
import styles from "@/app/rattrapages/Rattrapages.module.css";
import api from "@/services/api";
import AuthContext from "@/context/authContext";
import { toast } from 'react-toastify';

const ITEMS_PER_PAGE = 5;

export default function Rattrapages() {
  const [loading, setLoading] = useState(false);
  const [rattrapages, setRattrapages] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedRattrapage, setSelectedRattrapage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const { user } = useContext(AuthContext);
  const [newRattrapage, setNewRattrapage] = useState({
    date: "",
    hours: "",
    reason: "",
    attachment: null,
  });

  const handleNextPage = () => {
    if ((currentPage + 1) * ITEMS_PER_PAGE < filteredRattrapages.length) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('date', newRattrapage.date);
      formData.append('hours', newRattrapage.hours);
      formData.append('reason', newRattrapage.reason);
      if (newRattrapage.attachment) {
        formData.append('attachment', newRattrapage.attachment);
      }

      await api.post("/rattrapages", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      toast.success('Demande de rattrapage envoyée avec succès');
      setShowFormModal(false);
      setNewRattrapage({
        date: "",
        hours: "",
        reason: "",
        attachment: null,
      });
      fetchRattrapages();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const fetchRattrapages = async () => {
    setLoading(true);
    try {
      const endpoint = user?.role === 'administrateur' 
        ? "/rattrapages"
        : `/rattrapages/${user?.id}`;
      const response = await api.get(endpoint, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setRattrapages(response.data);
    } catch (error) {
      toast.error('Erreur lors du chargement des rattrapages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchRattrapages();
    }
  }, [user]);

  const filteredRattrapages = rattrapages.filter(rattrapage => {
    const matchesSearch = rattrapage.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rattrapage.prenom?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || rattrapage.statut === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const FormModal = () => (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.formTitle}>
            <FaPlus /> Nouvelle demande de rattrapage
          </h2>
          <button 
            className={styles.closeModalButton}
            onClick={() => setShowFormModal(false)}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.rattrapageForm}>
          <div className={styles.formGroup}>
            <label htmlFor="date">Date du rattrapage</label>
            <div className={styles.inputWrapper}>
              <input
                id="date"
                type="date"
                value={newRattrapage.date}
                onChange={(e) => setNewRattrapage({ ...newRattrapage, date: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="hours">Nombre d&apos;heures</label>
            <div className={styles.inputWrapper}>
              <input
                id="hours"
                type="number"
                min="1"
                max="8"
                placeholder="Ex: 2"
                value={newRattrapage.hours}
                onChange={(e) => setNewRattrapage({ ...newRattrapage, hours: e.target.value })}
                required
              />
              <small className={styles.helpText}>Entre 1 et 8 heures</small>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="reason">Motif du rattrapage</label>
            <div className={styles.inputWrapper}>
              <textarea
                id="reason"
                placeholder="Décrivez la raison de votre demande..."
                value={newRattrapage.reason}
                onChange={(e) => setNewRattrapage({ ...newRattrapage, reason: e.target.value })}
                required
                rows="3"
                maxLength="200"
              />
              <small className={styles.helpText}>
                {200 - newRattrapage.reason.length} caractères restants
              </small>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="attachment">Pièce justificative</label>
            <div className={styles.fileInputWrapper}>
              <input
                type="file"
                id="attachment"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png"
                className={styles.hiddenFileInput}
              />
              <label htmlFor="attachment" className={styles.customFileInput}>
                <FaPaperclip />
                {newRattrapage.attachment
                  ? newRattrapage.attachment.name
                  : "Sélectionner un fichier"}
              </label>
              <small className={styles.helpText}>
                Formats acceptés: PDF, JPG, PNG (max 5MB)
              </small>
            </div>
          </div>

          <div className={styles.formActions}>
            <button type="button" className={styles.resetButton} onClick={() => setShowFormModal(false)}>
              Annuler
            </button>
            <button type="submit" className={styles.submitButton}>
              <FaPlus /> Soumettre la demande
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const DetailModal = ({ rattrapage, onClose }) => (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Détails du rattrapage</h2>
        <div className={styles.detailsGrid}>
          <div className={styles.detailItem}>
            <label>Utilisateur</label>
            <p>{rattrapage.nom} {rattrapage.prenom}</p>
          </div>
          <div className={styles.detailItem}>
            <label>Date</label>
            <p>{new Date(rattrapage.date_penalite).toLocaleDateString()}</p>
          </div>
          <div className={styles.detailItem}>
            <label>Heures à rattraper</label>
            <p>{rattrapage.heures_a_rattraper}</p>
          </div>
          <div className={styles.detailItem}>
            <label>Type de demande</label>
            <p>{rattrapage.type_demande}</p>
          </div>
          <div className={styles.detailItem}>
            <label>Statut</label>
            <p className={styles[rattrapage.statut]}>{rattrapage.status}</p>
          </div>
          {rattrapage.commentaire && (
            <div className={styles.detailItem}>
              <label>Commentaire</label>
              <p>{rattrapage.commentaire}</p>
            </div>
          )}
        </div>
        <button className={styles.closeButton} onClick={onClose}>Fermer</button>
      </div>
    </div>
  );

  const handleFileChange = (e) => {
    setNewRattrapage({ ...newRattrapage, attachment: e.target.files[0] });
  };

  const handleApprove = async (id) => {
    try {
      await api.put(`/rattrapages/${id}`, { status: "approved" });
      fetchRattrapages();
    } catch (error) {
      console.error("Error approving rattrapage:", error);
    }
  };

  const handleReject = async (id) => {
    try {
      await api.put(`/rattrapages/${id}`, { status: "rejected" });
      fetchRattrapages();
    } catch (error) {
      console.error("Error rejecting rattrapage:", error);
    }
  };

  return (
    <Layout>
      <div className={styles.rattrapagesContainer}>
        <div className={styles.pageHeader}>
          <h1 className={styles.title}>Gestion des Rattrapages</h1>
          <div className={styles.searchAndButtonContainer}>
          <div className={styles.actionBar}>
            <div className={styles.searchBar}>
              <FaSearch className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {/* <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="approved">Approuvé</option>
              <option value="rejected">Rejeté</option>
            </select> */}
          </div>
          {/* {user?.role !== 'administrateur' && (
        <button 
          className={styles.newRequestButton}
          onClick={() => setShowFormModal(true)}
        >
          <FaPlus className={styles.buttonIcon} />
          <span>Nouvelle demande</span>
        </button>
      )} */}
        </div>
        </div>
        {/* {loading && <div className={styles.loader}>Chargement...</div>}
        {user?.role !== 'administrateur' && (
          <div className={styles.newRequestSection}>
            <button 
              className={styles.newRequestButton}
              onClick={() => setShowFormModal(true)}
            >
              <div className={styles.buttonContent}>
                <FaPlus className={styles.buttonIcon} />
                <span className={styles.buttonText}>Nouvelle demande de rattrapage</span>
              </div>
              <small className={styles.buttonHint}>Cliquez pour créer une nouvelle demande</small>
            </button>
          </div>
        )} */}
        <div className={styles.rattrapagesList}>
          {filteredRattrapages
            .slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE)
            .map((rattrapage) => (
              <div key={rattrapage.id_rattrapage} className={styles.rattrapageCard}>
                <div className={styles.cardHeader}>
                  <h3>{rattrapage.nom} {rattrapage.prenom}</h3>
                  <span className={`${styles.statusBadge} ${styles[rattrapage.statut]}`}>
                    {rattrapage.status}
                  </span>
                </div>
                <div className={styles.cardBody}>
                  <p><strong>Date:</strong> {new Date(rattrapage.date_penalite).toLocaleDateString()}</p>
                  <p><strong>Heures:</strong> {rattrapage.heures_a_rattraper}h</p>
                </div>
                <div className={styles.cardFooter}>
                  <button 
                    className={styles.viewDetailsButton}
                    onClick={() => {
                      setSelectedRattrapage(rattrapage);
                      setShowModal(true);
                    }}
                  >
                    <FaEye /> Voir plus
                  </button>
                  {user?.role === 'administrateur' && rattrapage.statut === 'pending' && (
                    <div className={styles.adminActions}>
                      <button onClick={() => handleApprove(rattrapage.id_rattrapage)} className={styles.approveButton}>
                        <FaCheck />
                      </button>
                      <button onClick={() => handleReject(rattrapage.id_rattrapage)} className={styles.rejectButton}>
                        <FaTimes />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>

        {showModal && selectedRattrapage && (
          <DetailModal 
            rattrapage={selectedRattrapage} 
            onClose={() => {
              setShowModal(false);
              setSelectedRattrapage(null);
            }}
          />
        )}

        {showFormModal && <FormModal />}

        <div className={styles.pagination}>
          <button 
            className={styles.pageButton} 
            onClick={handlePrevPage} 
            disabled={currentPage === 0}
          >
            Précédent
          </button>
          <span className={styles.pageInfo}>
            Page {currentPage + 1} sur {Math.ceil(filteredRattrapages.length / ITEMS_PER_PAGE)}
          </span>
          <button 
            className={styles.pageButton} 
            onClick={handleNextPage} 
            disabled={(currentPage + 1) * ITEMS_PER_PAGE >= filteredRattrapages.length}
          >
            Suivant
          </button>
        </div>
      </div>
    </Layout>
  );
}

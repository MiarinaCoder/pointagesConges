"use client";

import React, { useState, useEffect, useContext } from "react";
import Layout from "@/components/layout/Layout";
import { FaPlus, FaCheck, FaTimes, FaPaperclip } from "react-icons/fa";
import styles from "@/app/rattrapages/Rattrapages.module.css";
import api from "@/services/api";
import AuthContext from "@/context/authContext";

const ITEMS_PER_PAGE = 2;

export default function Rattrapages() {
  const [rattrapages, setRattrapages] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [newRattrapage, setNewRattrapage] = useState({
    date: "",
    hours: "",
    reason: "",
    attachment: null,
  });
  const [isManager, setIsManager] = useState(false);
  const { user } = useContext(AuthContext);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  const fetchRattrapages = async () => {
    try {
      const endpoint = user?.role === 'administrateur' 
      ? "/rattrapages"
      : `/rattrapages/${user?.id}`;    
      const response = await api.get(endpoint,{
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setRattrapages(response.data);
    } catch (error) {
      console.error("Error fetching rattrapages:", error);
    }
  };

  useEffect(() => {
    // const fetchUserRole = async () => {
    //   try {
    //     const response = await api.get('/auth/user-role');
    //     setIsManager(response.data.role === 'manager');
    //   } catch (error) {
    //     console.error('Error fetching user role:', error);
    //   }
    // };

    // fetchUserRole();
    fetchRattrapages();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const rattrapageData = {
        date: newRattrapage.date,
        hours: newRattrapage.hours,
        reason: newRattrapage.reason,
      };


      const response = await api.post("/rattrapages", rattrapageData);


      // // Rafraîchir la liste des rattrapages
      // const rattrapagesResponse = await api.get("/rattrapages");
      // setRattrapages(rattrapagesResponse.data);
      fetchRattrapages();

      // Réinitialiser le formulaire
      setNewRattrapage({ date: "", hours: "", reason: "", attachment: null });
    } catch (error) {
      console.error(
        "Erreur lors de la soumission du rattrapage:",
        error.response?.data || error.message
      );
    }
  };

  const handleFileChange = (e) => {
    setNewRattrapage({ ...newRattrapage, attachment: e.target.files[0] });
  };

  const handleApprove = async (id) => {
    try {
      await api.put(`/rattrapages/${id}`, { status: "approved" });
      // Refresh the list of rattrapages
      const response = await api.get("/rattrapages");
      setRattrapages(response.data);
    } catch (error) {
      console.error("Error approving rattrapage:", error);
    }
  };

  const handleReject = async (id) => {
    try {
      await api.put(`/rattrapages/${id}`, { status: "rejected" });
      // Refresh the list of rattrapages
      const response = await api.get("/rattrapages");
      setRattrapages(response.data);
    } catch (error) {
      console.error("Error rejecting rattrapage:", error);
    }
  };
  return (
    <Layout>
      <div className={styles.rattrapagesContainer}>
        <h1 className={styles.title}>Gestion des Rattrapages</h1>

        {!isManager && (
          <form onSubmit={handleSubmit} className={styles.rattrapageForm}>
            <input
              type="date"
              value={newRattrapage.date}
              onChange={(e) =>
                setNewRattrapage({ ...newRattrapage, date: e.target.value })
              }
              required
            />
            <input
              type="number"
              placeholder="Heures"
              value={newRattrapage.hours}
              onChange={(e) =>
                setNewRattrapage({ ...newRattrapage, hours: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Raison"
              value={newRattrapage.reason}
              onChange={(e) =>
                setNewRattrapage({ ...newRattrapage, reason: e.target.value })
              }
              required
            />
            <div className={styles.fileInput}>
              <input
                type="file"
                id="attachment"
                onChange={handleFileChange}
                className={styles.hiddenFileInput}
              />
              <label htmlFor="attachment" className={styles.fileInputLabel}>
                <FaPaperclip />{" "}
                {newRattrapage.attachment
                  ? newRattrapage.attachment.name
                  : "Joindre un fichier"}
              </label>
            </div>
            <button type="submit" className={styles.submitButton}>
              <FaPlus /> Ajouter un rattrapage
            </button>
          </form>
        )}
<div className={styles.rattrapagesContainer}>
    {rattrapages.length > 0 ? (
      <div className={styles.rattrapagesList}>
        {rattrapages
          .slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE)
          .map((rattrapage, index) => {
            // Ensure we have a unique key by using array index as fallback
            const uniqueKey = rattrapage.id_rattrapage || `rattrapage-${index}`
            return (
              <div key={uniqueKey} className={styles.rattrapageItem}>
                <div className={styles.rattrapageInfo}>
                  <p><strong>Utilisateur : {rattrapage.nom} {rattrapage.prenom}</strong></p>
                  <p>Date: {new Date(rattrapage.date_penalite).toLocaleDateString()}</p>
                  <p>Heures à rattraper: {rattrapage.heures_a_rattraper}</p>
                  <p>Type de demande: {rattrapage.type_demande}</p>
                  <p>Statut: <span className={styles[rattrapage.statut]}>{rattrapage.statut}</span></p>
                </div>
                {isManager && rattrapage.statut === 'pending' && (
                  <div className={styles.actionButtons}>
                    <button onClick={() => handleApprove(rattrapage.id_rattrapage)} className={styles.approveButton}>
                      <FaCheck /> Approuver
                    </button>
                    <button onClick={() => handleReject(rattrapage.id_rattrapage)} className={styles.rejectButton}>
                      <FaTimes /> Rejeter
                    </button>
                  </div>
                )}
              </div>
            )
        })}
      </div>

    ) : (      <p>Aucun rattrapage à afficher.</p>
    )}
    <div className={styles.pageNavigation}>
      <button onClick={handlePrevPage} disabled={currentPage === 0}>
        Page précédente
      </button>
      <button onClick={handleNextPage} disabled={(currentPage + 1) * ITEMS_PER_PAGE >= rattrapages.length}>
        Page suivante
      </button>
    </div>
  </div>
  </div>
  </Layout>
  );
}

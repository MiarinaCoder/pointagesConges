import React from 'react';
import styles from './../../styles/components/AbsenceForm.module.css';
import { FaCheck, FaTimes } from 'react-icons/fa';

export default function ViewSuggestionModal({ conge, onAccept, onReject, onClose }) {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className={styles.modalContent}>
      <h2 className={styles.modalTitle}>Suggestion de dates</h2>
      
      <div className={styles.comparisonGrid}>
        <div className={styles.dateColumn}>
          <h3>Dates actuelles</h3>
          <div className={styles.dateInfo}>
            <p>Début: {formatDate(conge.dateDebutAbsence)}</p>
            <p>Fin: {formatDate(conge.dateFinAbsence)}</p>
          </div>
        </div>

        <div className={styles.dateColumn}>
          <h3>Dates suggérées</h3>
          <div className={styles.dateInfo}>
            <p>Début: {formatDate(conge.date_suggere)}</p>
            <p>Fin: {formatDate(conge.dateFinSuggere)}</p>
          </div>
        </div>
      </div>

      <div className={styles.actionButtons}>
        <button 
          onClick={onAccept}
          className={`${styles.button} ${styles.acceptButton}`}
        >
          <FaCheck /> Accepter
        </button>
        <button 
          onClick={onReject}
          className={`${styles.button} ${styles.rejectButton}`}
        >
          <FaTimes /> Refuser
        </button>
      </div>
    </div>
  );
}

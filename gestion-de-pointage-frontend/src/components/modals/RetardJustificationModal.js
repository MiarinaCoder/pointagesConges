import React, { useState } from 'react';
import styles from '../../styles/components/RetardJustificationModal.module.css';

export default function RetardJustificationModal({ isOpen, onClose, onSubmit }) {
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('description', description);
    if (file) {
      formData.append('fichierJustificatif', file);
    }
    onSubmit(formData);
    setDescription('');
    setFile(null);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Justification de retard</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="Veuillez expliquer la raison de votre retard..."
            />
          </div>
          <div className={styles.formGroup}>
            <label>Pièce justificative</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              accept=".pdf,.jpg,.jpeg,.png"
            />
          </div>
          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.submitButton}>
              Envoyer
            </button>
            <button 
              type="button" 
              onClick={onClose}
              className={styles.cancelButton}
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

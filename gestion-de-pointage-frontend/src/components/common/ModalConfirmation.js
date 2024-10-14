import React from 'react';
import styles from '../../styles/components/Modal.module.css';

const Modal = ({ isOpen, onClose, title, children, onConfirm, confirmText }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>{title}</h2>
        <br></br>
        <div className={styles.modalBody}>{children}</div>
        <div className={styles.modalActions}>
          <button onClick={onClose} className={styles.cancelButton}>
            Annuler
          </button>
          <button onClick={onConfirm} className={styles.confirmButton}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;

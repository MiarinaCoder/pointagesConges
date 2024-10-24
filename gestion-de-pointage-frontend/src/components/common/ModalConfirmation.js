import React from 'react';
import styles from '../../styles/components/Modal.module.css';

const Modal = ({ isOpen, onClose, title, children, onConfirm, confirmText, confirmButtonColor }) => {
  if (!isOpen) return null;

  const confirmButtonStyle = {
    backgroundColor: confirmButtonColor || '#0000ff',
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>{title}</h2>
        <div className={styles.modalBody}>{children}</div>
        <div className={styles.modalActions}>
          <button onClick={onClose} className={styles.cancelButton}>
            Annuler
          </button>
          <button onClick={onConfirm} className={styles.confirmButton} style={confirmButtonStyle}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
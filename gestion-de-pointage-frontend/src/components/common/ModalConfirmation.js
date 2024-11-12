import styles from '../../styles/components/Modal.module.css';

export default function Modal({
  isOpen,
  onClose,
  onConfirm,
  title,
  children,
  confirmText = 'Confirmer',
  confirmButtonColor
}) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{title}</h2>
        </div>
        <div className={styles.modalBody}>
          {children}
        </div>
        <div className={styles.modalFooter}>
          <button 
            className={`${styles.button} ${styles.cancelButton}`}
            onClick={onClose}
          >
            Annuler
          </button>
          <button 
            className={`${styles.button} ${styles.confirmButton}`}
            onClick={onConfirm}
            style={confirmButtonColor ? { backgroundColor: confirmButtonColor } : {}}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
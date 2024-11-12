import React from 'react';
import styles from './JustificationList.module.css';
import api from '@/services/api';

export default function JustificationList({ justifications, onDelete }) {
  const handleDownload = async (id, filename) => {
    try {
      // const response = await api.get(`/justifications/${id}`, {
        const response = await api.get(`/justifications`, {
        responseType: 'blob',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/justifications/${id}`);
      onDelete?.(id);
    } catch (error) {
      console.error('Error deleting justification:', error);
    }
  };

  return (
    <div className={styles.list}>
      {Array.isArray(justifications) ? (
      justifications.map((justification) => (
        <div key={justification.idJustification} className={styles.item}>
          <span>{justification.nomFichier}</span>
          <div className={styles.actions}>
            <button
              onClick={() => handleDownload(justification.idJustification, justification.nomFichier)}
              className={styles.downloadBtn}
            >
              Download
            </button>
            <button
              onClick={() => handleDelete(justification.idJustification)}
              className={styles.deleteBtn}
            >
              Delete
            </button>
          </div>
        </div>
      ))
      ) : (
        <div>No justifications available</div>
      )}
    </div>
  );

}
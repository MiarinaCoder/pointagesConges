// import React from 'react';
// import styles from './JustificationList.module.css';
// import api from '@/services/api';

// export default function JustificationList({ justifications, onDelete }) {
//   const handleDownload = async (id, filename) => {
//     try {
//       // const response = await api.get(`/justifications/${id}`, {
//         const response = await api.get(`/justifications`, {
//         responseType: 'blob',
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//       });
      
//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', filename);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//       window.URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error('Error downloading file:', error);
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       await api.delete(`/justifications/${id}`);
//       onDelete?.(id);
//     } catch (error) {
//       console.error('Error deleting justification:', error);
//     }
//   };

//   return (
//     <div className={styles.list}>
//       {Array.isArray(justifications) ? (
//       justifications.map((justification) => (
//         <div key={justification.idJustification} className={styles.item}>
//           <span>{justification.nomFichier}</span>
//           <div className={styles.actions}>
//             <button
//               onClick={() => handleDownload(justification.idJustification, justification.nomFichier)}
//               className={styles.downloadBtn}
//             >
//               Download
//             </button>
//             <button
//               onClick={() => handleDelete(justification.idJustification)}
//               className={styles.deleteBtn}
//             >
//               Delete
//             </button>
//           </div>
//         </div>
//       ))
//       ) : (
//         <div>No justifications available</div>
//       )}
//     </div>
//   );

// }

import React, { useEffect, useState } from 'react';
import styles from './JustificationList.module.css';
import api from '@/services/api';

export default function JustificationList({ onDelete }) {
  const [justifications, setJustifications] = useState([]);
  // const [refresh, setRefresh] = useState(0); refresh

  useEffect(() => {
    const fetchJustifications = async () => {
      try {
        const response = await api.get('/justifications', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setJustifications(response.data.data || []);
      } catch (error) {
        console.error('Error fetching justifications:', error);
      }
    };

    fetchJustifications();
  }, []);
  

  const handleDownload = async (id, filename) => {
    try {
      const response = await api.get(`/justifications/${id}`, {
        responseType: 'blob',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
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
      await api.delete(`/justifications/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      // setRefresh(prev => prev + 1);
      setJustifications((prev) => prev.filter((j) => j.idJustification !== id));
      onDelete?.(id);
    } catch (error) {
      console.error('Error deleting justification:', error);
    }
  };

  return (
    <div className={styles.list}>
      {justifications.length > 0 ? (
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

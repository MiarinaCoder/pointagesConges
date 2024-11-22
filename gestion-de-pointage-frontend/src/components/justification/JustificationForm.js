// import React, { useCallback, useState } from 'react';
// import { useDropzone } from 'react-dropzone';
// import styles from './JustificationForm.module.css';
// import api from '@/services/api';

// export default function JustificationForm({ idAbsence, onSuccess }) {
//   const [uploading, setUploading] = useState(false);
//   const [error, setError] = useState(null);

//   const onDrop = useCallback(async (acceptedFiles) => {
//     const file = acceptedFiles[0];
//     if (!file) return;

//     setUploading(true);
//     setError(null);

    
//     const formData = new FormData();
//     formData.append('file', file);
//     formData.append('idAbsence', idAbsence);

//     console.log( `Bearer ${localStorage.getItem('token')}`);

//     try {
//       const response =await api.post('/justifications', formData,
//       {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//       }
//       );
//       // console.log('Justification created:', response.data);
//       onSuccess?.();
//       setError(null); 
//     } catch (err) {
//       setError(err.response?.data?.message || 'Error uploading file');
//     } finally {
//       setUploading(false);
//     }
//   }, [idAbsence, onSuccess]);

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     onDrop,
//     accept: {
//       'image/*': ['.jpeg', '.jpg', '.png'],
//       'application/pdf': ['.pdf']
//     },
//     maxSize: 5242880, // 5MB
//     multiple: false
//   });

//   return (
//     <div className={styles.container}>
//       <div
//         {...getRootProps()}
//         className={`${styles.dropzone} ${isDragActive ? styles.active : ''}`}
//       >
//         <input {...getInputProps()} />
//         {uploading ? (
//           <p>Uploading...</p>
//         ) : (
//           <p>Drag & drop a file here, or click to select</p>
//         )}
//       </div>
//       {error && <p className={styles.error}>{error}</p>}
//     </div>
//   );
// }

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import styles from "./JustificationForm.module.css";
import api from "@/services/api";

export default function JustificationForm({ idAbsence, onSuccess }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const onDrop = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("idAbsence", idAbsence);

      try {
        const response = await api.post("/justifications", formData, {
          headers: {
            "Content-Type": "multipart/form-data", // Assure que le format est correctement envoyé
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        // Téléversement réussi
        onSuccess?.();
        setError(null);
      } catch (err) {
        console.error("Erreur lors du téléversement :", err);
        setError(err.response?.data?.message || "Erreur lors du téléversement");
      } finally {
        setUploading(false);
      }
    },
    [idAbsence, onSuccess]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
      "application/pdf": [".pdf"],
    },
    maxSize: 5242880, // 5MB
    multiple: false,
  });

  return (
    <div className={styles.container}>
      <div
        {...getRootProps()}
        className={`${styles.dropzone} ${isDragActive ? styles.active : ""}`}
      >
        <input {...getInputProps()} />
        {uploading ? <p>Uploading...</p> : <p>Drag & drop a file here, or click to select</p>}
      </div>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}

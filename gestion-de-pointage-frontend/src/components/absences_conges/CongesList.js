// import React, { useState, useEffect, useCallback } from 'react';
// import CongeForm from '../forms/CongeForm';
// import Modal from '../common/Modal';
// import ModalConfirmation from '../common/ModalConfirmation';
// import styles from '../../styles/components/congeList.module.css';
// import api from "@/services/api";

// export default function congeList() {
//   const [conges, setconges] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
//   const [selectedconge, setSelectedconge] = useState(null);
//   const [congeToDelete, setcongeToDelete] = useState(null);

//   const fetchconges = useCallback(async () => {
//     try {
//       const response = await api.get('/absence/conge', {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//       });
//       setconges(response.data);
//     } catch (error) {
//       console.error('Erreur lors de la récupération des conges:', error);
//     }
//   }, []);

//   useEffect(() => {
//     fetchconges();
//   }, [fetchconges]);

//   const handleCreate = async (newconge) => {
//     try {
//       await api.post('/absence', newconge, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//       });
//       fetchconges();
//       setIsModalOpen(false);
//     } catch (error) {
//       console.error('Erreur lors de la création de l\'conge:', error);
//     }
//   };

//   const handleUpdate = async (updatedconge) => {
//     try {
//       await api.put(`/absence/${updatedconge.idconge}`, updatedconge, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//       });
//       fetchconges();
//       setIsModalOpen(false);
//       setSelectedconge(null);
//     } catch (error) {
//       console.error('Erreur lors de la mise à jour de l\'conge:', error);
//     }
//   };

//   const openDeleteConfirmation = (conge) => {
//     setcongeToDelete(conge);
//     setIsConfirmModalOpen(true);
//   };

//   const handleDelete = async () => {
//     if (congeToDelete) {
//       try {
//         await api.delete(`/absence/${congeToDelete.idconge}`, {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//         });
//         fetchconges();
//         setIsConfirmModalOpen(false);
//         setcongeToDelete(null);
//       } catch (error) {
//         console.error('Erreur lors de la suppression de l\'conge:', error);
//       }
//     }
//   };

//   const openModal = (conge = null) => {
//     if (conge) {
//       const formattedConge = {
//         type_de_conge: conge.type_de_conge,
//         nombre_jour_conge: Number(conge.nombre_jour_conge),
//         dateDebutAbsence: new Date(conge.dateDebutAbsence).toISOString().split('T')[0],
//         dateFinAbsence: new Date(conge.dateFinAbsence).toISOString().split('T')[0],
//         motif: conge.motif
//       };
//       setSelectedconge(formattedConge);
//     } else {
//       setSelectedconge(null);
//     }
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setSelectedconge(null);
//   };
//     return (
//       <div className={styles.container}>
//         <h2 className={styles.title}>Liste des congés</h2>
//         <button className={styles.addButton} onClick={() => openModal()}>
//           Ajouter une congé
//         </button>
//         <Modal isOpen={isModalOpen} onClose={closeModal}>
//           <CongeForm 
//             conge={selectedconge} 
//             onSubmit={selectedconge ? handleUpdate : handleCreate} 
//             onClose={closeModal}
//           />
//         </Modal>
//         <ModalConfirmation 
//           isOpen={isConfirmModalOpen}
//           onClose={() => setIsConfirmModalOpen(false)}
//           title="Confirmer la suppression"
//           onConfirm={handleDelete}
//           confirmText="Supprimer"
//         >
//           <p>Êtes-vous sûr de vouloir supprimer cette conge ?</p>
//         </ModalConfirmation>
//         <table className={styles.table}>
//           <thead>
//             <tr>
//               <th>Utilisateur</th>
//               <th>Date de début</th>
//               <th>Date de fin</th>
//               <th>Motif</th>
//               <th>Statut</th>
//               <th>Type de congé</th>
//               <th>Nombre de jours de congé</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {conges.map(conge => (
//               <tr key={conge.idconge}>
//                 <td>{conge.nom_utilisateur} {conge.prenom_utilisateur}</td>
//                 <td>{new Date(conge.dateDebutAbsence).toLocaleDateString()}</td>
//                 <td>{conge.dateFinAbsence ? new Date(conge.dateFinAbsence).toLocaleDateString() : 'N/A'}</td>
//                 <td>{conge.motif}</td>
//                 <td>{conge.statut}</td>
//                 <td>{conge.type_de_conge}</td>
//                 <td>{conge.nombre_jour_conge}</td>
//                 <td>
//                   <button onClick={() => openModal(conge)} className={styles.actionButton}>
//                     Modifier
//                   </button>
//                   <button onClick={() => openDeleteConfirmation(conge)} className={styles.actionButton}>
//                     Supprimer
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     );
//   }

import React, { useState, useEffect, useCallback } from 'react';
import CongeForm from '../forms/CongeForm';
import Modal from '../common/Modal';
import ModalConfirmation from '../common/ModalConfirmation';
import styles from '../../styles/components/congeList.module.css';
import api from "@/services/api";

export default function CongeList() {
  const [conges, setConges] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedConge, setSelectedConge] = useState(null);
  const [congeToDelete, setCongeToDelete] = useState(null);

  const fetchConges = useCallback(async () => {
    try {
      const response = await api.get('/absence/conge', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setConges(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des congés:', error);
    }
  }, []);

  useEffect(() => {
    fetchConges();
  }, [fetchConges]);

  const handleCreate = async (newConge) => {
    try {
      await api.post('/absence', newConge, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchConges();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Erreur lors de la création du congé:', error);
    }
  };

  const handleUpdate = async (updatedConge) => {
    try {
      await api.put(`/absence/${selectedConge.idAbsence}`, updatedConge, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchConges();
      setIsModalOpen(false);
      setSelectedConge(null);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du congé:', error);
    }
  };

  const openDeleteConfirmation = (conge) => {
    setCongeToDelete(conge);
    setIsConfirmModalOpen(true);
  };

  const handleDelete = async () => {
    if (congeToDelete) {
      try {
        await api.delete(`/absence/${congeToDelete.idAbsence}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        fetchConges();
        setIsConfirmModalOpen(false);
        setCongeToDelete(null);
      } catch (error) {
        console.error('Erreur lors de la suppression du congé:', error);
      }
    }
  };

  const openModal = (conge = null) => {
    if (conge) {
      const formattedConge = {
        idAbsence: conge.idAbsence,
        type_de_conge: conge.type_de_conge,
        nombre_jour_conge: Number(conge.nombre_jour_conge),
        dateDebutAbsence: new Date(conge.dateDebutAbsence).toISOString().split('T')[0],
        dateFinAbsence: new Date(conge.dateFinAbsence).toISOString().split('T')[0],
        motif: conge.motif
      };
      setSelectedConge(formattedConge);
    } else {
      setSelectedConge(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedConge(null);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Liste des congés</h2>
      <button className={styles.addButton} onClick={() => openModal()}>
        Ajouter un congé
      </button>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <CongeForm 
          conge={selectedConge} 
          onSubmit={selectedConge ? handleUpdate : handleCreate} 
          onClose={closeModal}
        />
      </Modal>
      <ModalConfirmation 
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        title="Confirmer la suppression"
        onConfirm={handleDelete}
        confirmText="Supprimer"
      >
        <p>Êtes-vous sûr de vouloir supprimer ce congé ?</p>
      </ModalConfirmation>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Utilisateur</th>
            <th>Date de début</th>
            <th>Date de fin</th>
            <th>Motif</th>
            <th>Statut</th>
            <th>Type de congé</th>
            <th>Nombre de jours de congé</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {conges.map(conge => (
            <tr key={conge.idAbsence}>
              <td>{conge.nom_utilisateur} {conge.prenom_utilisateur}</td>
              <td>{new Date(conge.dateDebutAbsence).toLocaleDateString()}</td>
              <td>{conge.dateFinAbsence ? new Date(conge.dateFinAbsence).toLocaleDateString() : 'N/A'}</td>
              <td>{conge.motif}</td>
              <td>{conge.statut}</td>
              <td>{conge.type_de_conge}</td>
              <td>{conge.nombre_jour_conge}</td>
              <td>
                <button onClick={() => openModal(conge)} className={styles.actionButton}>
                  Modifier
                </button>
                <button onClick={() => openDeleteConfirmation(conge)} className={styles.actionButton}>
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

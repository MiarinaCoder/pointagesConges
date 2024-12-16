// // import React, { useState, useEffect, useCallback } from 'react';
// // import CongeForm from '../forms/CongeForm';
// // import Modal from '../common/Modal';
// // import ModalConfirmation from '../common/ModalConfirmation';
// // import styles from '../../styles/components/congeList.module.css';
// // import api from "@/services/api";

// // export default function congeList() {
// //   const [conges, setconges] = useState([]);
// //   const [isModalOpen, setIsModalOpen] = useState(false);
// //   const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
// //   const [selectedconge, setSelectedconge] = useState(null);
// //   const [congeToDelete, setcongeToDelete] = useState(null);

// //   const fetchconges = useCallback(async () => {
// //     try {
// //       const response = await api.get('/absence/conge', {
// //         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
// //       });
// //       setconges(response.data);
// //     } catch (error) {
// //       console.error('Erreur lors de la récupération des conges:', error);
// //     }
// //   }, []);

// //   useEffect(() => {
// //     fetchconges();
// //   }, [fetchconges]);

// //   const handleCreate = async (newconge) => {
// //     try {
// //       await api.post('/absence', newconge, {
// //         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
// //       });
// //       fetchconges();
// //       setIsModalOpen(false);
// //     } catch (error) {
// //       console.error('Erreur lors de la création de l\'conge:', error);
// //     }
// //   };

// //   const handleUpdate = async (updatedconge) => {
// //     try {
// //       await api.put(`/absence/${updatedconge.idconge}`, updatedconge, {
// //         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
// //       });
// //       fetchconges();
// //       setIsModalOpen(false);
// //       setSelectedconge(null);
// //     } catch (error) {
// //       console.error('Erreur lors de la mise à jour de l\'conge:', error);
// //     }
// //   };

// //   const openDeleteConfirmation = (conge) => {
// //     setcongeToDelete(conge);
// //     setIsConfirmModalOpen(true);
// //   };

// //   const handleDelete = async () => {
// //     if (congeToDelete) {
// //       try {
// //         await api.delete(`/absence/${congeToDelete.idconge}`, {
// //           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
// //         });
// //         fetchconges();
// //         setIsConfirmModalOpen(false);
// //         setcongeToDelete(null);
// //       } catch (error) {
// //         console.error('Erreur lors de la suppression de l\'conge:', error);
// //       }
// //     }
// //   };

// //   const openModal = (conge = null) => {
// //     if (conge) {
// //       const formattedConge = {
// //         type_de_conge: conge.type_de_conge,
// //         nombre_jour_conge: Number(conge.nombre_jour_conge),
// //         dateDebutAbsence: new Date(conge.dateDebutAbsence).toISOString().split('T')[0],
// //         dateFinAbsence: new Date(conge.dateFinAbsence).toISOString().split('T')[0],
// //         motif: conge.motif
// //       };
// //       setSelectedconge(formattedConge);
// //     } else {
// //       setSelectedconge(null);
// //     }
// //     setIsModalOpen(true);
// //   };

// //   const closeModal = () => {
// //     setIsModalOpen(false);
// //     setSelectedconge(null);
// //   };
// //     return (
// //       <div className={styles.container}>
// //         <h2 className={styles.title}>Liste des congés</h2>
// //         <button className={styles.addButton} onClick={() => openModal()}>
// //           Ajouter une congé
// //         </button>
// //         <Modal isOpen={isModalOpen} onClose={closeModal}>
// //           <CongeForm
// //             conge={selectedconge}
// //             onSubmit={selectedconge ? handleUpdate : handleCreate}
// //             onClose={closeModal}
// //           />
// //         </Modal>
// //         <ModalConfirmation
// //           isOpen={isConfirmModalOpen}
// //           onClose={() => setIsConfirmModalOpen(false)}
// //           title="Confirmer la suppression"
// //           onConfirm={handleDelete}
// //           confirmText="Supprimer"
// //         >
// //           <p>Êtes-vous sûr de vouloir supprimer cette conge ?</p>
// //         </ModalConfirmation>
// //         <table className={styles.table}>
// //           <thead>
// //             <tr>
// //               <th>Utilisateur</th>
// //               <th>Date de début</th>
// //               <th>Date de fin</th>
// //               <th>Motif</th>
// //               <th>Statut</th>
// //               <th>Type de congé</th>
// //               <th>Nombre de jours de congé</th>
// //               <th>Actions</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {conges.map(conge => (
// //               <tr key={conge.idconge}>
// //                 <td>{conge.nom_utilisateur} {conge.prenom_utilisateur}</td>
// //                 <td>{new Date(conge.dateDebutAbsence).toLocaleDateString()}</td>
// //                 <td>{conge.dateFinAbsence ? new Date(conge.dateFinAbsence).toLocaleDateString() : 'N/A'}</td>
// //                 <td>{conge.motif}</td>
// //                 <td>{conge.statut}</td>
// //                 <td>{conge.type_de_conge}</td>
// //                 <td>{conge.nombre_jour_conge}</td>
// //                 <td>
// //                   <button onClick={() => openModal(conge)} className={styles.actionButton}>
// //                     Modifier
// //                   </button>
// //                   <button onClick={() => openDeleteConfirmation(conge)} className={styles.actionButton}>
// //                     Supprimer
// //                   </button>
// //                 </td>
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>
// //       </div>
// //     );
// //   }

// import React, { useState, useEffect, useCallback } from "react";
// import {
//   FaPlus,
//   FaSpinner,
//   FaEdit,
//   FaTrash,
//   FaCheck,
//   FaTimes,
// } from "react-icons/fa";

// import CongeForm from "../forms/CongeForm";
// import Modal from "../common/Modal";
// import ModalConfirmation from "../common/ModalConfirmation";
// import styles from "../../styles/components/congeList.module.css";
// import api from "@/services/api";
// import ActionDropdown from "../common/ActionDropdown";
// import { toast } from "react-toastify";

// export default function CongeList({ userId, isAdmin }) {
//   const [conges, setConges] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
//   const [selectedConge, setSelectedConge] = useState(null);
//   const [congeToDelete, setCongeToDelete] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(5);

//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = conges.slice(indexOfFirstItem, indexOfLastItem);

//   const paginate = (pageNumber) => {
//     if (pageNumber > 0 && pageNumber <= Math.ceil(conges.length / itemsPerPage)) {
//       setCurrentPage(pageNumber);
//     }
//   };

//   const formatDate = (date) => {
//     return new Intl.DateTimeFormat("fr-FR", {
//       day: "2-digit",
//       month: "long",
//       year: "numeric",
//     }).format(new Date(date));
//   };

//   const getStatusStyle = (status) => {
//     switch (status.toLowerCase()) {
//       case "en_attente":
//         return styles.statusPending;
//       case "rejete":
//         return styles.statusRejected;
//       case "approuvee":
//         return styles.statusApproved;
//       default:
//         return "";
//     }
//   };

//   const fetchConges = useCallback(async () => {
//     try {
//       const endpoint = userId
//         ? `/absence/conge/user/${userId}`
//         : "/absence/conge";
//       const response = await api.get(endpoint);
//       setConges(response.data);
//       setLoading(false);
//     } catch (error) {
//       console.error("Erreur lors de la récupération des congés:", error);
//       toast.error("Erreur lors du chargement des congés");
//       setLoading(false);
//     }
//   }, [userId]);

//   useEffect(() => {
//     fetchConges();
//   }, [fetchConges]);

//   const handleCreate = async (newConge) => {
//     try {
//       await api.post("/absence", newConge);
//       fetchConges();
//       setIsModalOpen(false);
//       toast.success("Congé créé avec succès");
//     } catch (error) {
//       toast.error("Erreur lors de la création du congé");
//     }
//   };

//   const handleUpdate = async (updatedConge) => {
//     try {
//       await api.put(`/absence/${selectedConge.idAbsence}`, updatedConge);
//       fetchConges();
//       setIsModalOpen(false);
//       setSelectedConge(null);
//       toast.success("Congé mis à jour avec succès");
//     } catch (error) {
//       toast.error("Erreur lors de la mise à jour du congé");
//     }
//   };

//   const handleDelete = async () => {
//     if (congeToDelete) {
//       try {
//         await api.delete(`/absence/${congeToDelete.idAbsence}`);
//         fetchConges();
//         setIsConfirmModalOpen(false);
//         setCongeToDelete(null);
//         toast.success("Congé supprimé avec succès");
//       } catch (error) {
//         toast.error("Erreur lors de la suppression du congé");
//       }
//     }
//   };

//   const handleStatusUpdate = async (id, newStatus) => {
//     try {
//       await api.patch(`/absence/conge/status/${id}`, { statut: newStatus });
//       fetchConges();
//       toast.success("Statut mis à jour avec succès");
//     } catch (error) {
//       toast.error("Erreur lors de la mise à jour du statut");
//     }
//   };

//   const openModal = (conge = null) => {
//     if (conge) {
//       const formattedConge = {
//         idAbsence: conge.idAbsence,
//         type_de_conge: conge.type_de_conge,
//         nombre_jour_conge: Number(conge.nombre_jour_conge),
//         dateDebutAbsence: new Date(conge.dateDebutAbsence)
//           .toISOString()
//           .split("T")[0],
//         dateFinAbsence: new Date(conge.dateFinAbsence)
//           .toISOString()
//           .split("T")[0],
//         motif: conge.motif,
//       };
//       setSelectedConge(formattedConge);
//     } else {
//       setSelectedConge(null);
//     }
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setSelectedConge(null);
//   };

//   return (
//     <div className={styles.container}>
//       <h2 className={styles.title}>
//         {userId ? "Mes demandes de congés" : "Gestion des congés"}
//       </h2>

//       <button className={styles.addButton} onClick={() => openModal()}>
//         <FaPlus />
//         {userId ? "Nouvelle demande" : "Ajouter un congé"}
//       </button>

//       <Modal isOpen={isModalOpen} onClose={closeModal}>
//         <CongeForm
//           conge={selectedConge}
//           onSubmit={selectedConge ? handleUpdate : handleCreate}
//           onClose={closeModal}
//         />
//       </Modal>

//       <ModalConfirmation
//         isOpen={isConfirmModalOpen}
//         onClose={() => setIsConfirmModalOpen(false)}
//         title="Confirmer la suppression"
//         onConfirm={handleDelete}
//         confirmText="Supprimer"
//       >
//         <p>Êtes-vous sûr de vouloir supprimer ce congé ?</p>
//       </ModalConfirmation>

//       {loading ? (
//         <div className={styles.loading}>
//           <FaSpinner className={styles.spinner} />
//           Chargement...
//         </div>
//       ) : conges.length === 0 ? (
//         <div className={styles.noData}>
//           Aucune demande de congé n'a été trouvée.
//         </div>
//       ) : (
//         <div className={styles.tableContainer}>
//           <table className={styles.table}>
//             <thead>
//               <tr>
//                 <th>Utilisateur</th>
//                 <th>Date de début</th>
//                 <th>Date de fin</th>
//                 <th>Motif</th>
//                 <th>Statut</th>
//                 <th>Type</th>
//                 <th>Jours</th>
//                 {isAdmin && <th>Actions</th>}
//               </tr>
//             </thead>
//             <tbody>
//               {currentItems.map((conge) => (
//                 <tr key={conge.idAbsence}>
//                   <td>
//                     {conge.nom_utilisateur} {conge.prenom_utilisateur}
//                   </td>
//                   <td className={styles.dateCell}>
//                     {formatDate(conge.dateDebutAbsence)}
//                   </td>
//                   <td className={styles.dateCell}>
//                     {conge.dateFinAbsence
//                       ? formatDate(conge.dateFinAbsence)
//                       : "N/A"}
//                   </td>
//                   <td>{conge.motif}</td>
//                   <td>
//                     <span className={getStatusStyle(conge.statut)}>
//                       {conge.statut}
//                     </span>
//                   </td>
//                   <td>{conge.type_de_conge}</td>
//                   <td>{conge.nombre_jour_conge}</td>
//                   {isAdmin && (
//                     <td>
//                       <ActionDropdown>
//                         <div className={styles.dropdownCard}>
//                           <div className={styles.dropdownHeader}>
//                             <h4>Actions disponibles</h4>
//                           </div>

//                           <div className={styles.dropdownContent}>
//                             <button
//                               onClick={() => openModal(conge)}
//                               className={`${styles.dropdownItem} ${styles.modify}`}
//                               aria-label="Modifier la demande"
//                             >
//                               <FaEdit className={styles.actionIcon} />
//                               <span>Modifier</span>
//                             </button>

//                             <button
//                               onClick={() => {
//                                 setCongeToDelete(conge);
//                                 setIsConfirmModalOpen(true);
//                               }}
//                               className={`${styles.dropdownItem} ${styles.delete}`}
//                               aria-label="Supprimer la demande"
//                             >
//                               <FaTrash className={styles.actionIcon} />
//                               <span>Supprimer</span>
//                             </button>

//                             {conge.statut === "en_attente" && (
//                               <>
//                                 <div
//                                   className={styles.dropdownDivider}
//                                   role="separator"
//                                 />

//                                 <button
//                                   onClick={() =>
//                                     handleStatusUpdate(
//                                       conge.idAbsence,
//                                       "approuvee"
//                                     )
//                                   }
//                                   className={`${styles.dropdownItem} ${styles.approve}`}
//                                   aria-label="Approuver la demande"
//                                 >
//                                   <FaCheck className={styles.actionIcon} />
//                                   <span>Approuver</span>
//                                 </button>

//                                 <button
//                                   onClick={() =>
//                                     handleStatusUpdate(
//                                       conge.idAbsence,
//                                       "rejete"
//                                     )
//                                   }
//                                   className={`${styles.dropdownItem} ${styles.reject}`}
//                                   aria-label="Rejeter la demande"
//                                 >
//                                   <FaTimes className={styles.actionIcon} />
//                                   <span>Rejeter</span>
//                                 </button>
//                               </>
//                             )}
//                           </div>
//                         </div>
//                       </ActionDropdown>
//                     </td>
//                   )}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       <div className={styles.pagination}>
//         <select
//           className={styles.rowsPerPage}
//           onChange={(e) => setItemsPerPage(Number(e.target.value))}
//         >
//           <option value={5}>5 par page</option>
//           <option value={10}>10 par page</option>
//           <option value={25}>25 par page</option>
//           <option value={50}>50 par page</option>
//         </select>

//         <button
//           className={styles.paginationButton}
//           onClick={() => paginate(currentPage - 1)}
//           disabled={currentPage === 1}
//         >
//           Précédent
//         </button>

//         <span className={styles.paginationInfo}>
//           Page {currentPage} sur {Math.ceil(conges.length / itemsPerPage)}
//         </span>

//         <button
//           className={styles.paginationButton}
//           onClick={() => paginate(currentPage + 1)}
//           disabled={currentPage === Math.ceil(conges.length / itemsPerPage)}
//         >
//           Suivant
//         </button>
//       </div>
//     </div>
//   );
// }


import React, { useState, useEffect, useCallback } from "react";
import {
  FaPlus,
  FaSpinner,
  FaEdit,
  FaTrash,
  FaCheck,
  FaTimes,
} from "react-icons/fa";

import CongeForm from "../forms/CongeForm";
import Modal from "../common/Modal";
import ModalConfirmation from "../common/ModalConfirmation";
import styles from "../../styles/components/CongeList.module.css";
import api from "@/services/api";
import ActionDropdown from "../common/ActionDropdown";
import { toast } from "react-toastify";
import SuggestionForm from "../forms/SuggestionModal";
import ViewSuggestionModal from "../forms/ViewSuggestionModal";

export default function CongeList({ userId, isAdmin }) {
  const [conges, setConges] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedConge, setSelectedConge] = useState(null);
  const [congeToDelete, setCongeToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [refreshKey, setRefreshKey] = useState(0);
  // const [isSuggesting, setIsSuggesting] = useState(false);
  const [isViewSuggestionModalOpen, setIsViewSuggestionModalOpen] = useState(false);
  // const userLocalStorage=localStorage.getItem('user');
  // const idLocalstorage=userLocalStorage.id;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = conges.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= Math.ceil(conges.length / itemsPerPage)) {
      setCurrentPage(pageNumber);
    }
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(date));
  };

  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case "en_attente":
        return styles.statusPending;
      case "rejete":
        return styles.statusRejected;
      case "approuvee":
        return styles.statusApproved;
      default:
        return "";
    }
  };

  const fetchConges = useCallback(async () => {
    setLoading(true);
    try {
      const endpoint = userId
        ? `/absence/conge/user/${userId}`
        : "/absence/conge";
      const response = await api.get(endpoint);
      setConges(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des congés:", error);
      toast.error("Erreur lors du chargement des congés");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const fetchCongesEmploye = useCallback(async () => {
    setLoading(true);
    try {
      const endpoint =  `/absence/conge/user/${userId}`;
      const response = await api.get(endpoint);
      setConges(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des congés:", error);
      toast.error("Erreur lors du chargement des congés");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(()=>{
    fetchConges(); 
  }, [fetchConges, refreshKey]);

  const handleCreate = async (newConge) => {
    try {
      const response= await api.post("/absence", newConge);
      // const createdConge = response.data;
      // setConges((prev) => [createdConge, ...prev]); // Ajouter immédiatement
      setRefreshKey((prev) => prev + 1);
      setIsModalOpen(false);
      toast.success("Congé créé avec succès");
    } catch (error) {
      toast.error("Erreur lors de la création du congé");
    }
  };

  const handleUpdate = async (updatedConge) => {
    try {
      const response= await api.put(`/absence/${selectedConge.idAbsence}`, updatedConge);
      // const updatedCongeData = response.data;
      // setConges((prev) => [updatedCongeData, ...prev]); // Ajouter immédiatement
      setRefreshKey((prev) => prev + 1);
      setIsModalOpen(false);
      setSelectedConge(null);
      toast.success("Congé mis à jour avec succès");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du congé");
    }
  };

  const handleDelete = async () => {
    if (congeToDelete) {
      try {
        await api.delete(`/absence/${congeToDelete.idAbsence}`);
        setRefreshKey((prev) => prev + 1);
        setIsConfirmModalOpen(false);
        setCongeToDelete(null);
        toast.success("Congé supprimé avec succès");
      } catch (error) {
        toast.error("Erreur lors de la suppression du congé");
      }
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await api.patch(`/absence/conge/status/${id}`, { statut: newStatus });
      setRefreshKey((prev) => prev + 1);
      toast.success("Statut mis à jour avec succès");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du statut");
    }
  };

const [isSuggestionModalOpen, setIsSuggestionModalOpen] = useState(false);

const handleSuggestion = async (suggestionData) => {
  console.log(suggestionData);
  try {
    await api.put(`/absence/${selectedConge.idAbsence}/suggest`, suggestionData, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    fetchConges();
    setIsSuggestionModalOpen(false);
    toast.success("Suggestion envoyée avec succès");
  } catch (error) {
    console.error('Erreur lors de la suggestion:', error);
    toast.error("Erreur lors de l'envoi de la suggestion");
  }
};

// For employee - responding to suggestion
// const handleSuggestionResponse = async (congeId, accepted) => {
//   try {
//     await api.post(`/absence/${congeId}/suggest/response`, 
//       accepted,
//     {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//       }
//     );
//     toast.success(accepted ? 
//       "Dates suggérées acceptées" : 
//       "Dates suggérées refusées"
//     );
//     setRefreshKey(prev => prev + 1);
//   } catch (error) {
//     toast.error("Erreur lors de la réponse à la suggestion");
//   }
// };
  

const handleSuggestionResponse = async (congeId, accepted) => {
  try {
    await api.post(`/absence/${congeId}/suggest/response`, {
      accepted
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    
    toast.success(accepted ? "Suggestion acceptée" : "Suggestion refusée");
    setRefreshKey(prev => prev + 1);
  } catch (error) {
    console.error('Erreur:', error);
    toast.error("Erreur lors du traitement de la suggestion");
  }
};

  const openModal = (conge = null) => {
    if (conge) {
      const formattedConge = {
        idAbsence: conge.idAbsence,
        type_de_conge: conge.type_de_conge,
        nombre_jour_conge: Number(conge.nombre_jour_conge),
        dateDebutAbsence: new Date(conge.dateDebutAbsence)
          .toISOString()
          .split("T")[0],
        dateFinAbsence: new Date(conge.dateFinAbsence)
          .toISOString()
          .split("T")[0],
        motif: conge.motif,
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

  const openSuggestionModal = (conge) => {
    setSelectedConge(conge);
    setIsSuggestionModalOpen(true);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        {userId ? "Mes demandes de congés" : "Gestion des congés"}
      </h2>

      <button className={styles.addButton} onClick={() => openModal()}>
        <FaPlus />
        {userId ? "Nouvelle demande" : "Ajouter un congé"}
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

      {loading ? (
        <div className={styles.loading}>
          <FaSpinner className={styles.spinner} />
          Chargement...
        </div>
      ) : conges.length === 0 ? (
        <div className={styles.noData}>
          Aucune demande de congé n&apos;a été trouvée.
        </div>
      ) : (
                  <div className={styles.tableContainer}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>Utilisateur</th>
                          <th>Date de début</th>
                          <th>Date de fin</th>
                          <th>Motif</th>
                          <th>Statut</th>
                          <th>Type</th>
                          <th>Jours</th>
                          {/* {isAdmin && <th>Actions</th>} */}
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentItems.map((conge) => (
                          <tr key={conge.idAbsence}>
                            <td>
                              {conge.nom_utilisateur} {conge.prenom_utilisateur}
                            </td>
                            <td className={styles.dateCell}>
                              {formatDate(conge.dateDebutAbsence)}
                            </td>
                            <td className={styles.dateCell}>
                              {conge.dateFinAbsence
                                ? formatDate(conge.dateFinAbsence)
                                : "N/A"}
                            </td>
                            <td>{conge.motif}</td>
                            <td>
                              <span className={getStatusStyle(conge.statut)}>
                                {conge.statut}
                              </span>
                            </td>
                            <td>{conge.type_de_conge}</td>
                            <td>{conge.nombre_jour_conge}</td>
                            {!isAdmin && conge.statut === "en_attente" && (
                              <td>
                              <button
                                onClick={() => openModal(conge)}
                                className={`${styles.dropdownItem} ${styles.modify}`}
                                aria-label="Modifier la demande"
                              >
                                <FaEdit className={styles.actionIcon} />
                                <span>Modifier</span>
                              </button>
                              </td>
                            )}
                          {!isAdmin && conge.status === 'suggestion_pending' && (
                            <td>
                            <div className={styles.suggestionActions}>
                              <button 
                                onClick={() => handleSuggestionResponse(conge.idAbsence, true)}
                                className={`${styles.dropdownItem} ${styles.approve}`}
                              >
                                <FaCheck className={styles.actionIcon} />
                                <span>Accepter les dates suggérées</span>
                              </button>
                              <button 
                                onClick={() => handleSuggestionResponse(conge.idAbsence, false)}
                                className={`${styles.dropdownItem} ${styles.reject}`}
                              >
                                <FaTimes className={styles.actionIcon} />
                                <span>Refuser les dates suggérées</span>
                              </button>
                            </div>
                            </td>
                          )}
                          
                          {/* {!isAdmin && conge.statut === 'suggestion_attente' && (
                            
                            <div className={styles.suggestionAlert}>
                              <div className={styles.suggestionBadge}>
                                Nouvelle suggestion
                              </div>
                              <div className={styles.suggestionActions}>
                                <button 
                                  onClick={() => handleSuggestionResponse(conge.idAbsence, true)}
                                  className={`${styles.dropdownItem} ${styles.approve}`}
                                >
                                  <FaCheck /> Accepter
                                </button>
                                <button 
                                  onClick={() => handleSuggestionResponse(conge.idAbsence, false)}
                                  className={`${styles.dropdownItem} ${styles.reject}`}
                                >
                                  <FaTimes /> Refuser
                                </button>
                              </div>
                            </div> */}

                          {/* )} */}
                          
                          {!isAdmin && conge.statut === 'suggestion_attente' && (
                            <td>
                            <button
                              onClick={() => {
                                setSelectedConge(conge);
                                setIsViewSuggestionModalOpen(true);
                              }}
                              className={styles.viewSuggestionButton}
                            >
                              Voir la suggestion
                            </button>
                            </td>
                          )}



                            {isAdmin && (
                              <td>
                                <ActionDropdown>
                                  <div className={styles.dropdownCard}>
                                    <div className={styles.dropdownHeader}>
                                      <h4>Actions disponibles</h4>
                                    </div>
          
                                    <div className={styles.dropdownContent}>
                                    
                                      {/* <button
                                        onClick={() => openModal(conge)}
                                        className={`${styles.dropdownItem} ${styles.modify}`}
                                        aria-label="Modifier la demande"
                                      >
                                        <FaEdit className={styles.actionIcon} />
                                        <span>Modifier</span>
                                      </button> */}
          
                                      <button
                                        onClick={() => {
                                          setCongeToDelete(conge);
                                          setIsConfirmModalOpen(true);
                                        }}
                                        className={`${styles.dropdownItem} ${styles.delete}`}
                                        aria-label="Supprimer la demande"
                                      >
                                        <FaTrash className={styles.actionIcon} />
                                        <span>Supprimer</span>
                                      </button>

                                      {conge.statut === "en_attente" && (conge.type_de_conge !== "congé de maternité" || conge.type_de_conge !== "congé de paternité") && (
                                        <>
                                    <button
                                      onClick={() => openSuggestionModal(conge)}
                                      className={`${styles.dropdownItem} ${styles.modify}`}
                                      aria-label="Suggérer des dates"
                                    >
                                      <FaEdit className={styles.actionIcon} />
                                      <span>Suggérer des dates</span>
                                    </button>

                                          <div
                                            className={styles.dropdownDivider}
                                            role="separator"
                                          />
          
                                          <button
                                            onClick={() =>
                                              handleStatusUpdate(
                                                conge.idAbsence,
                                                "approuvee"
                                              )
                                            }
                                            className={`${styles.dropdownItem} ${styles.approve}`}
                                            aria-label="Approuver la demande"
                                          >
                                            <FaCheck className={styles.actionIcon} />
                                            <span>Approuver</span>
                                          </button>
          
                                          <button
                                            onClick={() =>
                                              handleStatusUpdate(
                                                conge.idAbsence,
                                                "rejete"
                                              )
                                            }
                                            className={`${styles.dropdownItem} ${styles.reject}`}
                                            aria-label="Rejeter la demande"
                                          >
                                            <FaTimes className={styles.actionIcon} />
                                            <span>Rejeter</span>
                                          </button>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </ActionDropdown>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
          
                <div className={styles.pagination}>
                  <select
                    className={styles.rowsPerPage}
                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  >
                    <option value={5}>5 par page</option>
                    <option value={10}>10 par page</option>
                    <option value={25}>25 par page</option>
                    <option value={50}>50 par page</option>
                  </select>
          
                  <button
                    className={styles.paginationButton}
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Précédent
                  </button>
          
                  <span className={styles.paginationInfo}>
                    Page {currentPage} sur {Math.ceil(conges.length / itemsPerPage)}
                  </span>
          
                  <button
                    className={styles.paginationButton}
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === Math.ceil(conges.length / itemsPerPage)}
                  >
                    Suivant
                  </button>
                </div>


                {/* <Modal 
                  isOpen={isSuggestionModalOpen} 
                  onClose={() => setIsSuggestionModalOpen(false)}
                >
                  <SuggestionForm
                    conge={selectedConge}
                    onSubmit={handleSuggestion}
                    onClose={() => setIsSuggestionModalOpen(false)}
                  />
                </Modal> */}

              <Modal 
                isOpen={isSuggestionModalOpen} 
                onClose={() => setIsSuggestionModalOpen(false)}
              >
                <SuggestionForm
                  conge={selectedConge}
                  onSubmit={handleSuggestion}
                  onClose={() => setIsSuggestionModalOpen(false)}
                />
              </Modal>

              <Modal 
                isOpen={isViewSuggestionModalOpen} 
                onClose={() => setIsViewSuggestionModalOpen(false)}
              >
                <ViewSuggestionModal
                  conge={selectedConge}
                  onAccept={async () => {
                    await handleSuggestionResponse(selectedConge.idAbsence, true);
                    setIsViewSuggestionModalOpen(false);
                  }}
                  onReject={async () => {
                    await handleSuggestionResponse(selectedConge.idAbsence, false);
                    setIsViewSuggestionModalOpen(false);
                  }}
                  onClose={() => setIsViewSuggestionModalOpen(false)}
                />
              </Modal>
    </div>
  );
}

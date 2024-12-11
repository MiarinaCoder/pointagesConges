// import React, { useEffect, useState, useContext } from "react";
// import { toast } from "react-toastify";
// import { retardService } from "@/services/retardService";
// import AuthContext from "@/context/authContext";
// import styles from "./../../styles/components/RetardNotification.module.css";
// import JustificationForm from '@/components/justification/JustificationForm';

//   const RetardNotification = () => {
//     const [retardInfo, setRetardInfo] = useState(null);
//     const [showJustificationForm, setShowJustificationForm] = useState(false);
//     const [showDescriptionModal, setShowDescriptionModal] = useState(false);
//     const { user } = useContext(AuthContext);
//     const [hasJustification, setHasJustification] = useState(false);
//     const [description, setDescription] = useState("");

//     const formatHeureArrivee = (heureArrivee) => {
//       const date = new Date(heureArrivee);
//       return new Intl.DateTimeFormat("fr-FR", {
//         hour: "2-digit",
//         minute: "2-digit",
//         second: "2-digit",
//       }).format(date);
//     };

//     const handleJustificationSuccess = async () => {
//       try {
//         await retardService.updateJustification(retardInfo.idRetard);
//         setShowJustificationForm(false);
//         setHasJustification(true);
//         toast.success("Justificatif de retard envoyé avec succès");
//       } catch (error) {
//         console.error("Erreur lors de la mise à jour de la justification:", error);
//         toast.error("Erreur lors de l'envoi du justificatif");
//       }
//     };

//     const handleDescriptionSubmit = async (description) => {
//       try {
//         await retardService.updateDescription(retardInfo.idRetard, description);
//         setShowDescriptionModal(false);
//         setDescription(description);
//         toast.success("Description ajoutée avec succès");
//       } catch (error) {
//         console.error("Erreur lors de l'ajout de la description:", error);
//         toast.error("Erreur lors de l'ajout de la description");
//       }
//     };

//     useEffect(() => {
//       const checkRetard = async () => {
//         try {
//           const data = await retardService.checkRetard(localStorage.getItem('sessionId'));
//           if (data.estEnRetard) {
//             setRetardInfo(data);
//             setHasJustification(data.isJustified);
//             if (data.description) {
//               setDescription(data.description);
//               setShowDescriptionModal(false);
//             }
//           }
//         } catch (error) {
//           console.error("Error checking retard:", error);
//         }
//       };

//       checkRetard();
//     }, [user]);

//     if (!retardInfo?.estEnRetard) {
//       return null;
//     }

//     return (
//       <div className={styles.retardAlert}>
//         <span className={styles.retardMessage}>
//           <strong>Notification de retard</strong>
//           <p>Vous êtes arrivé(e) à {formatHeureArrivee(retardInfo.heureArrivee)}</p>
//           <p>
//             Retard de {retardInfo.heuresRetard} heures : {retardInfo.minutesRetard} minutes :{" "}
//             {retardInfo.secondesRetard} secondes
//           </p>
//           {!hasJustification && user?.role !== 'administrateur' && (
//             <button 
//               onClick={() => setShowJustificationForm(true)}
//               className={styles.justifyButton}
//             >
//               Justifier le retard
//             </button>
//           )}
//           {!description && user?.role !== 'administrateur' && (
//             <button 
//               onClick={() => setShowDescriptionModal(true)}
//               className={styles.descriptionLink}
//             >
//               Ajouter une description
//             </button>
//           )}
//         </span>

//         {showDescriptionModal && (
//           <div className={styles.modal}>
//             <div className={styles.modalContent}>
//               <h3>Description du retard</h3>
//               <textarea
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//                 placeholder="Décrivez la raison de votre retard..."
//                 rows={4}
//                 className={styles.descriptionTextarea}
//               />
//               <div className={styles.modalButtons}>
//                 <button onClick={() => setShowDescriptionModal(false)}>Fermer</button>
//                 <button onClick={() => handleDescriptionSubmit(description)}>
//                   Sauvegarder
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {showJustificationForm && user?.role !== 'administrateur' && !hasJustification && (
//           <div className={styles.justificationFormWrapper}>
//             <JustificationForm 
//               onSuccess={handleJustificationSuccess}
//               idRetard={retardInfo.idRetard}
//             />
//           </div>
//         )}
//       </div>
//     );
//   };

//   export default RetardNotification;

import React, { useEffect, useState, useContext } from "react";
import { toast } from "react-toastify";
import { retardService } from "@/services/retardService";
import AuthContext from "@/context/authContext";
import styles from "./../../styles/components/RetardNotification.module.css";
import RetardJustificationModal from '../modals/RetardJustificationModal';

const RetardNotification = () => {
  const [retardInfo, setRetardInfo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { user } = useContext(AuthContext);
  const [hasJustification, setHasJustification] = useState(false);

  const formatHeureArrivee = (heureArrivee) => {
    const date = new Date(heureArrivee);
    return new Intl.DateTimeFormat("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(date);
  };

  const handleJustificationSubmit = async (formData) => {
    try {
      await retardService.submitJustification(retardInfo.idRetard, formData);
      setShowModal(false);
      setHasJustification(true);
      toast.success("Justificatif de retard envoyé avec succès");
    } catch (error) {
      console.error("Erreur détaillée:", error.response?.data);
      toast.error(error.response?.data?.message || "Erreur lors de l'envoi du justificatif");
    }
  };  
  
  useEffect(() => {
    const checkRetard = async () => {
      try {
        const data = await retardService.checkRetard(localStorage.getItem('sessionId'));
        if (data.estEnRetard) {
          setRetardInfo(data);
          setHasJustification(data.isJustified);
        }
      } catch (error) {
        console.error("Error checking retard:", error);
      }
    };

    checkRetard();
  }, [user]);

  if (!retardInfo?.estEnRetard) {
    return null;
  }

  return (
    <>
      <div className={styles.retardAlert}>
        <span className={styles.retardMessage}>
          <strong>Notification de retard</strong>
          <p>Vous êtes arrivé(e) à {formatHeureArrivee(retardInfo.heureArrivee)}</p>
          <p>
            Retard de {retardInfo.heuresRetard} heures : {retardInfo.minutesRetard} minutes :{" "}
            {retardInfo.secondesRetard} secondes
          </p>
          {!hasJustification && user?.role !== 'administrateur' && (
            <button 
              onClick={() => setShowModal(true)}
              className={styles.justifyButton}
            >
              Justifier le retard
            </button>
          )}
        </span>
      </div>

      <RetardJustificationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleJustificationSubmit}
      />
    </>
  );
};

export default RetardNotification;

// import React, { useEffect, useState, useContext } from 'react';
// import { toast } from 'react-toastify';
// import { retardService } from '@/services/retardService';
// import AuthContext from '@/context/authContext';
// import styles from './../../styles/components/RetardNotification.module.css';

// const RetardNotification=()=> {
//   const [retardInfo, setRetardInfo] = useState(null);
//   const { user } = useContext(AuthContext);

//   useEffect(() => {
//     const checkRetard = async () => {
//       console.log('User session ID:', user?.sessionId);
//       if (!user?.sessionId) return;

//       try {
//         const data = await retardService.checkRetard(user?.sessionId);
//         console.log('Retard data received:', data);
//         setRetardInfo(data);
        
//         if (data.estEnRetard) {
//           toast.warning(
//             // `Retard de ${retardInfo.heuresRetard}heures:${retardInfo.minutesRetard}minutes:${retardInfo.secondesRetard}secondes minutes! (Arrivée: ${data.heureArrivee})`, 
//             {
//               position: "top-center",
//               autoClose: 15000,
//               hideProgressBar: false,
//               closeOnClick: true,
//               pauseOnHover: true,
//               draggable: true,
//               className: styles.customToast,
//               theme: "colored"
//             }
//           );
//         }
//       } catch (error) {
//         console.error('Retard check error:', error);
//       }
//     };

//     checkRetard();
//     const interval = setInterval(checkRetard, 5 * 60 * 1000);
//     return () => clearInterval(interval);
//   }, [user]);

//   if (!retardInfo?.estEnRetard) {
//     console.log('No retard info or not late');
//     return null;
//   }

//   const formatHeureArrivee = (heureArrivee) => {
//     const date = new Date(heureArrivee);
//     return new Intl.DateTimeFormat('fr-FR', {
//       hour: '2-digit',
//       minute: '2-digit',
//       second: '2-digit',
//     }).format(date);
//   };

//   return (
//     <div className={styles.retardAlert}>
//       <span className={styles.retardMessage}>
//         <strong>Notification de retard</strong>
//         <p>Vous êtes arrivé(e) à {formatHeureArrivee(retardInfo.heureArrivee)}</p>
//         <p>Retard de  {retardInfo.heuresRetard}heures:{retardInfo.minutesRetard}minutes:{retardInfo.secondesRetard}secondes</p>
//       </span>
//     </div>
//   );
// }

// export default RetardNotification;

import React, { useEffect, useState, useContext } from "react";
import { toast } from "react-toastify";
import { retardService } from "@/services/retardService";
import AuthContext from "@/context/authContext";
import JustificationForm from "@/components/justification/JustificationForm"; // Vérifiez que vous avez ce composant
import styles from "./../../styles/components/RetardNotification.module.css";

const RetardNotification = ({ onRetardDetected }) => {
  const [retardInfo, setRetardInfo] = useState(null); // Initialisez avec null
  const [hasNotified, setHasNotified] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const checkRetard = async () => {
      if (!user?.sessionId) return;

      try {
        const data = await retardService.checkRetard(user?.sessionId);

        // Si le retard est détecté et pas encore notifié
        if (data.estEnRetard && !hasNotified) {
          setRetardInfo(data); // Stocke les infos de retard
          setHasNotified(true); // Empêche les notifications répétées
          onRetardDetected?.(data); // Notifie le parent

          // Affiche la notification Toast
          toast.warning(
            `Retard détecté : ${data.heuresRetard} heures, ${data.minutesRetard} minutes`,
            {
              position: "top-center",
              autoClose: 15000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              className: styles.customToast,
              theme: "colored",
            }
          );
        }
      } catch (error) {
        console.error("Erreur lors de la vérification du retard :", error);
      }
    };

    checkRetard();
    const interval = setInterval(checkRetard, 5 * 60 * 1000); // Vérifie toutes les 5 minutes
    return () => clearInterval(interval);
  }, [user, onRetardDetected, hasNotified]);

  return (
    <div>
      {retardInfo && retardInfo.estEnRetard && ( // Vérifie si retardInfo existe et estEnRetard
        <div className={styles.retardSection}>
          <h3>Vous avez un retard aujourd'hui</h3>
          <JustificationForm
            idAbsence={retardInfo.idAbsence} // Passe l'ID de l'absence
            onSuccess={() => setRetardInfo(null)} // Réinitialise l'état après soumission
          />
        </div>
      )}
    </div>
  );
};

export default RetardNotification;

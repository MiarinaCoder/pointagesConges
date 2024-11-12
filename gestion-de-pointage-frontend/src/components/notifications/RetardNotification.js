import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { retardService } from '@/services/retardService';
import styles from './../../styles/components/RetardNotification.module.css';

export default function RetardNotification() {
  const [retardInfo, setRetardInfo] = useState(null);

  useEffect(() => {
    const checkRetard = async () => {
      try {
        const data = await retardService.checkRetard();
        console.log('Retard data:', data);
        setRetardInfo(data);
        
        if (data.estEnRetard) {
          console.log('Showing toast notification');
          toast.warning(`Vous êtes en retard de ${data.dureeRetard} minutes!`, {
            position: "top-right",
            autoClose: 5000
          });
        }
      } catch (error) {
        console.error('Erreur lors de la vérification du retard:', error);
      }
    };

    checkRetard();
  }, []);  if (!retardInfo?.estEnRetard) return null;

  return (
    <div className={styles.retardAlert}>
      <span className={styles.retardMessage}>
        Vous êtes arrivé(e) à {retardInfo.heureArrivee} (Retard de {retardInfo.dureeRetard} minutes)
      </span>
    </div>
  );
}

import React, { useState, useEffect, useCallback } from 'react';
import styles from '../../styles/components/absenceList.module.css';
import api from "@/services/api";


export default function AbsenceList({ userId }) {
  const [absences, setAbsences] = useState([]);

  const fetchAbsences = useCallback(async () => {
    try {
      const endpoint = userId 
        ? `/absence/abs/user/${userId}`
        : '/absence/abs';

      const response = await api.get(endpoint, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setAbsences(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des absences:', error);
    }
  }, [userId]);

  useEffect(() => {
    fetchAbsences();
  }, [fetchAbsences]);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        {userId ? 'Mes absences' : 'Liste des absences'}
      </h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Utilisateur</th>
            <th>Date de début</th>
            <th>Date de fin</th>
            <th>Durée</th>
          </tr>
        </thead>
        <tbody>
          {absences.map(absence => (
            <tr key={absence.idAbsence}>
              <td>{absence.nom_utilisateur} {absence.prenom_utilisateur}</td>
              <td>{new Date(absence.dateDebutAbsence).toLocaleDateString()}</td>
              <td>{absence.dateFinAbsence ? new Date(absence.dateFinAbsence).toLocaleDateString() : 'N/A'}</td>
              <td>{absence.nombre_jour_conge} jours</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

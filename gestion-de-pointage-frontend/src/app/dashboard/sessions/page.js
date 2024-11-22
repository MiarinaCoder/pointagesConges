"use client";

import React, { useContext, useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import AuthContext from "@/context/authContext";
import api from "@/services/api";
import styles from './SessionHistory.module.css';

const SessionHistory = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [sessionsPerPage] = useState(10);
  const router = useRouter();

  useEffect(() => {
    const fetchAllSessions = async () => {
      if (user?.id) {
        try {
          setLoading(true);
          const response = await api.get(`/sessions/${user.id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          setSessions(response.data.ui[0]);
        } catch (error) {
          setError("Échec du chargement de l'historique");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchAllSessions();
  }, [user]);

  const indexOfLastSession = currentPage * sessionsPerPage;
  const indexOfFirstSession = indexOfLastSession - sessionsPerPage;
  const currentSessions = sessions.slice(indexOfFirstSession, indexOfLastSession);

  const formatDuration = (start, end) => {
    if (!end) return "En cours";
    const diff = new Date(end) - new Date(start);
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
  };

  if (loading) return <div className={styles.loader}>Chargement...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.historyContainer}>
      <div className={styles.historyHeader}>
        <h2>Historique Complet des Sessions</h2>
        <button 
          className={styles.backButton}
          onClick={() => router.push('/dashboard')}
        >
          Retour
        </button>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.historyTable}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Début</th>
              <th>Fin</th>
              <th>Durée</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {currentSessions.map(session => (
              <tr key={session.idSession}>
                <td>{new Date(session.heureDebut).toLocaleDateString()}</td>
                <td>{new Date(session.heureDebut).toLocaleTimeString()}</td>
                <td>{session.heureFin ? new Date(session.heureFin).toLocaleTimeString() : '-'}</td>
                <td>{formatDuration(session.heureDebut, session.heureFin)}</td>
                <td>
                  <span className={!session.heureFin ? styles.activeStatus : styles.completedStatus}>
                    {!session.heureFin ? 'En cours' : 'Terminée'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.pagination}>
        <button 
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
        >
          ←
        </button>
        <span>{currentPage} / {Math.ceil(sessions.length / sessionsPerPage)}</span>
        <button 
          onClick={() => setCurrentPage(prev => 
            Math.min(Math.ceil(sessions.length / sessionsPerPage), prev + 1)
          )}
          disabled={currentPage === Math.ceil(sessions.length / sessionsPerPage)}
        >
          →
        </button>
      </div>
    </div>
  );
};

export default SessionHistory;

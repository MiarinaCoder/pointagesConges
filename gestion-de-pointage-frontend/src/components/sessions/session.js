import React, { useContext, useEffect, useState } from "react";
import AuthContext from "@/context/authContext";
import api from "@/services/api";
import styles from './Session.module.css';

const Session = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [sessionsPerPage, setSessionsPerPage] = useState(3);

  useEffect(() => {
    const fetchSessions = async () => {
      if (user && user.id) {
        try {
          setLoading(true);
          const response = await api.get(`/sessions/${user.id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          const sessionsData = response.data.ui[0];
          setSessions(sessionsData);
        } catch (error) {
          console.error('Error fetching sessions:', error);
          setError("Failed to fetch sessions");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchSessions();
  }, [user]);

  const indexOfLastSession = currentPage * sessionsPerPage;
  const indexOfFirstSession = indexOfLastSession - sessionsPerPage;
  const currentSessions = sessions.slice(indexOfFirstSession, indexOfLastSession);
  const totalPages = Math.ceil(sessions.length / sessionsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisibleButtons = 6;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisibleButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);

    if (endPage - startPage + 1 < maxVisibleButtons) {
      startPage = Math.max(1, endPage - maxVisibleButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => paginate(i)}
          className={`${styles.paginationButton} ${currentPage === i ? styles.activePage : ''}`}
        >
          {i}
        </button>
      );
    }

    return buttons;
  };

  if (loading) {
    return <div className={styles.loader}></div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!sessions || sessions.length === 0) {
    return <div className={styles.noData}>Aucune session trouvee , essayez plus tard.</div>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Historique de session</h2>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Heure de debut</th>
              <th>Heure fin</th>
              <th>Utilisateur</th>
            </tr>
          </thead>
          <tbody>
            {currentSessions.map((session) => (
              <tr key={session.idSession}>
                <td>{new Date(session.heureDebut).toLocaleString()}</td>
                <td>
                  {session.heureFin ? new Date(session.heureFin).toLocaleString() : 'En cours'}
                </td>
                <td>{session.id_utilisateur}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={styles.paginationContainer}>
        <button 
          onClick={() => paginate(currentPage - 1)} 
          disabled={currentPage === 1}
          className={styles.paginationButton}
        >
          Précédent
        </button>
        {renderPaginationButtons()}
        <button 
          onClick={() => paginate(currentPage + 1)} 
          disabled={currentPage === totalPages}
          className={styles.paginationButton}
        >
          Suivant
        </button>
      </div>
      <div className={styles.perPageSelector}>
        <label htmlFor="perPage">Sessions par page:</label>
        <select 
          id="perPage"
          value={sessionsPerPage} 
          onChange={(e) => setSessionsPerPage(Number(e.target.value))}
        >
          <option value="3">3</option>
          <option value="5">5</option>
          <option value="10">10</option>
        </select>
      </div>
    </div>
  );
};

export default Session;

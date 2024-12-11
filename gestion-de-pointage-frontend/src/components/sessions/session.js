// import React, { useContext, useEffect, useState } from "react";
// import AuthContext from "@/context/authContext";
// import api from "@/services/api";
// import styles from './Session.module.css';

// const Session = () => {
//   const [sessions, setSessions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { user } = useContext(AuthContext);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [sessionsPerPage, setSessionsPerPage] = useState(3);

//   useEffect(() => {
//     const fetchSessions = async () => {
//       if (user && user.id) {
//         try {
//           setLoading(true);
//           const response = await api.get(`/sessions/${user.id}`, {
//             headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//           });
//           const sessionsData = response.data.ui[0];
//           setSessions(sessionsData);
//         } catch (error) {
//           console.error('Error fetching sessions:', error);
//           setError("Failed to fetch sessions");
//         } finally {
//           setLoading(false);
//         }
//       }
//     };

//     fetchSessions();
//   }, [user]);

//   const indexOfLastSession = currentPage * sessionsPerPage;
//   const indexOfFirstSession = indexOfLastSession - sessionsPerPage;
//   const currentSessions = sessions.slice(indexOfFirstSession, indexOfLastSession);
//   const totalPages = Math.ceil(sessions.length / sessionsPerPage);

//   const paginate = (pageNumber) => setCurrentPage(pageNumber);

//   const renderPaginationButtons = () => {
//     const buttons = [];
//     const maxVisibleButtons = 6;
//     let startPage = Math.max(1, currentPage - Math.floor(maxVisibleButtons / 2));
//     let endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);

//     if (endPage - startPage + 1 < maxVisibleButtons) {
//       startPage = Math.max(1, endPage - maxVisibleButtons + 1);
//     }

//     for (let i = startPage; i <= endPage; i++) {
//       buttons.push(
//         <button
//           key={i}
//           onClick={() => paginate(i)}
//           className={`${styles.paginationButton} ${currentPage === i ? styles.activePage : ''}`}
//         >
//           {i}
//         </button>
//       );
//     }

//     return buttons;
//   };

//   if (loading) {
//     return <div className={styles.loader}></div>;
//   }

//   if (error) {
//     return <div className={styles.error}>{error}</div>;
//   }

//   if (!sessions || sessions.length === 0) {
//     return <div className={styles.noData}>Aucune session trouvee , essayez plus tard.</div>;
//   }

//   return (
//     <div className={styles.container}>
//       <h2 className={styles.title}>Historique de session</h2>
//       <div className={styles.tableContainer}>
//         <table className={styles.table}>
//           <thead>
//             <tr>
//               <th>Heure de debut</th>
//               <th>Heure fin</th>
//               <th>Utilisateur</th>
//             </tr>
//           </thead>
//           <tbody>
//             {currentSessions.map((session) => (
//               <tr key={session.idSession}>
//                 <td>{new Date(session.heureDebut).toLocaleString()}</td>
//                 <td>
//                   {session.heureFin ? new Date(session.heureFin).toLocaleString() : 'En cours'}
//                 </td>
//                 <td>{session.id_utilisateur}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//       <div className={styles.paginationContainer}>
//         <button 
//           onClick={() => paginate(currentPage - 1)} 
//           disabled={currentPage === 1}
//           className={styles.paginationButton}
//         >
//           Précédent
//         </button>
//         {renderPaginationButtons()}
//         <button 
//           onClick={() => paginate(currentPage + 1)} 
//           disabled={currentPage === totalPages}
//           className={styles.paginationButton}
//         >
//           Suivant
//         </button>
//       </div>
//       <div className={styles.perPageSelector}>
//         <label htmlFor="perPage">Sessions par page:</label>
//         <select 
//           id="perPage"
//           value={sessionsPerPage} 
//           onChange={(e) => setSessionsPerPage(Number(e.target.value))}
//         >
//           <option value="3">3</option>
//           <option value="5">5</option>
//           <option value="10">10</option>
//         </select>
//       </div>
//     </div>
//   );
// };

// export default Session;


import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthContext from "@/context/authContext";
import api from "@/services/api";
import styles from './Session.module.css';

const Session = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    const fetchRecentSessions = async () => {
      if (user?.id) {
        try {
          setLoading(true);
          const response = await api.get(`/sessions/${user.id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          setSessions(response.data.ui[0].slice(0, 3));
        } catch (error) {
          setError("Échec du chargement des sessions");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchRecentSessions();
  }, [user]);

  const handleViewHistory = () => {
    router.push('/dashboard/sessions/');
  };

  if (loading) return <div className={styles.loader}>Chargement...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.sessionContainer}>
      <div className={styles.recentSessionsSection}>
        <div className={styles.sectionHeader}>
          <h3>Sessions Récentes</h3>
          <button 
            className={styles.historyToggle}
            onClick={handleViewHistory}
          >
            Voir l&apos;historique complet
          </button>
        </div>

        <div className={styles.recentSessionsList}>
          {sessions.map(session => (
            <div key={session.idSession} className={styles.recentSessionCard}>
              <div className={styles.sessionInfo}>
                <span className={styles.sessionDate}>
                  {new Date(session.heureDebut).toLocaleDateString()}
                </span>
                <span className={`${styles.sessionStatus} ${!session.heureFin ? styles.active : ''}`}>
                  {!session.heureFin ? '🟢 Active' : '✓'}
                </span>
              </div>
              <div className={styles.sessionTime}>
                {new Date(session.heureDebut).toLocaleTimeString()} - 
                {session.heureFin ? new Date(session.heureFin).toLocaleTimeString() : 'En cours'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Session;

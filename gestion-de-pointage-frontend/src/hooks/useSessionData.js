import { useState, useEffect, useContext } from 'react';
import api from '@/services/api';
import AuthContext from '@/context/authContext';

const useSessionData = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      if (user && user.id) {
        try {
          setLoading(true);
          const response = await api.get(`/sessions/${user.id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          
          let sessionsData = response.data;
          if (sessionsData.ui && Array.isArray(sessionsData.ui)) {
            sessionsData = sessionsData.ui.flat();
          }
          
          if (!Array.isArray(sessionsData)) {
            throw new Error('Invalid data structure received from the API');
          }

          setSessions(sessionsData);
          setError(null);
        } catch (err) {
          console.error('Error fetching sessions:', err);
          setError("Failed to fetch sessions");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 30000); // Update every 30 seconds

    return () => clearInterval(intervalId);
  }, [user]);

  return { sessions, loading, error };
};

export default useSessionData;

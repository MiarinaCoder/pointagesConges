'use client';

import { useState, useEffect } from 'react';
import api from '@/services/api';
import styles from '../../styles/components/AdminPanel.module.css';

export default function PasswordResetRequests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await api.get('/auth/all-forget-password-requests');
      setRequests(response.data);
      console.log(requests);
    } catch (err) {
      console.error('Error fetching requests:', err);
    }
  };

  const handleApprove = async (requestId) => {
    try {
      await api.post(`/auth/approve-reset/${requestId}`);
      fetchRequests();
    } catch (err) {
      console.error('Error approving request:', err);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Demandes de réinitialisation de mot de passe</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Email</th>
            <th>Date de demande</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {requests.map(request => (
            <tr key={request.id}>
              <td>{request.user_email}</td>
              <td>{new Date(request.created_at).toLocaleDateString()}</td>
              <td>
                {!request.is_approved && (
                  <button 
                    onClick={() => handleApprove(request.id)}
                    className={styles.approveButton}
                  >
                    Approuver
                  </button>
                )}
                {request.is_approved && <span>Approuvé</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

'use client';

import { useState } from 'react';
import styles from '../../styles/components/LoginForm.module.css';
import api from '@/services/api';

export default function ForgotPasswordForm({ onBack }) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/request-reset', { email });
      setMessage('Demande envoyée à l\'administrateur. Vous recevrez un email de confirmation.');
      setError('');
    } catch (err) {
      setError('Erreur lors de l\'envoi de la demande');
      setMessage('');
    }
  };

  return (
    <div className={styles.loginContainer}>
      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <h2>Réinitialisation du mot de passe</h2>
        {message && <p className={styles.success}>{message}</p>}
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.inputGroup}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className={styles.loginButton}>
          Envoyer la demande
        </button>
        <button type="button" onClick={onBack} className={styles.backButton}>
          Retour à la connexion
        </button>
      </form>
    </div>
  );
}

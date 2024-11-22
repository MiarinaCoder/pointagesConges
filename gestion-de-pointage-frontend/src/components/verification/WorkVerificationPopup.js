import React, { useEffect, useState } from 'react';
import api from '@/services/api';
import styles from './WorkVerificationPopup.module.css';

export default function WorkVerificationPopup() {
  const [showPopup, setShowPopup] = useState(false);
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    const scheduleVerification = () => {
      const now = new Date();
      const hours = now.getHours();
      
      // Morning verification (random time between 9h-11h)
      if (hours >= 9 && hours < 11) {
        const randomMinutes = Math.floor(Math.random() * 120); // Random minutes within 2 hours
        setTimeout(() => {
          setShowPopup(true);
          startTimer();
        }, randomMinutes * 60 * 1000);
      }
      
      // Afternoon verification (random time between 14h-16h)
      if (hours >= 14 && hours < 16) {
        const randomMinutes = Math.floor(Math.random() * 120);
        setTimeout(() => {
          setShowPopup(true);
          startTimer();
        }, randomMinutes * 60 * 1000);
      }
    };

    // Check every hour for scheduling
    const interval = setInterval(scheduleVerification, 3600000);
    scheduleVerification(); // Initial check

    return () => clearInterval(interval);
  }, []);

  const startTimer = () => {
    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleVerify = async () => {
    try {
      await api.post('/verification', 
      {
        verified: true,
        timestamp: new Date()
      }, {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem('token')}` 
        }
      });
      setShowPopup(false);
    } catch (error) {
      console.error('Verification failed:', error);
    }
  };

  if (!showPopup) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <h2>Vérification de présence</h2>
        <p>Êtes-vous en train de travailler?</p>
        <p>Temps restant: {timer} secondes</p>
        <button onClick={handleVerify} className={styles.verifyButton}>
          Je suis présent
        </button>
      </div>
    </div>
  );
}
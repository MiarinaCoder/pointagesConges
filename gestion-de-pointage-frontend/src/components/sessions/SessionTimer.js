"use client";

import { useState, useEffect } from 'react';
import { FaClock, FaRegCalendarCheck } from 'react-icons/fa';
import styles from '../../app/dashboard/Dashboard.module.css';

const SessionTimer = () => {
  const [timeLeft, setTimeLeft] = useState(null);
  const [progress, setProgress] = useState(100);
  const startTime = new Date(localStorage.getItem('sessionStart'));

  useEffect(() => {
    if(startTime) {
      const updateTimer = () => {
        const now = new Date();
        const elapsedTime = Math.floor((now - startTime) / 1000);
        const totalSeconds = 8 * 60 * 60;
        const remainingSeconds = Math.max(totalSeconds - elapsedTime, 0);
        setTimeLeft(remainingSeconds);
        setProgress((remainingSeconds / totalSeconds) * 100);
      };

      updateTimer();
      const interval = setInterval(updateTimer, 1000);
      return () => clearInterval(interval);
    }
  }, [startTime]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return { hours, minutes, remainingSeconds };
  };

  const { hours, minutes, remainingSeconds: seconds } = formatTime(timeLeft || 0);

  return (
    <div className={styles.timerSection}>
      {startTime && timeLeft !== null && (
        <div className={styles.timerContainer}>
          <div className={styles.timerHeader}>
            <FaRegCalendarCheck className={styles.calendarIcon} />
            <div className={styles.timerInfo}>
              <h4>Session en cours</h4>
              <span>Début: {startTime.toLocaleTimeString()}</span>
            </div>
          </div>
          
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill} 
              style={{ 
                width: `${progress}%`,
                backgroundColor: progress > 70 ? '#4CAF50' : progress > 30 ? '#FFA500' : '#FF4444'
              }}
            />
          </div>

          <div className={styles.timer}>
            <div className={`${styles.timeBlock} ${timeLeft < 3600 ? styles.warning : ''}`}>
              <span>{hours.toString().padStart(2, '0')}</span>
              <small>heures</small>
            </div>
            <span className={styles.separator}>:</span>
            <div className={styles.timeBlock}>
              <span>{minutes.toString().padStart(2, '0')}</span>
              <small>minutes</small>
            </div>
            <span className={styles.separator}>:</span>
            <div className={styles.timeBlock}>
              <span>{seconds.toString().padStart(2, '0')}</span>
              <small>secondes</small>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionTimer;

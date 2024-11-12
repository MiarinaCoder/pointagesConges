"use client";

import { useState, useEffect } from 'react';
import { FaClock } from 'react-icons/fa';
import styles from '../../app/dashboard/Dashboard.module.css';

const SessionTimer = () => {
  const [timeLeft, setTimeLeft] = useState(null);
  const startTime = new Date(localStorage.getItem('sessionStart'));

  useEffect(() => {
    if(startTime) {
      const updateTimer = () => {
        const now = new Date();
        const elapsedTime = Math.floor((now - startTime) / 1000);
        const remainingSeconds = Math.max(8 * 60 * 60 - elapsedTime, 0);
        setTimeLeft(remainingSeconds);
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
        <>
          <div className={styles.timerInfo}>
            <FaClock />
            <span>Session: {startTime.toLocaleTimeString()}</span>
          </div>
          <div className={styles.timer}>
            <div className={styles.timeBlock}>
              <span>{hours}</span>
              <small>heures</small>
            </div>
            <span className={styles.separator}>:</span>
            <div className={styles.timeBlock}>
              <span>{minutes}</span>
              <small>minutes</small>
            </div>
            <span className={styles.separator}>:</span>
            <div className={styles.timeBlock}>
              <span>{seconds}</span>
              <small>secondes</small>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SessionTimer;

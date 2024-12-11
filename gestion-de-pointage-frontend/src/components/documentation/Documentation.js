import React from 'react';
import styles from '../../styles/components/Documentation.module.css';

const Documentation = () => {
  return (
    <div className={styles.documentationContainer}>
      <h1>Documentation GestionDePointage</h1>
      
      <section>
        <h2>Connexion</h2>
        <ul>
          <li>Utilisez votre email et mot de passe fournis</li>
          <li>La connexion n&apos;est possible qu&apos;entre 8h et 16h</li>
          <li>Vous devez autoriser la géolocalisation</li>
        </ul>
      </section>

      <section>
        <h2>Pointage</h2>
        <ul>
          <li>Une session démarre automatiquement à la connexion</li>
          <li>La durée maximale d&apos;une session est de 8 heures</li>
          <li>Les retards sont automatiquement détectés et notifiés</li>
        </ul>
      </section>

      <section>
        <h2>Justifications</h2>
        <ul>
          <li>Vous pouvez téléverser des justificatifs pour vos absences/retards</li>
          <li>Les formats acceptés sont PDF, JPG et PNG</li>
          <li>Chaque justificatif doit être validé par un administrateur</li>
        </ul>
      </section>
    </div>
  );
};

export default Documentation;

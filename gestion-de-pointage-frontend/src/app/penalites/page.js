"use client";

import { useContext } from 'react';
import Layout from "@/components/layout/Layout";
import PenaliteList from "@/components/dashboard/PenaliteList";
import AuthContext from '@/context/authContext';
import styles from '@/styles/components/PenaliteList.module.css';


function Penalties() {
  const { user } = useContext(AuthContext);
  
  return (
    <Layout>
      <div className={styles.penalitesContainer}>
        <div className={styles.pageHeader}>
          <h1 className={styles.title}>
            {user?.role === 'administrateur' ? 'Gestion des Pénalités' : 'Mes Pénalités'}
          </h1>
          <p className={styles.subtitle}>
            {user?.role === 'administrateur' 
              ? 'Gérez les pénalités des employés' 
              : 'Consultez vos pénalités'}
          </p>
        </div>
        <PenaliteList userId={user?.role === 'employe' ? user.id : null} />
      </div>
    </Layout>
  );
}

export default Penalties;

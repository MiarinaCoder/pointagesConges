'use client';

import Layout from '../../components/layout/Layout';
import EmployeeList from '../../components/dashboard/EmployeList';
import styles from '../../styles/components/PenaliteList.module.css';

export default function Employees() {
  return (
    <Layout>
      <div className={styles.container}>
        <h1 className={styles.title}>Gestion des Utilisateurs</h1>
        <EmployeeList />
      </div>
    </Layout>
  );
}
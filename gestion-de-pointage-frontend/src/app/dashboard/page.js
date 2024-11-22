"use client";

import React, { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaUserCircle, FaClock, FaChartPie } from "react-icons/fa";
import Session from "./../../components/sessions/session";
import PieChart from "./../../components/sessions/piechart";
import styles from "./Dashboard.module.css";
import Layout from "../../components/layout/Layout";
import AuthContext from "@/context/authContext";
import SessionTimer from '@/components/sessions/SessionTimer';
import RetardNotification from './../../components/notifications/RetardNotification';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import WorkVerificationPopup from './../../components/verification/WorkVerificationPopup';

const Dashboard = () => {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <div className={styles.dashboardWrapper}>
        <div className={styles.topHeader}>
          <div className={styles.headerContent}>
            <div className={styles.profileSection}>
              <FaUserCircle className={styles.profileIcon} />
              <div className={styles.profileDetails}>
                <h3>{user?.prenom || "Invité"}</h3>
                <p>{user?.email}</p>
              </div>
            </div>
            <SessionTimer />
            <ToastContainer />
            <RetardNotification />
          </div>
        </div>

        <div className={styles.dashboardContent}>
          <div className={styles.mainGrid}>
            <div className={styles.sessionsSection}>
              <h2><FaClock /> Sessions récentes</h2>
              <Session />
            </div>
            
            <div className={styles.chartSection}>
            {user?.role === "administrateur" && (
              <h2><FaChartPie /> Statistiques de presence des employés par jour</h2>
            )}
            {
              user?.role === "employe" && (
                <h2><FaChartPie /> Statistiques de presence </h2>
              )
            }
              <PieChart />
              <WorkVerificationPopup />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;



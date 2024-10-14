"use client";

import React, { useContext } from "react";
import { FaUserCircle, FaClock, FaChartPie } from "react-icons/fa";
import Session from "./../../components/sessions/session";
import PieChart from "./../../components/sessions/piechart";
import styles from "./Dashboard.module.css";
import Layout from "../../components/layout/Layout";
import AuthContext from "@/context/authContext";

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <Layout>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Tableau de bord</h1>
          <p className={styles.subtitle}>
            Bienvenue, {user?.prenom || "Invité"} !
          </p>
        </header>

        <div className={styles.grid}>
          <div>
            <div className={styles.card} id={styles.Profile}>
              <h2 className={styles.cardTitle}>
                <FaUserCircle
                  className={styles.icon}
                  style={{ color: "#3182ce" }}
                />
                Profil
              </h2>
              <p className={styles.profileInfo}>
                Nom: {user?.prenom || "Non disponible"}
              </p>
              <p className={styles.profileInfo}>
                Email: {user?.email || "Non disponible"}
              </p>
            </div>

            <div className={`${styles.card} ${styles.Session}`}>
              <h2 className={styles.cardTitle}>
                <FaClock className={styles.icon} style={{ color: "#38a169" }} />
                Sessions récentes
              </h2>
              <Session />
            </div>
          </div>

          <div id={styles.PieChart}>
            <h2 className={styles.cardTitle}>
              <FaChartPie
                className={styles.icon}
                style={{ color: "#805ad5" }}
              />
              Répartition des sessions
            </h2>
            <PieChart />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
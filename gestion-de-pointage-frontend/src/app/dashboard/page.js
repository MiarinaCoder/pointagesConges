// "use client";

// import React, { useContext, useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { FaUserCircle, FaClock, FaChartPie } from "react-icons/fa";
// import Session from "./../../components/sessions/session";
// import PieChart from "./../../components/sessions/piechart";
// import styles from "./Dashboard.module.css";
// import Layout from "../../components/layout/Layout";
// import AuthContext from "@/context/authContext";
// import api from "@/services/api";
// import SessionTimer from '@/components/sessions/SessionTimer';

// const Dashboard = () => {
//   const { user, loading } = useContext(AuthContext);
//   const router = useRouter();
//   const [timeLeft, setTimeLeft] = useState(null);
//   const [sessionStartTime, setSessionStartTime] = useState(null);

//   useEffect(() => {
//     if (!loading && !user) {
//       router.push("/");
//     }

//     const fetchSessionStartTime = async () => {
//       if (user) {
//         try {
//           const response = await api.get(
//             `/sessions/${user.sessionId}/heureDebut`,
//             {
//               headers: {
//                 Authorization: `Bearer ${localStorage.getItem("token")}`,
//               },
//             }
//           );

//           if (response.data && response.data.ui[0][0].heureDebut) {
//             const startTime = new Date(response.data.ui[0][0].heureDebut);
//             setSessionStartTime(startTime);

//             const now = new Date();
//             const elapsedTime = Math.floor((now - startTime) / 1000);

//             const remainingSeconds = Math.max(8 * 60 * 60 - elapsedTime, 0);

//             setTimeLeft(remainingSeconds);
//           }
//         } catch (error) {
//           console.error("Error fetching session start time:", error);
//         }
//       }
//     };

//     fetchSessionStartTime();
//   }, [user, loading, router]);

//   useEffect(() => {
//     if (timeLeft !== null) {
//       const interval = setInterval(() => {
//         setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
//       }, 1000);

//       return () => clearInterval(interval);
//     }
//   }, [timeLeft]);

//   // const hours = timeLeft ? Math.floor(timeLeft / 3600) : 0;
//   // const minutes = timeLeft ? Math.floor((timeLeft % 3600) / 60) : 0;
//   // const seconds = timeLeft ? Math.floor(timeLeft % 60) : 0;

//   const formatTime = (seconds) => {
//     const hours = Math.floor(seconds / 3600);
//     const minutes = Math.floor((seconds % 3600) / 60);
//     const remainingSeconds = seconds % 60;
//     return { hours, minutes, remainingSeconds };
//   };

//   const { hours, minutes, remainingSeconds: seconds } = formatTime(timeLeft || 0);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (!user) {
//     return null;
//   }

//     return (
//       <Layout>
//         <div className={styles.dashboardWrapper}>
//           <div className={styles.topHeader}>
//             <div className={styles.headerContent}>
//               <div className={styles.profileSection}>
//                 <FaUserCircle className={styles.profileIcon} />
//                 <div className={styles.profileDetails}>
//                   <h3>{user?.prenom || "Invité"}</h3>
//                   <p>{user?.email}</p>
//                 </div>
//               </div>

//               <div className={styles.timerSection}>
//               <SessionTimer />
//                 {sessionStartTime && timeLeft !== null && (
//                   <>
//                     <div className={styles.timerInfo}>
//                       <FaClock />
//                       <span>Session: {sessionStartTime.toLocaleTimeString()}</span>
//                     </div>
//                     <div className={styles.timer}>
//                       <div className={styles.timeBlock}>
//                         <span>{hours}</span>
//                         <small>heures</small>
//                       </div>
//                       <span className={styles.separator}>:</span>
//                       <div className={styles.timeBlock}>
//                         <span>{minutes}</span>
//                         <small>minutes</small>
//                       </div>
//                       <span className={styles.separator}>:</span>
//                       <div className={styles.timeBlock}>
//                         <span>{seconds}</span>
//                         <small>secondes</small>
//                       </div>
//                     </div>
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>

//           <div className={styles.dashboardContent}>
//             {/* <h1>Tableau de bord</h1> */}
//             {/* <p className={styles.welcome}>Bienvenue, {user?.prenom || "Invité"} !</p> */}
            
//             <div className={styles.mainGrid}>
//               <div className={styles.sessionsSection}>
//                 <h2><FaClock /> Sessions récentes</h2>
//                 <Session />
//               </div>

//               <div className={styles.chartSection}>
//                 <h2><FaChartPie /> Statistiques</h2>
//                 <PieChart />
//               </div>
//             </div>
//           </div>
//         </div>
//       </Layout>
//     );
//                 }
// export default Dashboard;


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
import RetardNotification from '@/components/notifications/RetardNotification';

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
              <h2><FaChartPie /> Statistiques</h2>
              <PieChart />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;

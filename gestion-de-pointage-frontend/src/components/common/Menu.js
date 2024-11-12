// // "use client";

// // import { useState, useEffect, useContext } from "react";
// // import Link from "next/link";
// // import { useRouter, usePathname } from "next/navigation";
// // import { FaBars, FaTimes, FaHome, FaUsers, FaCog, FaClock } from "react-icons/fa";
// // import styles from "../../styles/components/Menu.module.css";
// // import LogoutButton from "../auth/LogoutButton";
// // import AuthContext from "@/context/authContext";

// // const menuItems = [
// //   { label: "Absences", path: "/absences", icon: FaHome },
// //   { label: "Administrateur", path: "/administrateur", icon: FaUsers },
// //   { label: "Rattrapages", path: "/rattrapages", icon: FaClock },
// //   { label: "Parametres", path: "/parametres", icon: FaCog },
// //   { label: "Tableau de bord", path: "/dashboard", icon: FaHome },
// //   { label: "Penalites", path: "/penalites", icon: FaUsers },
// // ];

// // export default function Menu() {
// //   const [isExpanded, setIsExpanded] = useState(false);
// //   const router = useRouter();
// //   const pathname = usePathname();
// //   const { user, loading } = useContext(AuthContext);

// //   const toggleMenu = () => {
// //     setIsExpanded(!isExpanded);
// //     if (!isExpanded) {
// //       document.body.classList.add("menu-open");
// //     } else {
// //       document.body.classList.remove("menu-open");
// //     }
// //   };

// //   useEffect(() => {
// //     if (!loading && !user) {
// //       router.push("/");
// //     }
// //   }, [user, loading, router]);

// //   if (loading) {
// //     return <div>Loading...</div>;
// //   }

// //   if (!user) {
// //     return null;
// //   }

// //   return (
// //     <>
// //       <button
// //         className={`${styles.menuToggle} ${isExpanded ? styles.expanded : ""}`}
// //         onClick={toggleMenu}
// //         aria-label="Toggle menu"
// //       >
// //         {isExpanded ? <FaTimes /> : <FaBars />}
// //       </button>

// //       {/* Menu navigation */}
// //       <nav className={`${styles.menu} ${isExpanded ? styles.expanded : ""}`}>
// //         <div className={styles.menuContent}>
// //           <div className={styles.userInfo}>
// //             <p className={styles.userName}>{user?.prenom || "Utilisateur"}</p>
// //           </div>
// //           <ul className={styles.menuItems}>
// //             {menuItems.map((item) => (
// //               <li
// //                 key={item.path}
// //                 className={pathname === item.path ? styles.active : ""}
// //               >
// //                 <Link href={item.path} onClick={toggleMenu}>
// //                   <item.icon className={styles.icon} aria-hidden="true" />
// //                   <span>{item.label}</span>
// //                 </Link>
// //               </li>
// //             ))}
// //           </ul>
// //         </div>
// //         {/* Bouton de déconnexion toujours visible en bas */}
// //         <div className={styles.logoutContainer}>
// //           <LogoutButton />
// //         </div>
// //       </nav>

// //       {isExpanded && <div className={styles.overlay} onClick={toggleMenu} />}
// //     </>
// //   );
// // }

// "use client";

// import { useState, useEffect, useContext } from "react";
// import Link from "next/link";
// import { useRouter, usePathname } from "next/navigation";
// import { 
//   FaBars, 
//   FaTimes,
//   FaChartBar, 
//   FaCalendarTimes, 
//   FaCalendarAlt, 
//   FaSync, 
//   FaExclamationTriangle,
//   FaUserShield,
//   FaCog 
// } from "react-icons/fa";
// import styles from "../../styles/components/Menu.module.css";
// import LogoutButton from "../auth/LogoutButton";
// import AuthContext from "@/context/authContext";

// export default function Menu() {
//   const [isExpanded, setIsExpanded] = useState(false);
//   const router = useRouter();
//   const pathname = usePathname();
//   const { user, loading } = useContext(AuthContext);

//   const menuItems = user?.role === 'administrateur' ? [
//     { label: "Tableau de bord", path: "/dashboard", icon: FaChartBar },
//     { label: "Absences", path: "/absences", icon: FaCalendarTimes },
//     { label: "Congés", path: "/conge", icon: FaCalendarAlt },
//     { label: "Rattrapages", path: "/rattrapages", icon: FaSync },
//     { label: "Pénalités", path: "/penalites", icon: FaExclamationTriangle },
//     { label: "Gestion des utilisateurs", path: "/administrateur", icon: FaUserShield },
//     { label: "Paramètres", path: "/parametres", icon: FaCog },
//     { label: "justifications", path: "/justifications", icon: FaSync },
//   ] : [
//     { label: "Tableau de bord", path: "/dashboard", icon: FaChartBar },
//     { label: "Absences", path: "/absences", icon: FaCalendarTimes },
//     { label: "Congés", path: "/conge", icon: FaCalendarAlt },
//     { label: "Rattrapages", path: "/rattrapages", icon: FaSync },
//     { label: "Pénalités", path: "/penalites", icon: FaExclamationTriangle },
//     { label: "justifications", path: "/justifications", icon: FaSync }
//   ];

//   const toggleMenu = () => {
//     setIsExpanded(!isExpanded);
//   };

//   useEffect(() => {
//     if (!loading && !user) {
//       router.push("/");
//     }
//   }, [user, loading, router]);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (!user) {
//     return null;
//   }

//   return (
//     <>
//       <button
//         className={`${styles.menuToggle}`}
//         onClick={toggleMenu}
//         aria-label="Toggle menu"
//       >
//         {isExpanded ? <FaTimes /> : <FaBars />}
//       </button>
      
//         <nav className={`${styles.menu} ${isExpanded ? styles.expanded : ""}`}>
//           <div className={styles.menuContent}>
//             <div className={styles.userInfo}>
//               <p className={styles.userName}>{user?.prenom || "Utilisateur"}</p>
//             </div>
//             <ul className={styles.menuItems}>
//               {menuItems.map((item) => (
//                 <li
//                   key={item.path}
//                   className={pathname === item.path ? styles.active : ""}
//                 >
//                   <Link href={item.path} onClick={toggleMenu}>
//                     <item.icon className={styles.icon} aria-hidden="true" />
//                     <span>{item.label}</span>
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>
//           <div className={styles.logoutContainer}>
//             <LogoutButton isExpanded={isExpanded} />
//           </div>
//         </nav>
//       </>
//   );
// }


"use client";

import { useState, useEffect, useContext } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { 
  FaBars, 
  FaTimes,
  FaChartBar, 
  FaCalendarTimes, 
  FaCalendarAlt, 
  FaSync, 
  FaExclamationTriangle,
  FaUserShield,
  FaCog,
  FaFileAlt,
  // FaUserCircle
} from "react-icons/fa";
import styles from "../../styles/components/Menu.module.css";
import LogoutButton from "../auth/LogoutButton";
import AuthContext from "@/context/authContext";
import UserProfile from "./Userprofil";

export default function Menu() {
  const [isExpanded, setIsExpanded] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useContext(AuthContext);

  const menuGroups = {
    main: [
      { label: "Tableau de bord", path: "/dashboard", icon: FaChartBar },
    ],
    gestion: [
      { label: "Absences", path: "/absences", icon: FaCalendarTimes },
      { label: "Congés", path: "/conge", icon: FaCalendarAlt },
      { label: "Rattrapages", path: "/rattrapages", icon: FaSync },
      { label: "Justifications", path: "/justifications", icon: FaFileAlt },
    ],
    admin: [
      { label: "Pénalités", path: "/penalites", icon: FaExclamationTriangle },
      { label: "Gestion des utilisateurs", path: "/administrateur", icon: FaUserShield },
      { label: "Paramètres", path: "/parametres", icon: FaCog },
    ],
  };

  const toggleMenu = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsExpanded(true);
      } else {
        setIsExpanded(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading) return null;
  if (!user) return null;

  const renderMenuGroup = (items, groupTitle) => (
    <div className={styles.menuGroup} key={groupTitle || 'main'}>
      {groupTitle && <h3 className={styles.menuGroupTitle}>{groupTitle}</h3>}
      <ul className={styles.menuItems}>
        {items.map((item) => (
          <li key={item.path} className={pathname === item.path ? styles.active : ""}>
            <Link 
              href={item.path} 
              className={styles.menuLink}
              onClick={() => window.innerWidth <= 768 && toggleMenu()}
            >
              <item.icon className={styles.icon} />
              <span className={styles.menuText}>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <>
      <button
        className={styles.menuToggle}
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        {isExpanded ? <FaTimes /> : <FaBars />}
      </button>

      <nav className={`${styles.menu} ${isExpanded ? styles.expanded : ""}`}>
        <div className={styles.menuContent}>
          <UserProfile user={user} />
          {renderMenuGroup(menuGroups.main)}
          {renderMenuGroup(menuGroups.gestion, "Gestion")}
          {user?.role === 'administrateur' && renderMenuGroup(menuGroups.admin, "Administration")}
          
          <div className={styles.menuFooter}>
            <LogoutButton isExpanded={isExpanded} />
          </div>
        </div>
      </nav>

      {isExpanded && window.innerWidth <= 768 && (
        <div className={styles.overlay} onClick={toggleMenu} />
      )}
    </>
  );
}

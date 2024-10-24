// "use client";

// import { useState, useEffect, useContext } from "react";
// import Link from "next/link";
// import { useRouter, usePathname } from "next/navigation";
// import { FaBars, FaTimes, FaHome, FaUsers, FaCog, FaClock } from "react-icons/fa";
// import styles from "../../styles/components/Menu.module.css";
// import LogoutButton from "../auth/LogoutButton";
// import AuthContext from "@/context/authContext";

// const menuItems = [
//   { label: "Absences", path: "/absences", icon: FaHome },
//   { label: "Administrateur", path: "/administrateur", icon: FaUsers },
//   { label: "Rattrapages", path: "/rattrapages", icon: FaClock },
//   { label: "Parametres", path: "/parametres", icon: FaCog },
//   { label: "Tableau de bord", path: "/dashboard", icon: FaHome },
//   { label: "Penalites", path: "/penalites", icon: FaUsers },
// ];

// export default function Menu() {
//   const [isExpanded, setIsExpanded] = useState(false);
//   const router = useRouter();
//   const pathname = usePathname();
//   const { user, loading } = useContext(AuthContext);

//   const toggleMenu = () => {
//     setIsExpanded(!isExpanded);
//     if (!isExpanded) {
//       document.body.classList.add("menu-open");
//     } else {
//       document.body.classList.remove("menu-open");
//     }
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
//         className={`${styles.menuToggle} ${isExpanded ? styles.expanded : ""}`}
//         onClick={toggleMenu}
//         aria-label="Toggle menu"
//       >
//         {isExpanded ? <FaTimes /> : <FaBars />}
//       </button>

//       {/* Menu navigation */}
//       <nav className={`${styles.menu} ${isExpanded ? styles.expanded : ""}`}>
//         <div className={styles.menuContent}>
//           <div className={styles.userInfo}>
//             <p className={styles.userName}>{user?.prenom || "Utilisateur"}</p>
//           </div>
//           <ul className={styles.menuItems}>
//             {menuItems.map((item) => (
//               <li
//                 key={item.path}
//                 className={pathname === item.path ? styles.active : ""}
//               >
//                 <Link href={item.path} onClick={toggleMenu}>
//                   <item.icon className={styles.icon} aria-hidden="true" />
//                   <span>{item.label}</span>
//                 </Link>
//               </li>
//             ))}
//           </ul>
//         </div>
//         {/* Bouton de déconnexion toujours visible en bas */}
//         <div className={styles.logoutContainer}>
//           <LogoutButton />
//         </div>
//       </nav>

//       {isExpanded && <div className={styles.overlay} onClick={toggleMenu} />}
//     </>
//   );
// }

"use client";

import { useState, useEffect, useContext } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { FaBars, FaTimes, FaHome, FaUsers, FaCog, FaClock } from "react-icons/fa";
import styles from "../../styles/components/Menu.module.css";
import LogoutButton from "../auth/LogoutButton";
import AuthContext from "@/context/authContext";

const menuItems = [
  { label: "Congé", path: "/absences", icon: FaHome },
  { label: "Administrateur", path: "/administrateur", icon: FaUsers },
  { label: "Rattrapages", path: "/rattrapages", icon: FaClock },
  { label: "Parametres", path: "/parametres", icon: FaCog },
  { label: "Tableau de bord", path: "/dashboard", icon: FaHome },
  { label: "Penalites", path: "/penalites", icon: FaUsers },
];

export default function Menu() {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useContext(AuthContext);

  const toggleMenu = () => {
    setIsExpanded(!isExpanded);
  };

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
    <>
      <button
        className={`${styles.menuToggle}`}
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        {isExpanded ? <FaTimes /> : <FaBars />}
      </button>

      <nav className={`${styles.menu} ${isExpanded ? styles.expanded : ""}`}>
        <div className={styles.menuContent}>
          <div className={styles.userInfo}>
            <p className={styles.userName}>{user?.prenom || "Utilisateur"}</p>
          </div>
          <ul className={styles.menuItems}>
            {menuItems.map((item) => (
              <li
                key={item.path}
                className={pathname === item.path ? styles.active : ""}
              >
                <Link href={item.path} onClick={toggleMenu}>
                  <item.icon className={styles.icon} aria-hidden="true" />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <LogoutButton isExpanded={true} />
      </nav>
    </>
  );
}

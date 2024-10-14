// 'use client';

// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { useRouter, usePathname } from 'next/navigation';
// import { FaHome, FaUsers, FaClock, FaCog, FaBars } from 'react-icons/fa';
// import styles from '../../styles/components/Menu.module.css';
// import LogoutButton from '../auth/LogoutButton';  

// const menuItems = [
//   { label: 'Profil', path: '/profil', icon: FaHome },
//   { label: 'administrateur', path: '/administrateur', icon: FaUsers },
//   { label: 'Rattrapages', path: '/rattrapages', icon: FaClock },
//   { label: 'Parametres', path: '/parametres', icon: FaCog },
//   { label: 'Dashboard', path: '/dashboard', icon: FaHome },
//   { label: 'Penalites', path: '/penalites', icon: FaUsers },
// ];

// export default function Menu() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const router = useRouter();
//   const pathname = usePathname();

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     setIsAuthenticated(!!token);
//   }, []);

//   if (!isAuthenticated) {
//     return null;
//   }

//   return (
//     <>
//     <nav className={`${styles.menu} ${isOpen ? styles.open : ''}`}>
//       <button
//         className={styles.menuToggle}
//         onClick={() => setIsOpen(!isOpen)}
//         aria-expanded={isOpen}
//         aria-label="Toggle menu"
//       >
//         <FaBars />
//       </button>
//       <ul className={styles.menuItems}>
//         {menuItems.map((item) => (
//           <li key={item.path} className={pathname === item.path ? styles.active : ''}>
//             <Link href={item.path}>
//               <item.icon className={styles.icon} aria-hidden="true" />
//               <span>{item.label}</span>
//             </Link>
//           </li>
//         ))}
//       </ul>
//       <LogoutButton/>
//     </nav>
    
//     </>
//   );
// }

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { FaHome, FaUsers, FaClock, FaCog, FaBars, FaUser } from 'react-icons/fa';
import styles from '../../styles/components/Menu.module.css';
import LogoutButton from '../auth/LogoutButton';

const menuItems = [
  { label: 'absences', path: '/absences', icon: FaHome },
  { label: 'administrateur', path: '/administrateur', icon: FaUsers },
  { label: 'Rattrapages', path: '/rattrapages', icon: FaClock },
  { label: 'Parametres', path: '/parametres', icon: FaCog },
  { label: 'Tableau de bord', path: '/dashboard', icon: FaHome },
  { label: 'Penalites', path: '/penalites', icon: FaUsers },
];

export default function Menu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    if (token) {
      const storedUserName = localStorage.getItem('userName');
      setUserName(storedUserName || 'Utilisateur');
    }
  }, []);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className={`${styles.menu} ${isOpen ? styles.open : ''}`}>
      <button
        className={styles.menuToggle}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label="Toggle menu"
      >
        <FaBars />
      </button>
      <div className={styles.userInfo}>
        <FaUser className={styles.userIcon} />
        <p className={styles.userName}>{userName}</p>
      </div>
      <ul className={styles.menuItems}>
        {menuItems.map((item) => (
          <li key={item.path} className={pathname === item.path ? styles.active : ''}>
            <Link href={item.path}>
              <item.icon className={styles.icon} aria-hidden="true" />
              <span>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
      <LogoutButton/>
    </nav>
  );
}

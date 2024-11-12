// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import Modal from "../common/ModalConfirmation";
// import styles from "../../styles/components/LogoutButton.module.css";
// import { FaSignOutAlt } from "react-icons/fa";
// import api from "./../../services/api";

// export default function LogoutButton({ isExpanded }) {
//   const [showConfirmation, setShowConfirmation] = useState(false);
//   const router = useRouter();

//   const handleLogoutClick = () => {
//     setShowConfirmation(true);
//   };

// const handleConfirm = async () => {
//   try {
//     const id_session = localStorage.getItem("sessionId");
//     console.log(id_session);

//     const response = await api.put(`/sessions/${id_session}/terminer`, {
//       endTime: new Date().toISOString()
//     });

//     if (response.status === 200) {
//       localStorage.removeItem("token");
//       localStorage.removeItem("sessionStart");
//       localStorage.removeItem("id_session");
//       router.push("/");
//     } else {
//       console.error("Failed to end session");
//     }
//   } catch (error) {
//     console.error("Error ending session:", error);
//   }
// };

//   const handleCancel = () => {
//     setShowConfirmation(false);
//   };

//   return (
//     <>
//       <button onClick={handleLogoutClick} className={`${styles.logoutButton} ${isExpanded ? styles.expanded : styles.collapsed}`}>
//         <FaSignOutAlt className={styles.icon} />
//         {isExpanded && <span>Déconnexion</span>}
//       </button>
//       <Modal
//         isOpen={showConfirmation}
//         onClose={handleCancel}
//         title="Confirmation de déconnexion"
//         onConfirm={handleConfirm}
//         confirmText="Déconnexion"
//         confirmButtonColor="#e74c3c"
//       >
//         <p>Êtes-vous sûr de vouloir vous déconnecter ?</p>
//       </Modal>
//     </>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Modal from "../common/ModalConfirmation";
import styles from "../../styles/components/LogoutButton.module.css";
import { FaSignOutAlt } from "react-icons/fa";
import api from "../../services/api";

export default function LogoutButton({ isExpanded }) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Réinitialiser l'état lors du changement de route
  useEffect(() => {
    const shouldShowText = isExpanded || windowWidth <= 768;
    if (shouldShowText) {
      document.documentElement.style.setProperty('--logout-text-display', 'inline-block');
    }
  }, [pathname, isExpanded, windowWidth]);

  const handleLogoutClick = () => {
    setShowConfirmation(true);
  };

  const handleConfirm = async () => {
    try {
      const id_session = localStorage.getItem("sessionId");
      const response = await api.put(`/sessions/${id_session}/terminer`, {
        endTime: new Date().toISOString(),
      });

      if (response.status === 200) {
        localStorage.removeItem("token");
        localStorage.removeItem("sessionStart");
        localStorage.removeItem("sessionId");
        router.push("/");
      }
    } catch (error) {
      console.error("Error ending session:", error);
    }
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  return (
    <>
      <button
        onClick={handleLogoutClick}
        className={`${styles.logoutButton} ${isExpanded ? styles.expanded : styles.collapsed}`}
        data-expanded={isExpanded}
      >
        <FaSignOutAlt className={styles.icon} />
        <span className={styles.logoutText}>Déconnexion</span>
      </button>

      <Modal
        isOpen={showConfirmation}
        onClose={handleCancel}
        title="Confirmation de déconnexion"
        onConfirm={handleConfirm}
        confirmText="Déconnexion"
        confirmButtonColor="#e74c3c"
      >
        <div className={styles.modalBody}>
          <p>Êtes-vous sûr de vouloir vous déconnecter ?</p>
        </div>
      </Modal>
    </>
  );
}

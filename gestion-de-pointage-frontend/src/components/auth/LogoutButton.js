"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "../common/ModalConfirmation";
import styles from "../../styles/components/LogoutButton.module.css";
import { FaSignOutAlt } from "react-icons/fa";
import api from "./../../services/api";

export default function LogoutButton() {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const router = useRouter();

  const handleLogoutClick = () => {
    setShowConfirmation(true);
  };

const handleConfirm = async () => {
  try {
    const id_session = localStorage.getItem("sessionId");
    console.log(id_session);

    const response = await api.put(`/sessions/${id_session}/terminer`, {
      endTime: new Date().toISOString()
    });

    if (response.status === 200) {
      localStorage.removeItem("token");
      localStorage.removeItem("sessionStart");
      localStorage.removeItem("id_session");
      router.push("/");
    } else {
      console.error("Failed to end session");
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
      <button onClick={handleLogoutClick} className={styles.logoutButton}>
        <FaSignOutAlt className={styles.icon} />
        Déconnexion
      </button>
      <Modal
        isOpen={showConfirmation}
        onClose={handleCancel}
        title="Confirmation de déconnexion"
        onConfirm={handleConfirm}
        confirmText="Déconnexion"
      >
        <p>Êtes-vous sûr de vouloir vous déconnecter ?</p>
      </Modal>
    </>
  );
}

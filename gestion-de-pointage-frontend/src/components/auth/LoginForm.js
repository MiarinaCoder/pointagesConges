
"use client";

import { useContext, useState} from "react";
import { useRouter } from "next/navigation";
import AuthContext from "../../context/authContext";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import styles from "../../styles/components/LoginForm.module.css";
import ForgotPasswordForm from "./ForgotPasswordForm";
import { toast } from "react-toastify";

export default function LoginForm() {
  const { login } = useContext(AuthContext);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError('');

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 200000,
          maximumAge: 0
        });
      });

      await login(email, password, {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });

      router.push("/dashboard");
      
    } catch (err) {
      let errorMessage = '';
    
      console.log(err.response?.data);
    if (err.response?.data?.code === 'ACTIVE_SESSION' || err.message?.includes('session active existe')) {
      errorMessage = "Une session active existe déjà pour cet utilisateur";
    } else if (err.response?.data?.code === 'HOURS_RESTRICTION' || err.message?.includes('entre 8h et 16h')) {
      errorMessage = "Les sessions ne peuvent être créées qu'entre 8h et 16h";
    } else {
      switch (err.response?.status) {
        case 401:
          errorMessage = "Email ou mot de passe incorrect";
          break;
        case 403:
          errorMessage = "Votre compte est désactivé. Veuillez contacter l'administrateur";
          break;
        case 404:
          errorMessage = "Compte utilisateur introuvable";
          break;
        case 429:
          errorMessage = "Trop de tentatives de connexion, veuillez patienter quelques minutes";
          break;
        case 'POSITION_ERROR':
          errorMessage = "Impossible d'obtenir votre position. Veuillez activer la géolocalisation";
          break;
        default:
          errorMessage = "Impossible de se connecter. Vérifiez votre connexion internet et réessayez";
      }
    }

    setError(errorMessage);
    toast.error(errorMessage, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true
    });
    } finally {
      setIsSubmitting(false);
    }
};



  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (showForgotPassword) {
    return <ForgotPasswordForm onBack={() => setShowForgotPassword(false)} />;
  }

  return (
    <div className={styles.loginContainer}>
      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <h2>Connexion</h2>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.inputGroup}>
          <FaUser className={styles.icon} />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <FaLock className={styles.icon} />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className={styles.passwordToggle}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        <button
          className={`${styles.loginButton} ${
            isSubmitting ? styles.loading : ""
          }`}
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? "" : "Se connecter"}
        </button>
        <div className={styles.additionalOptions}>
          <button
            type="button"
            className={styles.forgotPassword}
            onClick={() => setShowForgotPassword(true)}
          >
            Mot de passe oublié ?
          </button>
        </div>
      </form>
    </div>
  );
}
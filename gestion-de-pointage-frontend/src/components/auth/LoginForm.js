
"use client";

import { useContext, useState} from "react";
import { useRouter } from "next/navigation";
import AuthContext from "../../context/authContext";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import styles from "../../styles/components/LoginForm.module.css";
import ForgotPasswordForm from "./ForgotPasswordForm";
import { toast } from "react-toastify";
import Image from "next/image";
import Img from './depannpc_logo.jpg';

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
        await login(email, password);
        router.push("/dashboard");
      
      } catch (err) {
        let errorMessage = '';
      
        if (err.response?.data?.code === 'ACTIVE_SESSION') {
          errorMessage = "Une session active existe déjà pour cet utilisateur";
        } else if (err.response?.data?.code === 'HOURS_RESTRICTION') {
          errorMessage = "Les sessions ne peuvent être créées qu'entre 8h et 16h";
        } else {
          switch (err.response?.status) {
            case 401:
              errorMessage = "Email ou mot de passe incorrect";
              break;
            case 403:
              errorMessage = "Votre compte est désactivé";
              break;
            case 404:
              errorMessage = "Compte utilisateur introuvable";
              break;
            case 429:
              errorMessage = "Trop de tentatives de connexion";
              break;
            default:
              errorMessage = "Impossible de se connecter. Réessayez";
          }
        }
        setError(errorMessage);
        toast.error(errorMessage);
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
        <center><Image src={Img} width={150} height={75}></Image></center>
        <br></br>
        <center><h2>Connexion</h2></center>
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
        {/* <div className={styles.additionalOptions}>
          <button
            type="button"
            className={styles.forgotPassword}
            onClick={() => setShowForgotPassword(true)}
          >
            Mot de passe oublié ?
          </button>
        </div> */}
      </form>
    </div>
  );
}
// // 'use client';

// // import { useState } from 'react';
// // import { useRouter } from 'next/navigation';
// // import { FaUser, FaLock,FaGoogle } from 'react-icons/fa';
// // import styles from '../../styles/components/LoginForm.module.css';

// // export default function LoginForm() {
// //   const [email, setEmail] = useState('');
// //   const [password, setPassword] = useState('');
// //   const [error, setError] = useState('');
// //   const router = useRouter();

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setError('');

// //     if (!email || !password) {
// //       setError('Veuillez remplir tous les champs');
// //       return;
// //     }

// //     try {
// //       const response = await fetch('http://192.168.88.85:5000/api/auth/login', {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify({ email, password }),
// //       });

// //       if (response.ok) {
// //         const data = await response.json();
// //         // La connexion a réussi, on enregistre l'heure de démarrage de session
// //         const sessionStart = new Date();
// //         localStorage.setItem('sessionStart', sessionStart.toISOString());
// //         // Store the sessionId
// //         localStorage.setItem('sessionId', data.sessionId.toString());
// //         localStorage.setItem('token', data.token);
// //         router.push('/dashboard');
// //       } else {
// //         // Gérer l'erreur si la connexion échoue
// //         alert(data.message);
// //       }
// //       // } else {
// //       //   setError('Email ou mot de passe incorrect');
// //       // }
// //     } catch (err) {
// //       setError('Une erreur est survenue. Veuillez réessayer.');
// //     }
// //   };

// //   const handleForgotPassword = () => {
// //     // Implémentez la logique pour le mot de passe oublié
// //     console.log("Fonctionnalité de mot de passe oublié à implémenter");
// //   };

// //   const handleGoogleSignIn = () => {
// //     // Implémentez la logique pour la connexion avec Google
// //     console.log("Fonctionnalité de connexion avec Google à implémenter");
// //   };

// //   return (
// //     <div className={styles.loginContainer}>
// //       <form onSubmit={handleSubmit} className={styles.loginForm}>
// //         <h2>Connexion</h2>
// //         {error && <p className={styles.error}>{error}</p>}
// //         <div className={styles.inputGroup}>
// //           <FaUser className={styles.icon} />
// //           <input
// //             type="email"
// //             placeholder="Email"
// //             value={email}
// //             onChange={(e) => setEmail(e.target.value)}
// //             required
// //           />
// //         </div>
// //         <div className={styles.inputGroup}>
// //           <FaLock className={styles.icon} />
// //           <input
// //             type="password"
// //             placeholder="Mot de passe"
// //             value={password}
// //             onChange={(e) => setPassword(e.target.value)}
// //             required
// //           />
// //         </div>
// //         <button type="submit" className={styles.loginButton}>
// //           Se connecter
// //         </button>
// //         <div className={styles.additionalOptions}>
// //           <button type="button" onClick={handleForgotPassword} className={styles.forgotPassword}>
// //             Mot de passe oublié ?
// //           </button>
// //           {/* <button type="button" onClick={handleGoogleSignIn} className={styles.googleSignIn}>
// //             <FaGoogle /> Se connecter avec Google
// //           </button> */}
// //         </div>
// //       </form>
// //     </div>
// //   );
// // }

// // components/LoginForm.js
// 'use client';

// import { useContext, useState } from 'react';
// import AuthContext from '../../context/authContext';
// import { FaUser, FaLock } from 'react-icons/fa';
// import styles from '../../styles/components/LoginForm.module.css';

// export default function LoginForm() {
//   const { login } = useContext(AuthContext);
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await login(email, password);
//     } catch (err) {
//       setError('Échec de la connexion');
//       console.error(err);
//     }
//   };

//   return (
//     <div className={styles.loginContainer}>
//       <form onSubmit={handleSubmit} className={styles.loginForm}>
//         <h2>Connexion</h2>
//         {error && <p className={styles.error}>{error}</p>}
//         <div className={styles.inputGroup}>
//           <FaUser className={styles.icon} />
//           <input
//             type="email"
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//         </div>
//         <div className={styles.inputGroup}>
//           <FaLock className={styles.icon} />
//           <input
//             type="password"
//             placeholder="Mot de passe"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         </div>
//         <button type="submit" className={styles.loginButton}>
//           Se connecter
//         </button>
//       </form>
//     </div>
//   );
// }, useEffect
"use client";

import { useContext, useState} from "react";
import { useRouter } from "next/navigation";
import AuthContext from "../../context/authContext";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import styles from "../../styles/components/LoginForm.module.css";
import ForgotPasswordForm from "./ForgotPasswordForm";

export default function LoginForm() {
  const { login } = useContext(AuthContext);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [location, setLocation] = useState(null);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // useEffect(() => {
  //   // Récupérer la localisation de l'utilisateur
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         const { latitude, longitude } = position.coords;
  //         setLocation({ latitude, longitude });
  //       },
  //       (error) => {
  //         console.error("Erreur de localisation :", error);
  //       }
  //     );
  //   }
  // }, []);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (isSubmitting || !location) return;
  //   setIsSubmitting(true);
  //   try {
  //     await login(email, password,location);
  //     router.push("/dashboard");
  //   } catch (err) {
  //     setError("Échec de la connexion");
  //     console.error(err);
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (isSubmitting) return;
  //   setIsSubmitting(true);
  //   setError('');

  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       async (position) => {
  //         try {
  //           const latitude = position.coords.latitude;
  //           const longitude = position.coords.longitude;

  //           // Logs des données avant l'appel
  //           console.log('Tentative de connexion avec:', {
  //             email,
  //             passwordLength: password.length,
  //             coordinates: { latitude, longitude }
  //           });

  //           const loginResponse = await login(email, password, {latitude, longitude});
  //           console.log('Réponse du serveur:', loginResponse);

  //           // router.push("/dashboard");

  //           // Check for successful login response
  //           if (loginResponse && loginResponse.token) {
  //             console.log('Login successful, redirecting...');
  //             router.push("/dashboard");
  //           } else {
  //             setError('Données de connexion invalides');
  //           }
  //         } catch (err) {
  //           // Log détaillé de l'erreur
  //           console.error('Détails de l\'erreur:', {
  //             message: err.message,
  //             status: err.response?.status,
  //             data: err.response?.data
  //           });

  //           setError(err.message || "Échec de la connexion");
  //         } finally {
  //           setIsSubmitting(false);
  //         }
  //       },
  //       (geoError) => {
  //         console.error("Erreur détaillée de géolocalisation:", {
  //           code: geoError.code,
  //           message: geoError.message
  //         });
  //         setError("Veuillez activer la géolocalisation pour vous connecter");
  //         setIsSubmitting(false);
  //       },
  //       // (error) => {
  //       //   console.error("Erreur de géolocalisation:", error);
  //       //   setError("Veuillez activer la géolocalisation pour vous connecter");
  //       //   setIsSubmitting(false);
  //       // },
  //       {
  //         enableHighAccuracy: true,
  //         timeout: 10000,
  //         maximumAge: 0
  //       }
  //     );
  //   } else {
  //     setError("Votre navigateur ne supporte pas la géolocalisation");
  //     setIsSubmitting(false);
  //   }
  // };

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

      const loginResult = await login(email, password, {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });

      console.log('Login result:', loginResult);
      router.push("/dashboard");
      
    } catch (err) {
      console.log('Submit error:', err);
      setError(err.message || 'Erreur de connexion');
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
        {/* <img src="/logo.png" alt="Logo" className={styles.logo} /> */}
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
        {/* <button type="submit" className={styles.loginButton}>
          Se connecter
        </button> */}
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

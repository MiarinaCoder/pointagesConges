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
// }

'use client';

import { useContext, useState } from 'react';
import AuthContext from '../../context/authContext';
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import styles from '../../styles/components/LoginForm.module.css';

export default function LoginForm() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (err) {
      setError('Échec de la connexion');
      console.error(err);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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
        <div className={styles.rememberMe}>
          <input
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <label htmlFor="rememberMe">Se souvenir de moi</label>
        </div>
        <button type="submit" className={styles.loginButton}>
          Se connecter
        </button>
        <div className={styles.additionalOptions}>
          <button type="button" className={styles.forgotPassword}>
            Mot de passe oublié ?
          </button>
        </div>
      </form>
    </div>
  );
}

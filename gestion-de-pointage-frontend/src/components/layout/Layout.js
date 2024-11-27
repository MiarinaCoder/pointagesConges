// // // "use client";

// // // import React from 'react';
// // // import Menu from '../common/Menu';
// // // import styles from '../../styles/components/Layout.module.css';
// // // import { ToastContainer } from 'react-toastify';
// // // import 'react-toastify/dist/ReactToastify.css';

// // // const Layout = ({ children }) => {
// // //   return (
// // //     <>
// // //       <ToastContainer />
// // //       <div className={styles.layout}>
// // //         <Menu />
// // //         <main className={styles.content}>
// // //           {children}
// // //         </main>
// // //       </div>
// // //     </>
// // //   );
// // // };

// // // export default Layout;

// // // "use client";

// // // import React, { useEffect, useContext } from 'react';
// // // import Menu from '../common/Menu';
// // // import styles from '../../styles/components/Layout.module.css';
// // // import { ToastContainer } from 'react-toastify';
// // // import AuthContext from '../../context/authContext';
// // // import 'react-toastify/dist/ReactToastify.css';

// // // const Layout = ({ children }) => {
// // //   const { user } = useContext(AuthContext);

// // //   // useEffect(() => {
// // //   //   if (user?.id) {
// // //   //     const handleBeforeUnload = async (event) => {
// // //   //       try {
// // //   //         await fetch('/api/sessions/cleanup', {
// // //   //           method: 'POST',
// // //   //           headers: {
// // //   //             'Content-Type': 'application/json',
// // //   //             'Authorization': `Bearer ${localStorage.getItem('token')}`
// // //   //           },
// // //   //           body: JSON.stringify({
// // //   //             id_utilisateur: user.id
// // //   //           })
// // //   //         });
// // //   //       } catch (error) {
// // //   //         console.error('Error cleaning up session:', error);
// // //   //       }
// // //   //     };

// // //   //     window.addEventListener('beforeunload', handleBeforeUnload);

// // //   //     return () => {
// // //   //       window.removeEventListener('beforeunload', handleBeforeUnload);
// // //   //     };
// // //   //   }
// // //   // }, [user]);

// // //   useEffect(() => {
// // //     if (user?.id) {
// // //       const handleBeforeUnload = async (event) => {
// // //         event.preventDefault();
// // //         const confirmationMessage = "Are you sure you want to leave? Your session will be ended.";
        
// // //         try {
// // //           await fetch('/api/sessions/cleanup', {
// // //             method: 'POST',
// // //             headers: {
// // //               'Content-Type': 'application/json',
// // //               'Authorization': `Bearer ${localStorage.getItem('token')}`
// // //             },
// // //             body: JSON.stringify({ idSession: user?.sessionId })
// // //           });
// // //         } catch (error) {
// // //           console.error('Error cleaning up session:', error);
// // //         }
        
// // //         event.returnValue = confirmationMessage; // Display confirmation before closing tab
// // //       };
  
// // //       window.addEventListener('beforeunload', handleBeforeUnload);
  
// // //       return () => {
// // //         window.removeEventListener('beforeunload', handleBeforeUnload);
// // //       };
// // //     }
// // //   }, [user]);
  

// // //   return (
// // //     <>
// // //       <ToastContainer />
// // //       <div className={styles.layout}>
// // //         <Menu />
// // //         <main className={styles.content}>
// // //           {children}
// // //         </main>
// // //       </div>
// // //     </>
// // //   );
// // // };

// // // export default Layout;

// // // "use client";

// // // import React, { useEffect, useContext } from 'react';
// // // import Menu from '../common/Menu';
// // // import styles from '../../styles/components/Layout.module.css';
// // // import { ToastContainer } from 'react-toastify';
// // // import AuthContext from '../../context/authContext';
// // // import 'react-toastify/dist/ReactToastify.css';

// // // const Layout = ({ children }) => {
// // //   const { user } = useContext(AuthContext);

// // //   useEffect(() => {
// // //     if (user?.id) {
// // //       const cleanupSession = async () => {
// // //         try {
// // //           await fetch('/api/sessions/cleanup', {
// // //             method: 'POST',
// // //             headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
// // //             body: JSON.stringify({ idSession: user?.sessionId })
// // //           });
// // //         } catch (error) {
// // //           console.error('Error cleaning up session:', error);
// // //         }
// // //       };

// // //       const handleBeforeUnload = (event) => {
// // //         event.preventDefault();
// // //         const message = "Voulez-vous vraiment quitter ? Votre session de travail sera terminée.";
// // //         event.returnValue = message;
        
// // //         if (confirm(message)) {
// // //           cleanupSession();
// // //         }
// // //         return message;
// // //       };

// // //       window.addEventListener('beforeunload', handleBeforeUnload);

// // //       return () => {
// // //         window.removeEventListener('beforeunload', handleBeforeUnload);
// // //       };
// // //     }
// // //   }, [user]);

// // //   return (
// // //     <>
// // //       <ToastContainer />
// // //       <div className={styles.layout}>
// // //         <Menu />
// // //         <main className={styles.content}>
// // //           {children}
// // //         </main>
// // //       </div>
// // //     </>
// // //   );
// // // };

// // // export default Layout;


// // "use client";

// // import React, { useEffect, useContext } from 'react';
// // import Menu from '../common/Menu';
// // import styles from '../../styles/components/Layout.module.css';
// // import { ToastContainer } from 'react-toastify';
// // import AuthContext from '../../context/authContext';
// // import 'react-toastify/dist/ReactToastify.css';

// // const Layout = ({ children }) => {
// //   const { user, logout } = useContext(AuthContext);

// //   useEffect(() => {
// //     if (user?.id && user?.sessionId) {
// //       const handleUnload = () => {
// //         fetch('http://localhost:5000/api/sessions/cleanup', {
// //           method: 'POST',
// //           keepalive: true,
// //           headers: {
// //             'Content-Type': 'application/json',
// //             'Authorization': `Bearer ${localStorage.getItem('token')}`
// //           },
// //           body: JSON.stringify({ sessionId: user.sessionId })
// //         });

// //         localStorage.removeItem('token');
// //         logout();
// //       };

// //       const handleBeforeUnload = (event) => {
// //         event.preventDefault();
// //         const message = "Voulez-vous vraiment quitter ? Votre session de travail sera terminée.";
// //         event.returnValue = message;
// //         return message;
// //       };

// //       window.addEventListener('beforeunload', handleBeforeUnload);
// //       window.addEventListener('unload', handleUnload);

// //       return () => {
// //         window.removeEventListener('beforeunload', handleBeforeUnload);
// //         window.removeEventListener('unload', handleUnload);
// //       };
// //     }
// //   }, [user, logout]);

// //   return (
// //     <>
// //       <ToastContainer />
// //       <div className={styles.layout}>
// //         <Menu />
// //         <main className={styles.content}>{children}</main>
// //       </div>
// //     </>
// //   );
// // };

// // export default Layout;

// "use client";

// import React, { useEffect, useContext } from 'react';
// import Menu from '../common/Menu';
// import styles from '../../styles/components/Layout.module.css';
// import { ToastContainer } from 'react-toastify';
// import AuthContext from '../../context/authContext';
// import 'react-toastify/dist/ReactToastify.css';

// const Layout = ({ children }) => {
//   const { user, logout } = useContext(AuthContext);

//   useEffect(() => {
//     if (user?.id && user?.sessionId) {
//       let pageAccessedByReload = (
//         (window.performance.navigation && window.performance.navigation.type === 1) ||
//         window.performance.getEntriesByType('navigation').map((nav) => nav.type).includes('reload')
//       );

//       const handleBeforeUnload = (event) => {
//         if (!pageAccessedByReload) {
//           event.preventDefault();
//           const message = "Voulez-vous vraiment quitter ? Votre session de travail sera terminée.";
//           event.returnValue = message;

//           fetch('http://localhost:5000/api/sessions/cleanup', {
//             method: 'POST',
//             keepalive: true,
//             headers: {
//               'Content-Type': 'application/json',
//               'Authorization': `Bearer ${localStorage.getItem('token')}`
//             },
//             body: JSON.stringify({ sessionId: user.sessionId })
//           });

//           localStorage.removeItem('token');
//           logout();

//           return message;
//         }
//       };

//       window.addEventListener('beforeunload', handleBeforeUnload);
//       return () => window.removeEventListener('beforeunload', handleBeforeUnload);
//     }
//   }, [user, logout]);

//   return (
//     <>
//       <ToastContainer />
//       <div className={styles.layout}>
//         <Menu />
//         <main className={styles.content}>{children}</main>
//       </div>
//     </>
//   );
// };

// export default Layout;


"use client";

import React, { useEffect, useContext } from 'react';
import Menu from '../common/Menu';
import styles from '../../styles/components/Layout.module.css';
import { ToastContainer } from 'react-toastify';
import AuthContext from '../../context/authContext';
import 'react-toastify/dist/ReactToastify.css';

const Layout = ({ children }) => {
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    if (user?.id && user?.sessionId) {
      const handleBeforeUnload = (event) => {
        // Check if it's a page refresh
        const navEntry = performance.getEntriesByType('navigation')[0];
        if (navEntry && navEntry.type === 'reload') {
          return;
        }

        event.preventDefault();
        const message = "Voulez-vous vraiment quitter ? Votre session de travail sera terminée.";
        event.returnValue = message;

        // Only execute cleanup if user confirms
        if (window.confirm(message)) {
          fetch('http://localhost:5000/api/sessions/cleanup', {
            method: 'POST',
            keepalive: true,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ sessionId: user.sessionId })
          });

          localStorage.removeItem('token');
          logout();
        }

        return message;
      };

      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }
  }, [user, logout]);

  return (
    <>
      <ToastContainer />
      <div className={styles.layout}>
        <Menu />
        <main className={styles.content}>{children}</main>
      </div>
    </>
  );
};

export default Layout;

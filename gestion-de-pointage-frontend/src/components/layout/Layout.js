// "use client";

// import React from 'react';
// import Menu from '../common/Menu';
// import styles from '../../styles/components/Layout.module.css';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const Layout = ({ children }) => {
//   return (
//     <>
//       <ToastContainer />
//       <div className={styles.layout}>
//         <Menu />
//         <main className={styles.content}>
//           {children}
//         </main>
//       </div>
//     </>
//   );
// };

// export default Layout;

// "use client";

// import React, { useEffect, useContext } from 'react';
// import Menu from '../common/Menu';
// import styles from '../../styles/components/Layout.module.css';
// import { ToastContainer } from 'react-toastify';
// import AuthContext from '../../context/authContext';
// import 'react-toastify/dist/ReactToastify.css';

// const Layout = ({ children }) => {
//   const { user } = useContext(AuthContext);

//   // useEffect(() => {
//   //   if (user?.id) {
//   //     const handleBeforeUnload = async (event) => {
//   //       try {
//   //         await fetch('/api/sessions/cleanup', {
//   //           method: 'POST',
//   //           headers: {
//   //             'Content-Type': 'application/json',
//   //             'Authorization': `Bearer ${localStorage.getItem('token')}`
//   //           },
//   //           body: JSON.stringify({
//   //             id_utilisateur: user.id
//   //           })
//   //         });
//   //       } catch (error) {
//   //         console.error('Error cleaning up session:', error);
//   //       }
//   //     };

//   //     window.addEventListener('beforeunload', handleBeforeUnload);

//   //     return () => {
//   //       window.removeEventListener('beforeunload', handleBeforeUnload);
//   //     };
//   //   }
//   // }, [user]);

//   useEffect(() => {
//     if (user?.id) {
//       const handleBeforeUnload = async (event) => {
//         event.preventDefault();
//         const confirmationMessage = "Are you sure you want to leave? Your session will be ended.";
        
//         try {
//           await fetch('/api/sessions/cleanup', {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//               'Authorization': `Bearer ${localStorage.getItem('token')}`
//             },
//             body: JSON.stringify({ idSession: user?.sessionId })
//           });
//         } catch (error) {
//           console.error('Error cleaning up session:', error);
//         }
        
//         event.returnValue = confirmationMessage; // Display confirmation before closing tab
//       };
  
//       window.addEventListener('beforeunload', handleBeforeUnload);
  
//       return () => {
//         window.removeEventListener('beforeunload', handleBeforeUnload);
//       };
//     }
//   }, [user]);
  

//   return (
//     <>
//       <ToastContainer />
//       <div className={styles.layout}>
//         <Menu />
//         <main className={styles.content}>
//           {children}
//         </main>
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
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user?.id) {
      const handleBeforeUnload = async (event) => {
        // Optionally display a message (this may not show in all browsers)
        // const confirmationMessage = "Are you sure you want to leave? Your session will be ended.";
        
        // Make the API call to cleanup the session
        try {
          await fetch('/api/sessions/cleanup', {
            method: 'POST',
            // headers: {
            //   // 'Content-Type': 'application/json',
            //   'Authorization': `Bearer ${localStorage.getItem('token')}`
            // }
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            body: JSON.stringify({ idSession: user?.sessionId })
          });
        } catch (error) {
          console.error('Error cleaning up session:', error);
        }

        // Set the returnValue property for browsers that still support it
        // event.returnValue = confirmationMessage;
      };

      window.addEventListener('beforeunload', handleBeforeUnload);

      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, [user]);

  return (
    <>
      <ToastContainer />
      <div className={styles.layout}>
        <Menu />
        <main className={styles.content}>
          {children}
        </main>
      </div>
    </>
  );
};

export default Layout;


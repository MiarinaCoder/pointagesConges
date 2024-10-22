// 'use client';

// import { useRouter } from 'next/navigation';
// import { useEffect, useState } from 'react';

// const withAuth = (WrappedComponent) => {
//   return function WithAuth(props) {
//     const [isClient, setIsClient] = useState(false);
//     const router = useRouter();

//     useEffect(() => {
//       setIsClient(true);
//       const token = localStorage.getItem('token');
//       if (!token) {
//         router.push('/login');
//       }
//     }, [router]);

//     if (!isClient) return null;

//     return <WrappedComponent {...props} />;
//   };
// };

// export default withAuth;

// components/ProtectedPage.js
import { useContext } from 'react';
import AuthContext from '../contexts/authContext';
import withAuth from '../middlewares/withAuth';

function ProtectedPage() {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <h1>Page protégée</h1>
      <p>Bienvenue, utilisateur ID : {user?.userId}</p>
    </div>
  );
}

export default withAuth(ProtectedPage);

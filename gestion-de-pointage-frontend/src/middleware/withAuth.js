import { useEffect,useContext } from 'react';
import { useRouter } from 'next/navigation';
import AuthContext from '../context/authContext';

export default function withAuth(Component) {
  return function ProtectedRoute(props) {
    const {user,loading}=useContext(AuthContext);
    const router = useRouter()
    const isAuthenticated = !!user && Object.keys(user).length > 0;// Votre logique pour vérifier si l'utilisateur est connecté

    useEffect(() => {
        if (!loading && !isAuthenticated) {
          router.replace('/');
        }
      }, [loading, isAuthenticated, router]);
  
      if (loading) {
        return <div>Loading...</div>; // Remplacez ceci par votre propre composant de chargement
      }
  
      if (!isAuthenticated) {
        return null;
      }

    return <Component {...props} />
  }
}
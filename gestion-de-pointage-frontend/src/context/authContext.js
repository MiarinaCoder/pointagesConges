// contexts/authContext.js
'use client';

import { createContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../services/api';
import jwt_decode from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [isAuthenticated,setIsAuthenticated]=useState(false);

  // Vérifier le token existant lors du chargement initial
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      try {
        const decoded = jwt_decode(token);
        setUser({ 
          token, 
          id: decoded.userId,
          sessionId: decoded.sessionId, 
          sessionStart: decoded.sessionStart,
          nom: decoded.nom,
          prenom: decoded.prenom,
          email: decoded.email,
          genre: decoded.genre,
          role: decoded.role,
          fonction: decoded.fonction,
        });
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Invalid token', err);
        localStorage.removeItem('token');
        localStorage.removeItem('sessionId');
        setIsAuthenticated(false);
      }
    }
    setLoading(false);
  }, []);

  // Fonction de login
  // const login = async (email, password, location) => {
  //   try {
  //     // Add request logging
  //     console.log('Login request:', { email, location });
      
  //     const response = await api.post('/auth/login', { email, password, latitude:location.latitude, longitude:location.longitude
        
  //     },{
  //         // Add proper headers
  //         headers: {
  //           'Content-Type': 'application/json'
  //         }
  //     });
      
  //     // if (!response.data.success) {
  //     //   throw new Error(response.data.message);
  //     // }
  //   // Add response logging
  //   console.log('Server response:', response);

  //   if (response.data && response.data.token) {
  //     const { token, sessionId } = response.data;

  //     localStorage.setItem('token', token);
  //     localStorage.setItem('sessionId', sessionId);
      
  //     const decoded = jwt_decode(token);
  //     setUser({ 
  //       token, 
  //       id: decoded.userId,
  //       sessionId: sessionId,
  //       prenom: decoded.prenom,
  //       email: decoded.email,
  //       genre: decoded.genre,
  //       role: decoded.role
  //     });
  //     return { success: true, message };
  //   } else {
  //     throw new Error('Invalid response format');
  //   }
  // } catch (error) {
  //   // Enhanced error handling
  //   const errorMessage = error.response?.data?.message || 'Erreur lors de la connexion';
  //   const errorStatus = error.response?.status;
    
  //   throw {
  //     message: errorMessage,
  //     status: errorStatus,
  //     data: error.response?.data
  //   };
  // }

  //   // } catch (error) {
  //   //   const errorMessage = error.response?.data?.message || 'Erreur de connexion';
  //   //   throw new Error(errorMessage);
  //   // }
  // };

  const login = async (email, password, location) => {
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
        latitude: location.latitude,
        longitude: location.longitude
      });
  
      console.log('Raw response:', response);
  
      if (!response.data || !response.data.token) {
        throw new Error('Invalid response format');
      }
  
      // Set all required data in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('sessionStart', response.data.sessionStart);
      localStorage.setItem('sessionId', response.data.sessionId.toString());
      localStorage.setItem('user', JSON.stringify({
        id: response.data.userId,
        email,
        role: response.data.role,
        prenom: response.data.prenom,
        nom: response.data.nom,
        fonction: response.data.fonction,
      }));
      
      setUser({
        id: response.data.userId,
        email,
        role: response.data.role,
        prenom: response.data.prenom,
        fonction: response.data.fonction,
      });
      setIsAuthenticated(true);
  
      return response.data;
    } catch (error) {
      console.log('Login error:', error);
      throw error;
    }
  };
  


  // Fonction de déconnexion
  const logout = async () => {
    try {
      const sessionId = localStorage.getItem('sessionId');
      const token = localStorage.getItem('token');

      await api.put(`/sessions/${sessionId}/terminer`, { endTime: new Date().toISOString() }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      localStorage.removeItem('token');
      localStorage.removeItem('sessionId');
      setUser(null);
      setIsAuthenticated(false);
      router.push('/login');
    } catch (error) {
      console.error('Failed to logout', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading ,isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

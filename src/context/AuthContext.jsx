import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase';
import { 
  onAuthStateChanged, 
  GoogleAuthProvider,
  signInWithPopup, 
  signOut 
} from 'firebase/auth';
import axios from 'axios';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(() => {
    return (typeof process !== 'undefined' && process.env?.NODE_ENV === 'test') ||
           (typeof import.meta !== 'undefined' && import.meta.env?.MODE === 'test') ? false : true;
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken();
          const response = await axios.post('/api/auth/me', {}, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser({ ...firebaseUser, ...response.data.user });
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUser(firebaseUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    try {
      const token = await userCredential.user.getIdToken();
      await axios.post('/api/auth/register', { 
        name: userCredential.user.displayName, 
        email: userCredential.user.email 
      }, { headers: { Authorization: `Bearer ${token}` } });
    } catch (error) {
      console.log('Backend sync skipped or failed', error);
    }
    return userCredential.user;
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loginWithGoogle, 
      logout,
      isAuthenticated: !!user,
      isAdmin: user?.email === 'fortunefood273@gmail.com'
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

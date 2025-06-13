import React, {createContext, useState, useContext, useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import {getUser, removeUser} from '../utils/AuthStorage';

const AuthContext = createContext({});

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user data on app start
    const checkStoredUser = async () => {
      try {
        const storedUser = await getUser();
        if (storedUser) {
          setUser(storedUser);
        }
      } catch (error) {
        console.error('Error checking stored user:', error);
      } finally {
        setLoading(false);
      }
    };

    checkStoredUser();

    // Subscribe to auth state changes
    const unsubscribe = auth().onAuthStateChanged(async firebaseUser => {
      if (firebaseUser) {
        // Update user state with Firebase user data
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        });
      } else {
        // Clear user data when signed out
        setUser(null);
        await removeUser();
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signOut = async () => {
    try {
      await auth().signOut();
      await removeUser();
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signOut,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

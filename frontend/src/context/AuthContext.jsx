
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth, db } from '../firebase/firebase.config';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import getBaseUrl from '../utils/baseURL';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setCurrentUser({
          id: decoded.id,
          email: decoded.email,
          firstName: decoded.firstName || '',
          lastName: decoded.lastName || '',
          fullName: `${decoded.firstName || ''} ${decoded.lastName || ''}`.trim(),
          role: decoded.role || 'user',
          phone: decoded.phone || '',
          address: decoded.address || ''
        });
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('token');
      }
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setCurrentUser({
            uid: user.uid,
            email: user.email,
            ...userData
          });
        } else {
          await setDoc(doc(db, 'users', user.uid), {
            uid: user.uid,
            email: user.email,
            fullName: user.displayName || '',
            phone: '',
            address: '',
            createdAt: new Date()
          });
          setCurrentUser({
            uid: user.uid,
            email: user.email,
            fullName: user.displayName || '',
            phone: '',
            address: ''
          });
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const registerUser = async (email, password, fullName, phone, address) => {
    try {
      const parts = fullName.trim().split(' ');
      const firstName = parts.shift() || '';
      const lastName = parts.join(' ');
      const response = await axios.post(`${getBaseUrl()}/api/auth/register`, {
        firstName,
        lastName,
        email,
        password,
        phone,
        address
      });

      const data = response.data;
      localStorage.setItem('token', data.token);
      setCurrentUser({
        id: data.user.id,
        email: data.user.email,
        firstName: data.user.firstName || firstName,
        lastName: data.user.lastName || lastName,
        fullName: `${data.user.firstName || firstName} ${data.user.lastName || lastName}`.trim(),
        phone: data.user.phone || phone,
        address: data.user.address || address,
        role: data.user.role || 'user'
      });
      return data;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  };

  const loginUser = async (email, password) => {
    try {
      const response = await axios.post(`${getBaseUrl()}/api/auth/login`, {
        email,
        password
      });
      const data = response.data;
      localStorage.setItem('token', data.token);
      setCurrentUser({
        id: data.user.id,
        email: data.user.email,
        firstName: data.user.firstName || '',
        lastName: data.user.lastName || '',
        fullName: `${data.user.firstName || ''} ${data.user.lastName || ''}`.trim(),
        phone: data.user.phone || '',
        address: data.user.address || '',
        role: data.user.role || 'user'
      });
      return data;
    } catch (error) {
      console.error('Error logging in user:', error);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        fullName: user.displayName || '',
        photoURL: user.photoURL || '',
        createdAt: new Date()
      }, { merge: true });

      setCurrentUser({
        uid: user.uid,
        email: user.email,
        fullName: user.displayName || '',
        photoURL: user.photoURL || ''
      });

      return result;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const logout = async () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    try {
      if (auth.currentUser) {
        await signOut(auth);
      }
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const updateUserProfile = async (updates) => {
    if (!currentUser) return;
    
    try {
      if (auth.currentUser && updates.fullName) {
        await updateProfile(auth.currentUser, {
          displayName: updates.fullName
        });
      }

      if (auth.currentUser && currentUser.uid) {
        await updateDoc(doc(db, 'users', currentUser.uid), updates);
      }

      setCurrentUser(prev => ({ ...prev, ...updates }));
      
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const value = {
    currentUser,
    registerUser,
    loginUser,
    signInWithGoogle,
    logout,
    loading,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);


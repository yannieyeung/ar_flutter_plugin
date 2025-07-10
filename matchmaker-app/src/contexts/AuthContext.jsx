'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithCustomToken } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { ClientUserService } from '@/lib/db-client';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to get auth token from cookies
  const getAuthTokenFromCookie = () => {
    if (typeof document === 'undefined') return null;
    
    const cookies = document.cookie.split(';');
    const authTokenCookie = cookies.find(cookie => cookie.trim().startsWith('auth_token='));
    return authTokenCookie ? authTokenCookie.split('=')[1] : null;
  };

  // Function to clear auth token cookie
  const clearAuthTokenCookie = () => {
    if (typeof document === 'undefined') return;
    
    document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  };

  useEffect(() => {
    let mounted = true;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!mounted) return;

      setFirebaseUser(firebaseUser);
      
      if (firebaseUser) {
        // User is signed in, get user data from Firestore
        try {
          const userData = await ClientUserService.getUser(firebaseUser.uid);
          if (mounted) {
            setUser(userData);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          if (mounted) {
            setUser(null);
          }
        }
      } else {
        // User is not signed in, check for auth token in cookie
        const authToken = getAuthTokenFromCookie();
        
        if (authToken) {
          try {
            // Try to sign in with the custom token
            await signInWithCustomToken(auth, authToken);
            // The onAuthStateChanged will be triggered again with the signed-in user
            return;
          } catch (error) {
            console.error('Error signing in with custom token:', error);
            // Clear invalid token
            clearAuthTokenCookie();
          }
        }
        
        if (mounted) {
          setUser(null);
        }
      }
      
      if (mounted) {
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const refreshUser = async () => {
    if (firebaseUser) {
      try {
        const userData = await ClientUserService.getUser(firebaseUser.uid);
        setUser(userData);
      } catch (error) {
        console.error('Error refreshing user data:', error);
      }
    }
  };

  const signOut = async () => {
    try {
      // Call API to clear server-side session
      await fetch('/api/auth/signout', {
        method: 'POST',
      });
      
      // Clear the auth token cookie
      clearAuthTokenCookie();
      
      // Sign out from Firebase
      await auth.signOut();
      
      setUser(null);
      setFirebaseUser(null);
      
      // Redirect to sign in page
      window.location.href = '/auth/signin';
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const value = {
    user,
    firebaseUser,
    loading,
    signOut,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
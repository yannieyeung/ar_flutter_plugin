'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithCustomToken, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { ClientUserService } from '@/lib/db-client';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);

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

    console.log('🚀 AuthProvider: Setting up auth state listener');

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!mounted) return;

      console.log('🔄 AuthProvider: Auth state changed', { 
        firebaseUser: firebaseUser ? { uid: firebaseUser.uid, email: firebaseUser.email, phone: firebaseUser.phoneNumber } : null 
      });

      setFirebaseUser(firebaseUser);
      
      if (firebaseUser) {
        // User is signed in, get user data from Firestore
        try {
          console.log('👤 AuthProvider: Fetching user data from Firestore...');
          const userData = await ClientUserService.getUser(firebaseUser.uid);
          
          console.log('✅ AuthProvider: User data fetched successfully', userData);
          
          if (mounted) {
            setUser(userData);
          }
        } catch (error) {
          console.error('❌ AuthProvider: Error fetching user data:', error);
          if (mounted) {
            setUser(null);
          }
        }
      } else {
        // User is not signed in, check for auth token in cookie
        console.log('🔍 AuthProvider: No Firebase user, checking for auth token...');
        const authToken = getAuthTokenFromCookie();
        
        if (authToken) {
          console.log('🎟️ AuthProvider: Found auth token, attempting sign in...');
          try {
            // Try to sign in with the custom token
            await signInWithCustomToken(auth, authToken);
            console.log('✅ AuthProvider: Custom token sign in successful');
            // The onAuthStateChanged will be triggered again with the signed-in user
            return;
          } catch (error) {
            console.error('❌ AuthProvider: Error signing in with custom token:', error);
            // Clear invalid token
            clearAuthTokenCookie();
          }
        } else {
          console.log('🔍 AuthProvider: No auth token found in cookies');
        }
        
        if (mounted) {
          setUser(null);
        }
      }
      
      if (mounted) {
        setLoading(false);
        setAuthInitialized(true);
        console.log('✅ AuthProvider: Authentication initialized', { 
          firebaseUser: firebaseUser ? 'signed in' : 'not signed in',
          hasUserData: !!user 
        });
      }
    });

    return () => {
      console.log('🧹 AuthProvider: Cleaning up auth listener');
      mounted = false;
      unsubscribe();
    };
  }, []);

  const refreshUser = async () => {
    if (firebaseUser) {
      try {
        console.log('🔄 AuthProvider: Refreshing user data...');
        const userData = await ClientUserService.getUser(firebaseUser.uid);
        setUser(userData);
        console.log('✅ AuthProvider: User data refreshed', userData);
        return userData;
      } catch (error) {
        console.error('❌ AuthProvider: Error refreshing user data:', error);
        return null;
      }
    }
    return null;
  };

  const forceRefreshUser = async () => {
    console.log('🔄 AuthProvider: Force refreshing user data...');
    if (auth.currentUser) {
      try {
        const userData = await ClientUserService.getUser(auth.currentUser.uid);
        setUser(userData);
        console.log('✅ AuthProvider: Force refresh successful', userData);
        return userData;
      } catch (error) {
        console.error('❌ AuthProvider: Force refresh error:', error);
        return null;
      }
    }
    return null;
  };

  const signOut = async () => {
    try {
      console.log('🚪 AuthProvider: Signing out...');
      
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
      
      console.log('✅ AuthProvider: Sign out successful');
      
      // Redirect to sign in page
      window.location.href = '/auth/signin';
    } catch (error) {
      console.error('❌ AuthProvider: Sign out error:', error);
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      if (!firebaseUser || !firebaseUser.email) {
        throw new Error('User not authenticated or email not available');
      }

      console.log('🔄 AuthProvider: Starting password change process...');

      // First, reauthenticate the user with their current password
      console.log('🔐 AuthProvider: Reauthenticating user...');
      const credential = EmailAuthProvider.credential(firebaseUser.email, currentPassword);
      await reauthenticateWithCredential(firebaseUser, credential);

      console.log('✅ AuthProvider: User reauthenticated successfully');

      // Now update the password
      console.log('🔄 AuthProvider: Updating password...');
      await updatePassword(firebaseUser, newPassword);

      console.log('✅ AuthProvider: Password updated successfully');
      
      return { success: true };
    } catch (error) {
      console.error('❌ AuthProvider: Change password error:', error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    firebaseUser,
    loading,
    authInitialized,
    signOut,
    refreshUser,
    forceRefreshUser,
    changePassword,
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
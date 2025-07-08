'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { User } from '@/types/user';
import { ClientUserService } from '@/lib/db-client';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser);
      
      if (firebaseUser) {
        // Get user data from Firestore
        const userData = await ClientUserService.getUser(firebaseUser.uid);
        setUser(userData);
      } else {
        setUser(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const refreshUser = async () => {
    if (firebaseUser) {
      const userData = await ClientUserService.getUser(firebaseUser.uid);
      setUser(userData);
    }
  };

  const signOut = async () => {
    try {
      // Call API to clear server-side session
      await fetch('/api/auth/signout', {
        method: 'POST',
      });
      
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
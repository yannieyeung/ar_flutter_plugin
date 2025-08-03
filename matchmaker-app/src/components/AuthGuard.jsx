'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export function AuthGuard({ children, requireRegistration = false }) {
  const { user, firebaseUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log('🛡️ AuthGuard: Check', {
      loading,
      firebaseUser: !!firebaseUser,
      user: !!user,
      isRegistrationComplete: user?.isRegistrationComplete,
      requireRegistration,
      pathname: typeof window !== 'undefined' ? window.location.pathname : 'server'
    });

    if (!loading) {
      // Not authenticated
      if (!firebaseUser) {
        console.log('🚫 AuthGuard: No firebase user, redirecting to signin');
        router.push('/auth/signin');
        return;
      }

      // User data not found
      if (!user) {
        console.log('🚫 AuthGuard: No user data, redirecting to signin');
        router.push('/auth/signin');
        return;
      }

      // Check registration requirements
      if (requireRegistration && !user.isRegistrationComplete) {
        router.push(`/registration/${user.userType}`);
        return;
      }

      // Redirect completed users away from registration
      if (!requireRegistration && user.isRegistrationComplete && window.location.pathname.startsWith('/registration/')) {
        router.push('/dashboard');
        return;
      }

      // Redirect incomplete users to registration if they try to access dashboard
      if (!requireRegistration && !user.isRegistrationComplete && window.location.pathname.startsWith('/dashboard')) {
        router.push(`/registration/${user.userType}`);
        return;
      }
    }
  }, [user, firebaseUser, loading, router, requireRegistration]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render content if not authenticated or redirecting
  if (!firebaseUser || !user) {
    return null;
  }

  // Check registration status for requireRegistration prop
  if (requireRegistration && !user.isRegistrationComplete) {
    return null;
  }

  return <>{children}</>;
}
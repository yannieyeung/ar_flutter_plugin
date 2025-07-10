'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { signInWithCustomToken, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Link from 'next/link';

function SignUpContent() {
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [userType, setUserType] = useState('employer');
  const [usePhoneNumber, setUsePhoneNumber] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState('credentials'); // 'credentials' | 'otp'
  const [confirmationResult, setConfirmationResult] = useState(null);
  
  const router = useRouter();
  const { user, firebaseUser, authInitialized, forceRefreshUser } = useAuth();

  // Initialize reCAPTCHA for phone auth
  useEffect(() => {
    if (usePhoneNumber && !window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {
          // reCAPTCHA solved
        }
      });
    }
  }, [usePhoneNumber]);

  // Redirect if already authenticated (but only for users who visit the page when already signed in)
  useEffect(() => {
    console.log('🔍 SignUp: Auth state check', { 
      firebaseUser: firebaseUser ? { uid: firebaseUser.uid } : null, 
      user, 
      authInitialized,
      isLoading
    });

    // Only redirect once auth is initialized and we have both firebase user and user data
    // BUT not if we're in the middle of a signup process (isLoading = true)
    if (authInitialized && firebaseUser && user && !isLoading) {
      console.log('🔄 SignUp: User already authenticated, redirecting...', { 
        isRegistrationComplete: user.isRegistrationComplete,
        userType: user.userType 
      });
      
      if (user.isRegistrationComplete) {
        console.log('➡️ SignUp: Redirecting to dashboard');
        router.push('/dashboard');
      } else {
        console.log('➡️ SignUp: Redirecting to registration');
        router.push(`/registration/${user.userType}`);
      }
    }
  }, [firebaseUser, user, authInitialized, isLoading, router]);

  const handleEmailSignUp = async () => {
    console.log('📧 Email SignUp: Starting email signup process...');
    
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        userType,
      }),
    });

    const data = await response.json();
    console.log('📋 Email SignUp: API Response:', data);

    if (data.success) {
      console.log('✅ Email SignUp: Account created successfully');
      
      // Wait a moment for the cookie to be properly set
      console.log('⏳ Email SignUp: Waiting for cookie to be set...');
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Get the custom token from the cookie and sign in with Firebase
      const cookies = document.cookie.split(';');
      const authTokenCookie = cookies.find(cookie => cookie.trim().startsWith('auth_token='));
      
      if (authTokenCookie) {
        const customToken = authTokenCookie.split('=')[1];
        console.log('🎟️ Email SignUp: Found custom token, signing in...', { tokenLength: customToken.length });
        
        try {
          // Sign in with the custom token
          await signInWithCustomToken(auth, customToken);
          console.log('✅ Email SignUp: Firebase sign in successful');
          
          // Wait a moment for Firebase auth state to update
          console.log('⏳ Email SignUp: Waiting for auth state to update...');
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Force refresh user data and wait for it
          console.log('⏳ Email SignUp: Refreshing user data...');
          const refreshedUser = await forceRefreshUser();
          
          if (refreshedUser) {
            console.log('✅ Email SignUp: User data loaded successfully', {
              uid: refreshedUser.uid,
              userType: refreshedUser.userType,
              isRegistrationComplete: refreshedUser.isRegistrationComplete
            });
            
            // Redirect directly since we have the user data
            console.log('🎯 Email SignUp: Performing direct redirect to registration');
            router.push(`/registration/${refreshedUser.userType}`);
          } else {
            console.log('⚠️ Email SignUp: User data refresh failed, using fallback redirect');
            router.push(data.redirectUrl);
          }
          
        } catch (firebaseError) {
          console.error('❌ Email SignUp: Firebase sign in error:', firebaseError);
          // Fallback to direct redirect
          router.push(data.redirectUrl);
        }
      } else {
        console.log('⚠️ Email SignUp: No custom token found in cookies');
        console.log('🍪 Email SignUp: Available cookies:', document.cookie);
        console.log('⚠️ Email SignUp: Using direct redirect as fallback');
        // Fallback to direct redirect
        router.push(data.redirectUrl);
      }
    } else {
      console.error('❌ Email SignUp: API failed:', data);
      setError(data.message || 'Sign up failed');
    }
  };

  const handlePhoneSignUp = async () => {
    if (!window.recaptchaVerifier) {
      setError('reCAPTCHA not initialized. Please refresh and try again.');
      return;
    }

    try {
      const result = await signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier);
      setConfirmationResult(result);
      setStep('otp');
      setError('');
    } catch (error) {
      console.error('Phone sign up error:', error);
      setError('Failed to send OTP. Please check your phone number.');
    }
  };

  const handleOtpVerification = async () => {
    if (!confirmationResult) {
      setError('No verification in progress. Please try again.');
      return;
    }

    try {
      console.log('🔐 Phone SignUp: Starting OTP verification...');
      
      // Verify OTP with Firebase
      const firebaseResult = await confirmationResult.confirm(otp);
      const firebaseUser = firebaseResult.user;

      console.log('✅ Phone SignUp: OTP verified successfully', {
        uid: firebaseUser.uid,
        phoneNumber: firebaseUser.phoneNumber
      });

      // Now create user record via API
      console.log('🔄 Phone SignUp: Creating user record via API...', {
        phoneNumber,
        userType,
        firebaseUid: firebaseUser.uid
      });

      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber,
          userType,
          firebaseUid: firebaseUser.uid,
        }),
      });

      const data = await response.json();
      console.log('📋 Phone SignUp: API Response:', data);

      if (data.success) {
        console.log('✅ Phone SignUp: User record created successfully');
        console.log('⏳ Phone SignUp: Triggering immediate user data refresh...');
        
        // Try immediate refresh first
        try {
          const refreshedUser = await forceRefreshUser();
          if (refreshedUser) {
            console.log('✅ Phone SignUp: Immediate refresh successful, user data loaded');
            // The useEffect will handle redirection
            return;
          }
        } catch (error) {
          console.error('❌ Phone SignUp: Immediate refresh failed:', error);
        }
        
        // If immediate refresh failed, wait a bit for Firestore consistency
        console.log('⏳ Phone SignUp: Immediate refresh failed, waiting for consistency...');
        setTimeout(async () => {
          console.log('🔄 Phone SignUp: Retrying user data refresh...');
          
          const refreshedUser = await forceRefreshUser();
          if (refreshedUser) {
            console.log('✅ Phone SignUp: Delayed refresh successful');
          } else {
            console.log('❌ Phone SignUp: All refresh attempts failed, forcing page reload');
            window.location.reload();
          }
        }, 3000); // Increased delay for better consistency
        
      } else {
        console.error('❌ Phone SignUp: API failed:', data);
        setError(data.message || 'Failed to create user account');
      }
    } catch (error) {
      console.error('❌ Phone SignUp: OTP verification error:', error);
      setError('Invalid OTP. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('🔄 Form submission started', { usePhoneNumber, step, isLoading });
    
    if (isLoading) {
      console.log('⚠️ Form submission blocked - already loading');
      return;
    }
    
    setIsLoading(true);
    setError('');

    try {
      if (usePhoneNumber) {
        if (step === 'credentials') {
          console.log('📱 Starting phone signup...');
          await handlePhoneSignUp();
        } else if (step === 'otp') {
          console.log('🔐 Starting OTP verification...');
          await handleOtpVerification();
        }
      } else {
        console.log('📧 Starting email signup...');
        await handleEmailSignUp();
      }
    } catch (error) {
      console.error('❌ Form submission error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
      console.log('✅ Form submission completed');
    }
  };

  const handleAuthMethodChange = (usePhone) => {
    setUsePhoneNumber(usePhone);
    setStep('credentials');
    setError('');
    setOtp('');
    setConfirmationResult(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link href="/auth/signin" className="font-medium text-indigo-600 hover:text-indigo-500">
              sign in to your existing account
            </Link>
          </p>
        </div>

        <form 
          className="mt-8 space-y-6" 
          onSubmit={handleSubmit}
          method="post"
          action="#"
        >
          <div className="space-y-4">
            <div>
              <label htmlFor="user-type" className="block text-sm font-medium text-gray-700">
                I am a:
              </label>
              <select
                id="user-type"
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="employer">Employer</option>
                <option value="agency">Agency</option>
                <option value="individual_helper">Individual Helper</option>
              </select>
            </div>

            {step === 'credentials' && (
              <>
                <div>
                  <div className="flex items-center space-x-4 mb-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={!usePhoneNumber}
                        onChange={() => handleAuthMethodChange(false)}
                        className="mr-2"
                      />
                      <span className="text-sm font-medium text-gray-700">Email</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={usePhoneNumber}
                        onChange={() => handleAuthMethodChange(true)}
                        className="mr-2"
                      />
                      <span className="text-sm font-medium text-gray-700">Phone Number</span>
                    </label>
                  </div>

                  {usePhoneNumber ? (
                    <input
                      id="phone-number"
                      type="tel"
                      required
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Phone number (e.g., +1234567890)"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  ) : (
                    <input
                      id="email-address"
                      type="email"
                      autoComplete="email"
                      required
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  )}
                </div>

                {!usePhoneNumber && (
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      autoComplete="new-password"
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                )}
              </>
            )}

            {step === 'otp' && (
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                  Enter OTP sent to {phoneNumber}
                </label>
                <input
                  id="otp"
                  type="text"
                  required
                  maxLength="6"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <p className="mt-1 text-sm text-gray-500">
                  Didn't receive OTP?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setStep('credentials');
                      setOtp('');
                      setConfirmationResult(null);
                    }}
                    className="text-indigo-600 hover:text-indigo-500"
                  >
                    Try again
                  </button>
                </p>
              </div>
            )}
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {step === 'credentials' 
                    ? (usePhoneNumber ? 'Sending OTP...' : 'Creating account...') 
                    : 'Verifying OTP...'
                  }
                </div>
              ) : (
                step === 'credentials' 
                  ? (usePhoneNumber ? 'Send OTP' : 'Sign up') 
                  : 'Verify OTP'
              )}
            </button>
          </div>
        </form>

        {/* reCAPTCHA container */}
        <div id="recaptcha-container"></div>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>}>
      <SignUpContent />
    </Suspense>
  );
}
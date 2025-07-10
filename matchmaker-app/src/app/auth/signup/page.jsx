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
  const { user, firebaseUser, authInitialized } = useAuth();

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

  // Redirect if already authenticated
  useEffect(() => {
    console.log('🔍 SignUp: Auth state check', { 
      firebaseUser: firebaseUser ? { uid: firebaseUser.uid } : null, 
      user, 
      authInitialized 
    });

    // Only redirect once auth is initialized and we have both firebase user and user data
    if (authInitialized && firebaseUser && user) {
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
  }, [firebaseUser, user, authInitialized, router]);

  const handleEmailSignUp = async () => {
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

    if (data.success) {
      // Get the custom token from the cookie and sign in with Firebase
      const cookies = document.cookie.split(';');
      const authTokenCookie = cookies.find(cookie => cookie.trim().startsWith('auth_token='));
      
      if (authTokenCookie) {
        const customToken = authTokenCookie.split('=')[1];
        
        try {
          // Sign in with the custom token
          await signInWithCustomToken(auth, customToken);
          
          // The AuthContext will handle automatic redirection
          // No manual redirect needed here
        } catch (firebaseError) {
          console.error('Firebase sign in error:', firebaseError);
          // Fallback to direct redirect
          router.push(data.redirectUrl);
        }
      } else {
        // Fallback to direct redirect
        router.push(data.redirectUrl);
      }
    } else {
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
      // Verify OTP with Firebase
      const firebaseResult = await confirmationResult.confirm(otp);
      const firebaseUser = firebaseResult.user;

      // Now create user record via API
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

      if (data.success) {
        // User is already signed in with Firebase from OTP verification
        // The AuthContext will handle automatic redirection
      } else {
        setError(data.message || 'Failed to create user account');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      setError('Invalid OTP. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isLoading) return;
    
    setIsLoading(true);
    setError('');

    try {
      if (usePhoneNumber) {
        if (step === 'credentials') {
          await handlePhoneSignUp();
        } else if (step === 'otp') {
          await handleOtpVerification();
        }
      } else {
        await handleEmailSignUp();
      }
    } catch (error) {
      console.error('Sign up error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
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

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="user-type" className="block text-sm font-medium text-gray-700">
                I am a:
              </label>
              <select
                id="user-type"
                name="userType"
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
                        name="signupMethod"
                        checked={!usePhoneNumber}
                        onChange={() => handleAuthMethodChange(false)}
                        className="mr-2"
                      />
                      <span className="text-sm font-medium text-gray-700">Email</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="signupMethod"
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
                      name="phoneNumber"
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
                      name="email"
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
                      name="password"
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
                  name="otp"
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
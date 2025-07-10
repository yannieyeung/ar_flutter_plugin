'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { signInWithCustomToken, RecaptchaVerifier, signInWithPhoneNumber, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Link from 'next/link';

function SignInContent() {
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [usePhoneNumber, setUsePhoneNumber] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState('credentials'); // 'credentials' | 'otp'
  const [confirmationResult, setConfirmationResult] = useState(null);
  
  const router = useRouter();
  const searchParams = useSearchParams();
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
    console.log('🔍 SignIn: Auth state check', { 
      firebaseUser: firebaseUser ? { uid: firebaseUser.uid } : null, 
      user, 
      authInitialized 
    });

    // Only redirect once auth is initialized and we have both firebase user and user data
    if (authInitialized && firebaseUser && user) {
      console.log('🔄 SignIn: User already authenticated, redirecting...', { 
        isRegistrationComplete: user.isRegistrationComplete,
        userType: user.userType 
      });
      
      if (user.isRegistrationComplete) {
        console.log('➡️ SignIn: Redirecting to dashboard');
        router.push('/dashboard');
      } else {
        console.log('➡️ SignIn: Redirecting to registration');
        router.push(`/registration/${user.userType}`);
      }
    }
  }, [firebaseUser, user, authInitialized, router]);

  const handleEmailSignIn = async () => {
    try {
      console.log('📧 SignIn: Starting email sign in...', { 
        email: email, 
        passwordLength: password.length,
        hasAuth: !!auth 
      });
      
      // Validate inputs before Firebase call
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      
      if (!email.includes('@')) {
        throw new Error('Invalid email format');
      }

      // Check if user exists in our Firestore first
      console.log('🔍 SignIn: Checking if user exists in our database...');
      try {
        const checkResponse = await fetch('/api/auth/check-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        const checkResult = await checkResponse.json();
        console.log('📋 SignIn: User check result:', checkResult);
      } catch (checkError) {
        console.log('⚠️ SignIn: Could not check user existence:', checkError.message);
      }

      // Sign in with Firebase directly
      console.log('🔥 SignIn: Calling Firebase signInWithEmailAndPassword...');
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      console.log('✅ SignIn: Firebase email sign in successful:', {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        emailVerified: firebaseUser.emailVerified
      });

      // The AuthContext will handle getting user data and automatic redirection
      // No manual redirect needed here

    } catch (error) {
      console.error('❌ SignIn: Email sign in error details:', {
        code: error.code,
        message: error.message,
        fullError: error
      });
      
      // Enhanced error handling with more specific messages
      if (error.code === 'auth/user-not-found') {
        setError('No account found with this email address. Please sign up first.');
      } else if (error.code === 'auth/wrong-password') {
        setError('Incorrect password. Please try again.');
      } else if (error.code === 'auth/invalid-email') {
        setError('Invalid email address format.');
      } else if (error.code === 'auth/user-disabled') {
        setError('This account has been disabled. Please contact support.');
      } else if (error.code === 'auth/too-many-requests') {
        setError('Too many failed attempts. Please try again later.');
      } else if (error.code === 'auth/invalid-credential') {
        setError('Invalid email or password. Please check your credentials.');
      } else if (error.message.includes('required')) {
        setError(error.message);
      } else {
        setError(`Sign in failed: ${error.message || 'Please try again.'}`);
      }
    }
  };

  const handlePhoneSignIn = async () => {
    if (!window.recaptchaVerifier) {
      setError('reCAPTCHA not initialized. Please refresh and try again.');
      return;
    }

    try {
      console.log('📱 Attempting phone sign in...');
      const result = await signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier);
      setConfirmationResult(result);
      setStep('otp');
      setError('');
      console.log('✅ OTP sent to phone number');
    } catch (error) {
      console.error('📱 Phone sign in error:', error);
      setError('Failed to send OTP. Please check your phone number.');
    }
  };

  const handleOtpVerification = async () => {
    if (!confirmationResult) {
      setError('No verification in progress. Please try again.');
      return;
    }

    try {
      console.log('🔐 Verifying OTP...');
      
      // Verify OTP with Firebase
      const firebaseResult = await confirmationResult.confirm(otp);
      const firebaseUser = firebaseResult.user;

      console.log('✅ Phone OTP verification successful:', firebaseUser.uid);

      // The AuthContext will handle getting user data and automatic redirection
      // No manual redirect needed here

    } catch (error) {
      console.error('🔐 OTP verification error:', error);
      setError('Invalid OTP. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('🔄 SignIn: Form submission started', { usePhoneNumber, step, isLoading });
    
    if (isLoading) {
      console.log('⚠️ SignIn: Form submission blocked - already loading');
      return;
    }
    
    setIsLoading(true);
    setError('');

    try {
      if (usePhoneNumber) {
        if (step === 'credentials') {
          console.log('📱 SignIn: Starting phone signin...');
          await handlePhoneSignIn();
        } else if (step === 'otp') {
          console.log('🔐 SignIn: Starting OTP verification...');
          await handleOtpVerification();
        }
      } else {
        console.log('📧 SignIn: Starting email signin...');
        await handleEmailSignIn();
      }
    } catch (error) {
      console.error('❌ SignIn: Form submission error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
      console.log('✅ SignIn: Form submission completed');
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
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link href="/auth/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
              create a new account
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
            {step === 'credentials' && (
              <>
                <div className="mb-4">
                  <div className="flex items-center space-x-4">
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
                </div>

                {usePhoneNumber ? (
                  <div>
                    <label htmlFor="phone-number" className="sr-only">
                      Phone number
                    </label>
                    <input
                      id="phone-number"
                      type="tel"
                      required
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Phone number (e.g., +1234567890)"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </div>
                ) : (
                  <>
                    <div>
                      <label htmlFor="email-address" className="sr-only">
                        Email address
                      </label>
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
                    </div>

                    <div>
                      <label htmlFor="password" className="sr-only">
                        Password
                      </label>
                      <input
                        id="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </>
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
                    ? (usePhoneNumber ? 'Sending OTP...' : 'Signing in...') 
                    : 'Verifying OTP...'
                  }
                </div>
              ) : (
                step === 'credentials' 
                  ? (usePhoneNumber ? 'Send OTP' : 'Sign in') 
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

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>}>
      <SignInContent />
    </Suspense>
  );
}
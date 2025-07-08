'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { SignUpData, UserType } from '@/types/user';

export default function SignUpPage() {
  const [formData, setFormData] = useState<SignUpData>({
    email: '',
    phoneNumber: '',
    password: '',
    userType: 'employer',
  });
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const submitData: SignUpData = {
        password: formData.password,
        userType: formData.userType,
      };

      if (authMethod === 'email') {
        submitData.email = formData.email;
      } else {
        submitData.phoneNumber = formData.phoneNumber;
      }

      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      const result = await response.json();

      if (result.success) {
        // The API sets an auth token cookie, now we redirect
        router.push(result.redirectUrl);
      } else {
        setError(result.message);
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const userTypes: { value: UserType; label: string; description: string }[] = [
    {
      value: 'employer',
      label: 'Employer',
      description: 'I need to hire helpers for my business',
    },
    {
      value: 'agency',
      label: 'Agency',
      description: 'I represent multiple helpers and connect them with employers',
    },
    {
      value: 'individual_helper',
      label: 'Individual Helper',
      description: 'I provide services and want to find work opportunities',
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Join MatchMaker and connect with opportunities
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* User Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              I am a...
            </label>
            <div className="space-y-3">
              {userTypes.map((type) => (
                <label
                  key={type.value}
                  className={`flex items-start p-4 border rounded-lg cursor-pointer transition-all ${
                    formData.userType === type.value
                      ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-500'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="userType"
                    value={type.value}
                    checked={formData.userType === type.value}
                    onChange={(e) =>
                      setFormData({ ...formData, userType: e.target.value as UserType })
                    }
                    className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">
                      {type.label}
                    </div>
                    <div className="text-xs text-gray-500">{type.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Authentication Method Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Sign up with
            </label>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setAuthMethod('email')}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md ${
                  authMethod === 'email'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Email
              </button>
              <button
                type="button"
                onClick={() => setAuthMethod('phone')}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md ${
                  authMethod === 'phone'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Phone
              </button>
            </div>
          </div>

          {/* Email/Phone Input */}
          <div>
            <label htmlFor="contact" className="sr-only">
              {authMethod === 'email' ? 'Email address' : 'Phone number'}
            </label>
            <input
              id="contact"
              name="contact"
              type={authMethod === 'email' ? 'email' : 'tel'}
              autoComplete={authMethod === 'email' ? 'email' : 'tel'}
              required
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder={authMethod === 'email' ? 'Email address' : 'Phone number'}
              value={authMethod === 'email' ? formData.email : formData.phoneNumber}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  [authMethod === 'email' ? 'email' : 'phoneNumber']: e.target.value,
                })
              }
            />
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </div>

          <div className="text-center">
            <span className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                href="/auth/signin"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Sign in
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
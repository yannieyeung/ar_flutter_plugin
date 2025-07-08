'use client';

import { useParams, useRouter } from 'next/navigation';
import { AuthGuard } from '@/components/AuthGuard';
import { UserType } from '@/types/user';

function RegistrationPageContent() {
  const params = useParams();
  const router = useRouter();
  const userType = params.userType as UserType;

  const handleSkip = () => {
    // Redirect to listings page
    router.push('/listings');
  };

  const handleComplete = () => {
    // This will be implemented later with actual forms
    alert('Registration form will be implemented in the next phase');
  };

  const getTitle = () => {
    switch (userType) {
      case 'employer':
        return 'Complete Your Employer Profile';
      case 'agency':
        return 'Complete Your Agency Profile';
      case 'individual_helper':
        return 'Complete Your Helper Profile';
      default:
        return 'Complete Your Profile';
    }
  };

  const getDescription = () => {
    switch (userType) {
      case 'employer':
        return 'Tell us about your company and what kind of help you need to get matched with the perfect candidates.';
      case 'agency':
        return 'Share details about your agency and the helpers you represent to connect with employers.';
      case 'individual_helper':
        return 'Share your skills, experience, and availability to get matched with great job opportunities.';
      default:
        return 'Complete your profile to get started.';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto h-16 w-16 flex items-center justify-center bg-indigo-100 rounded-full mb-4">
              <svg
                className="h-8 w-8 text-indigo-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              {getTitle()}
            </h1>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              {getDescription()}
            </p>
          </div>

          {/* Progress indicator */}
          <div className="mb-8">
            <div className="bg-gray-200 rounded-full h-2">
              <div className="bg-indigo-600 h-2 rounded-full w-1/4"></div>
            </div>
            <p className="text-sm text-gray-500 mt-2">Step 1 of 4</p>
          </div>

          {/* Placeholder form content */}
          <div className="space-y-6 mb-8">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
              <svg
                className="mx-auto h-12 w-12 text-yellow-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <h3 className="text-lg font-medium text-yellow-800 mb-2">
                Registration Form Coming Soon
              </h3>
              <p className="text-yellow-700">
                The detailed registration form for {userType.replace('_', ' ')} will be implemented in the next phase. 
                For now, you can skip to explore the platform or wait for the full form.
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleSkip}
              className="px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Skip for now
            </button>
            <button
              onClick={handleComplete}
              className="px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Complete Profile
            </button>
          </div>

          {/* Help text */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              You can always complete your profile later from your dashboard
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegistrationPage() {
  return (
    <AuthGuard>
      <RegistrationPageContent />
    </AuthGuard>
  );
}
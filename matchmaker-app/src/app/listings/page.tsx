'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { AuthGuard } from '@/components/AuthGuard';

function ListingsPageContent() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const getWelcomeMessage = () => {
    if (!user) return 'Welcome to MatchMaker';
    
    switch (user.userType) {
      case 'employer':
        return 'Find Perfect Helpers for Your Business';
      case 'agency':
        return 'Connect Your Helpers with Opportunities';
      case 'individual_helper':
        return 'Discover Amazing Job Opportunities';
      default:
        return 'Welcome to MatchMaker';
    }
  };

  const getDescription = () => {
    if (!user) return 'AI-powered matching platform';
    
    switch (user.userType) {
      case 'employer':
        return 'Browse through qualified helpers and agencies. Use our AI-powered matching to find candidates that perfectly fit your needs.';
      case 'agency':
        return 'Explore job opportunities from various employers. Match your helpers with the right positions using our intelligent system.';
      case 'individual_helper':
        return 'Browse job listings from employers and agencies. Find opportunities that match your skills and preferences.';
      default:
        return 'Browse listings and find matches';
    }
  };

  const handleCompleteProfile = () => {
    if (user && !user.isRegistrationComplete) {
      router.push(`/registration/${user.userType}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-indigo-600">MatchMaker</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {user?.email || user?.phoneNumber}
              </span>
              {user && !user.isRegistrationComplete && (
                <button
                  onClick={handleCompleteProfile}
                  className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium hover:bg-yellow-200 transition-colors"
                >
                  Complete Profile
                </button>
              )}
              <button
                onClick={signOut}
                className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
            {getWelcomeMessage()}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {getDescription()}
          </p>
        </div>

        {/* Profile Completion Banner */}
        {user && !user.isRegistrationComplete && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <div className="flex items-center">
              <svg
                className="h-8 w-8 text-blue-400 mr-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-blue-900">
                  Complete Your Profile for Better Matches
                </h3>
                <p className="text-blue-700">
                  Complete your profile to get personalized recommendations and better matches using our AI system.
                </p>
              </div>
              <button
                onClick={handleCompleteProfile}
                className="ml-4 bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors"
              >
                Complete Now
              </button>
            </div>
          </div>
        )}

        {/* Listings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Listings */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {user?.userType === 'employer' ? 'Available Helpers' : 'Job Opportunities'}
              </h3>
              
              {/* Placeholder listings */}
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div
                    key={item}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {user?.userType === 'employer' 
                            ? `Professional Helper #${item}`
                            : `Job Opportunity #${item}`
                          }
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {user?.userType === 'employer'
                            ? 'Experienced helper with excellent reviews and multiple certifications.'
                            : 'Great opportunity with competitive pay and flexible schedule.'
                          }
                        </p>
                        <div className="flex items-center mt-2 space-x-4">
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            Available
                          </span>
                          <span className="text-xs text-gray-500">
                            Posted 2 days ago
                          </span>
                        </div>
                      </div>
                      <button className="ml-4 bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 text-center">
                <p className="text-gray-500 text-sm">
                  This is a preview. Actual listings will be implemented in the next phase.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Matching Status */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">AI Matching</h3>
              {user?.isRegistrationComplete ? (
                <div>
                  <div className="flex items-center text-green-600 mb-2">
                    <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Active</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Our AI is analyzing your profile and finding the best matches for you.
                  </p>
                </div>
              ) : (
                <div>
                  <div className="flex items-center text-yellow-600 mb-2">
                    <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Inactive</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Complete your profile to enable AI matching.
                  </p>
                  <button
                    onClick={handleCompleteProfile}
                    className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
                  >
                    Enable AI Matching
                  </button>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Active Listings</span>
                  <span className="text-sm font-medium">127</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">New This Week</span>
                  <span className="text-sm font-medium">23</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Success Rate</span>
                  <span className="text-sm font-medium">94%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ListingsPage() {
  return (
    <AuthGuard>
      <ListingsPageContent />
    </AuthGuard>
  );
}
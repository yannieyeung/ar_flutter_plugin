'use client';

import { useAuth } from '@/contexts/AuthContext';
import { AuthGuard } from '@/components/AuthGuard';

function DashboardPageContent() {
  const { user, signOut } = useAuth();

  const getWelcomeMessage = () => {
    if (!user) return 'Welcome to MatchMaker';
    
    switch (user.userType) {
      case 'employer':
        return 'Employer Dashboard';
      case 'agency':
        return 'Agency Dashboard';
      case 'individual_helper':
        return 'Helper Dashboard';
      default:
        return 'Dashboard';
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
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
            {getWelcomeMessage()}
          </h2>
          <p className="text-xl text-gray-600">
            Your personalized dashboard with AI-powered matching
          </p>
        </div>

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                AI Recommendations
              </h3>
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-green-400 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h4 className="text-lg font-medium text-green-800 mb-2">
                  Profile Complete!
                </h4>
                <p className="text-green-700">
                  Great! Your profile is complete and our AI is working to find the best matches for you.
                  The full dashboard with personalized recommendations will be available in the next phase.
                </p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Recent Activity
              </h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-600">Profile created successfully</span>
                  <span className="text-xs text-gray-400 ml-auto">Just now</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-600">AI matching activated</span>
                  <span className="text-xs text-gray-400 ml-auto">1 min ago</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-600">Account verified</span>
                  <span className="text-xs text-gray-400 ml-auto">2 min ago</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Status */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Status</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Profile Completion</span>
                  <span className="text-sm font-medium text-green-600">100%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full w-full"></div>
                </div>
                <div className="flex items-center text-green-600">
                  <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium">All set!</span>
                </div>
              </div>
            </div>

            {/* Match Stats */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Match Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Potential Matches</span>
                  <span className="text-sm font-medium">15</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Match Score</span>
                  <span className="text-sm font-medium">92%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Active Since</span>
                  <span className="text-sm font-medium">Today</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  View All Matches
                </button>
                <button className="w-full text-left px-4 py-3 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  Update Profile
                </button>
                <button className="w-full text-left px-4 py-3 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard requireRegistration={true}>
      <DashboardPageContent />
    </AuthGuard>
  );
}
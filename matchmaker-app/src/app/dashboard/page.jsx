'use client';

import { useAuth } from '@/contexts/AuthContext';
import { AuthGuard } from '@/components/AuthGuard';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <AuthGuard requireRegistration={true}>
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600">Welcome back, {user?.email || user?.phoneNumber}!</p>
              </div>
              <div className="flex space-x-3">
                <Link
                  href="/profile"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  View Profile
                </Link>
                <button
                  onClick={handleSignOut}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 p-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Welcome to MatchMaker!
                </h2>
                <p className="text-gray-600 mb-6">
                  Your registration is complete. Here&apos;s what you can do:
                </p>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
                  {/* Profile Card - Available for all user types */}
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      My Profile
                    </h3>
                    <p className="text-gray-600 mb-4">
                      View and edit your profile information, photos, and documents.
                    </p>
                    <Link
                      href="/profile"
                      className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      View Profile
                    </Link>
                  </div>
                  {user?.userType === 'employer' && (
                    <>
                      <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Browse Helpers
                        </h3>
                        <p className="text-gray-600 mb-4">
                          Find qualified helpers for your business needs.
                        </p>
                        <Link
                          href="/listings?type=helpers"
                          className="inline-block bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                        >
                          Browse Helpers
                        </Link>
                      </div>
                      <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Post a Job
                        </h3>
                        <p className="text-gray-600 mb-4">
                          Create job listings to attract the right candidates.
                        </p>
                        <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                          Post Job (Coming Soon)
                        </button>
                      </div>
                    </>
                  )}

                  {user?.userType === 'agency' && (
                    <>
                      <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Manage Helpers
                        </h3>
                        <p className="text-gray-600 mb-4">
                          Oversee your network of helpers and their placements.
                        </p>
                        <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
                          Manage Network (Coming Soon)
                        </button>
                      </div>
                      <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Browse Employers
                        </h3>
                        <p className="text-gray-600 mb-4">
                          Connect with employers looking for helpers.
                        </p>
                        <Link
                          href="/listings?type=employers"
                          className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                        >
                          Browse Employers
                        </Link>
                      </div>
                    </>
                  )}

                  {user?.userType === 'individual_helper' && (
                    <>
                      <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Find Jobs
                        </h3>
                        <p className="text-gray-600 mb-4">
                          Search for employment opportunities that match your skills.
                        </p>
                        <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
                          Browse Jobs (Coming Soon)
                        </button>
                      </div>
                      <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          View Agencies
                        </h3>
                        <p className="text-gray-600 mb-4">
                          Connect with agencies that can help find you work.
                        </p>
                        <Link
                          href="/listings?type=agencies"
                          className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                        >
                          Browse Agencies
                        </Link>
                      </div>
                    </>
                  )}
                </div>

                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Your Profile
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 text-left max-w-md mx-auto">
                    <p><strong>User Type:</strong> {user?.userType?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                    <p><strong>Contact:</strong> {user?.email || user?.phoneNumber}</p>
                    <p><strong>Registration:</strong> Complete ✅</p>
                    <p><strong>Member Since:</strong> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
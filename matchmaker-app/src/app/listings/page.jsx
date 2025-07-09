'use client';

import { useAuth } from '@/contexts/AuthContext';
import { AuthGuard } from '@/components/AuthGuard';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function ListingsPage() {
  const { user, signOut } = useAuth();
  const searchParams = useSearchParams();
  const listingType = searchParams.get('type') || 'all';

  const handleSignOut = async () => {
    await signOut();
  };

  const getPageTitle = () => {
    switch (listingType) {
      case 'helpers':
        return 'Browse Helpers';
      case 'employers':
        return 'Browse Employers';
      case 'agencies':
        return 'Browse Agencies';
      default:
        return 'Browse Listings';
    }
  };

  const getPageDescription = () => {
    switch (listingType) {
      case 'helpers':
        return 'Find qualified helpers for your business needs';
      case 'employers':
        return 'Discover employers with great opportunities';
      case 'agencies':
        return 'Connect with agencies that can help you find work';
      default:
        return 'Explore all available listings';
    }
  };

  return (
    <AuthGuard requireRegistration={true}>
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{getPageTitle()}</h1>
                <p className="text-gray-600">{getPageDescription()}</p>
              </div>
              <div className="flex space-x-4">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Dashboard
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
            {/* Filter Tabs */}
            <div className="mb-8">
              <nav className="flex space-x-8" aria-label="Tabs">
                <Link
                  href="/listings?type=all"
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    listingType === 'all'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  All
                </Link>
                <Link
                  href="/listings?type=helpers"
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    listingType === 'helpers'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Helpers
                </Link>
                <Link
                  href="/listings?type=employers"
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    listingType === 'employers'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Employers
                </Link>
                <Link
                  href="/listings?type=agencies"
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    listingType === 'agencies'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Agencies
                </Link>
              </nav>
            </div>

            {/* Listings Grid */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-8">
                <div className="text-center">
                  <div className="mx-auto h-32 w-32 text-gray-400">
                    <svg
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="h-full w-full"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  </div>
                  <h3 className="mt-6 text-lg font-medium text-gray-900">
                    Listings Coming Soon
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    We&apos;re working on building the listings feature. This will include:
                  </p>
                  <div className="mt-6 max-w-md mx-auto">
                    <ul className="text-left text-sm text-gray-600 space-y-2">
                      <li className="flex items-center">
                        <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Search and filter capabilities
                      </li>
                      <li className="flex items-center">
                        <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        AI-powered matching recommendations
                      </li>
                      <li className="flex items-center">
                        <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Detailed profiles and portfolios
                      </li>
                      <li className="flex items-center">
                        <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Direct messaging and communication
                      </li>
                      <li className="flex items-center">
                        <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Rating and review system
                      </li>
                    </ul>
                  </div>
                  <div className="mt-8">
                    <Link
                      href="/dashboard"
                      className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Back to Dashboard
                    </Link>
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
'use client';

import { useState, useEffect, use } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AuthGuard } from '@/components/AuthGuard';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function MatchesPage({ params }) {
  const { user } = useAuth();
  const router = useRouter();
  const { jobId } = use(params);
  
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [job, setJob] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalMatches, setTotalMatches] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [totalPages, setTotalPages] = useState(0);

  const MATCHES_PER_PAGE = 10;
  const MAX_MATCHES = 50;

  useEffect(() => {
    if (jobId) {
      fetchJob();
      fetchMatches(1);
    }
  }, [jobId]);

  const fetchJob = async () => {
    try {
      const response = await fetch(`/api/jobs/${jobId}`);
      if (response.ok) {
        const jobData = await response.json();
        setJob(jobData);
      }
    } catch (error) {
      console.error('Error fetching job:', error);
    }
  };

  const fetchMatches = async (page = 1, append = false) => {
    try {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      
      setError(null);

      const response = await fetch(
        `/api/jobs/${jobId}/matches?page=${page}&limit=${MATCHES_PER_PAGE}&userId=${user?.uid}`,
        {
          headers: {
            'x-user-id': user?.uid || '',
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch matches');
      }

      const data = await response.json();
      
      if (append) {
        setMatches(prev => [...prev, ...data.matches]);
      } else {
        setMatches(data.matches);
      }
      
      setTotalMatches(data.pagination?.totalMatches || data.totalMatches || 0);
      setHasMore(data.pagination?.hasMore || data.hasMore || false);
      setTotalPages(data.pagination?.totalPages || Math.ceil((data.totalMatches || 0) / MATCHES_PER_PAGE));
      setCurrentPage(page);
      
    } catch (error) {
      console.error('Error fetching matches:', error);
      setError(error.message);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMoreMatches = () => {
    if (hasMore && !loadingMore && currentPage < totalPages) {
      fetchMatches(currentPage + 1, true);
    }
  };

  // Track user interactions with helper cards
  const trackHelperInteraction = async (helperId, action, helperData = {}) => {
    try {
      await fetch(`/api/jobs/${jobId}/matches`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          helperId,
          action,
          userId: user?.uid,
          helperData,
          jobData: job
        })
      });
      console.log(`📊 Tracked ${action} for helper ${helperId}`);
    } catch (error) {
      console.error('Error tracking interaction:', error);
      // Don't fail the user action for tracking errors
    }
  };

  const handleHelperClick = (helper, action) => {
    // Track the click
    trackHelperInteraction(helper.id, action, helper);
    
    // Handle the action
    switch (action) {
      case 'view_profile':
        // Navigate to helper profile or open modal
        console.log('View profile for:', helper.fullName);
        break;
      case 'contact':
        // Open contact modal or navigate to contact page
        console.log('Contact:', helper.fullName);
        break;
      case 'favorite':
        // Add to favorites
        console.log('Favorite:', helper.fullName);
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  const getMatchScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getMatchScoreLabel = (score) => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    return 'Fair Match';
  };

  if (loading) {
    return (
      <AuthGuard requireRegistration={true}>
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Finding your perfect matches...</p>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard requireRegistration={true}>
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Job Matches</h1>
                <p className="text-gray-600">
                  {job ? `Matches for: ${job.jobTitle}` : 'Loading job details...'}
                </p>
              </div>
              <Link
                href="/dashboard"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                ← Back to Dashboard
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {error ? (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <p className="mt-1 text-sm text-red-700">{error}</p>
                  <button
                    onClick={() => fetchMatches(1)}
                    className="mt-2 text-sm text-red-600 hover:text-red-500"
                  >
                    Try again
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Match Summary */}
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Found {totalMatches} potential matches
                    </h2>
                    <p className="text-sm text-gray-600">
                      Showing top {Math.min(matches.length, MAX_MATCHES)} matches using AI-powered matching
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="w-3 h-3 bg-green-100 rounded-full mr-2"></span>
                      Excellent (80%+)
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="w-3 h-3 bg-yellow-100 rounded-full mr-2"></span>
                      Good (60-79%)
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="w-3 h-3 bg-red-100 rounded-full mr-2"></span>
                      Fair (Below 60%)
                    </div>
                  </div>
                </div>
              </div>

              {/* Matches List */}
              {matches.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No matches found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Try adjusting your job requirements or check back later for new helpers.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {matches.map((match, index) => (
                    <div key={match.helper.id} className="bg-white rounded-lg shadow p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                              {match.helper.profilePicture ? (
                                <img
                                  className="h-12 w-12 rounded-full object-cover"
                                  src={match.helper.profilePicture}
                                  alt={match.helper.fullName}
                                />
                              ) : (
                                <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center">
                                  <span className="text-sm font-medium text-gray-700">
                                    {match.helper.fullName?.charAt(0) || '?'}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-medium text-gray-900">
                                {match.helper.fullName}
                              </h3>
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span>Age: {match.helper.age}</span>
                                <span>From: {match.helper.nationality}</span>
                                {match.helper.religion && <span>Religion: {match.helper.religion}</span>}
                                {match.helper.isVerified && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                    ✓ Verified
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Skills */}
                          {match.helper.relevantSkills && (
                            <div className="mt-4">
                              <h4 className="text-sm font-medium text-gray-900 mb-2">Skills & Experience</h4>
                              <p className="text-sm text-gray-600 line-clamp-2">
                                {match.helper.relevantSkills}
                              </p>
                            </div>
                          )}

                          {/* Match Reasons */}
                          {match.matchReasons && match.matchReasons.length > 0 && (
                            <div className="mt-4">
                              <h4 className="text-sm font-medium text-gray-900 mb-2">Why this is a good match</h4>
                              <div className="flex flex-wrap gap-2">
                                {match.matchReasons.map((reason, idx) => (
                                  <span
                                    key={idx}
                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                  >
                                    {reason}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Detailed Score Breakdown */}
                          {match.scoreBreakdown && (
                            <div className="mt-4">
                              <details className="group">
                                <summary className="cursor-pointer text-sm font-medium text-gray-900 hover:text-indigo-600">
                                  📊 View Detailed Scoring Breakdown
                                </summary>
                                <div className="mt-3 p-3 bg-gray-50 rounded-lg text-xs space-y-2">
                                  {Object.entries(match.scoreBreakdown).map(([factor, data]) => (
                                    <div key={factor} className="flex justify-between items-start">
                                      <div className="flex-1">
                                        <div className="flex items-center space-x-2">
                                          <span className="font-medium capitalize text-gray-800">{factor}:</span>
                                          <span className="text-gray-600">{data.score}% (weight: {data.weight}%)</span>
                                        </div>
                                        <div className="text-gray-500 mt-1">{data.details}</div>
                                      </div>
                                      <div className="ml-2">
                                        <div className="w-16 bg-gray-200 rounded-full h-2">
                                          <div 
                                            className={`h-2 rounded-full ${
                                              data.score >= 80 ? 'bg-green-500' : 
                                              data.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                            }`}
                                            style={{ width: `${data.score}%` }}
                                          ></div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                  <div className="pt-2 mt-3 border-t border-gray-300">
                                    <div className="text-sm font-medium text-gray-800">
                                      Enhanced Score Calculation:
                                    </div>
                                    <div className="text-xs text-gray-600 mt-1">
                                      Base Score: {match.baseScore || match.score}%
                                      {match.compensationScore > 0 && (
                                        <> + Compensation: {match.compensationScore}%</>
                                      )}
                                      {match.personalizedScore && (
                                        <> + AI Personalization: {match.personalizedScore}%</>
                                      )}
                                      {' = Final: '}{match.finalScore || match.score}%
                                    </div>
                                    {match.appliedRules && match.appliedRules.length > 0 && (
                                      <div className="mt-2">
                                        <div className="text-xs font-medium text-gray-700">Applied Rules:</div>
                                        <div className="text-xs text-gray-600">
                                          {match.appliedRules.map((rule, idx) => (
                                            <div key={idx}>• {rule.reason} (+{rule.adjustment * 100}%)</div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </details>
                            </div>
                          )}
                        </div>

                        {/* Enhanced Match Score */}
                        <div className="flex-shrink-0 ml-6">
                          <div className="text-center">
                            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getMatchScoreColor(match.finalScore || match.score || match.similarity)}`}>
                              {match.finalScore || match.score || match.similarity}% Match
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {getMatchScoreLabel(match.finalScore || match.score || match.similarity)}
                            </p>
                            {match.isPersonalized && (
                              <p className="text-xs text-purple-600 mt-1">
                                🤖 AI Personalized
                              </p>
                            )}
                            {match.helper.profileCompleteness && (
                              <p className="text-xs text-gray-400 mt-1">
                                {match.helper.profileCompleteness}% Complete Profile
                              </p>
                            )}
                            {match.compensationScore > 0 && (
                              <p className="text-xs text-blue-600 mt-1">
                                +{match.compensationScore}% Bonus
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons with Click Tracking */}
                      <div className="mt-6 flex space-x-3">
                        <button 
                          onClick={() => handleHelperClick(match.helper, 'view_profile')}
                          className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          View Full Profile
                        </button>
                        <button 
                          onClick={() => handleHelperClick(match.helper, 'contact')}
                          className="flex-1 bg-white text-indigo-600 border border-indigo-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Contact Helper
                        </button>
                        <button 
                          onClick={() => handleHelperClick(match.helper, 'favorite')}
                          className="px-4 py-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          title="Add to Favorites"
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Load More Button */}
              {hasMore && matches.length < MAX_MATCHES && (
                <div className="mt-8 text-center">
                  <button
                    onClick={loadMoreMatches}
                    disabled={loadingMore}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loadingMore ? (
                      <>
                        <div className="animate-spin -ml-1 mr-3 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                        Loading more matches...
                      </>
                    ) : (
                      `Load Next ${Math.min(MATCHES_PER_PAGE, MAX_MATCHES - matches.length)} Matches`
                    )}
                  </button>
                  <p className="mt-2 text-sm text-gray-500">
                    Showing {matches.length} of {Math.min(totalMatches, MAX_MATCHES)} matches
                  </p>
                </div>
              )}

              {matches.length >= MAX_MATCHES && (
                <div className="mt-8 text-center">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                    <p className="text-sm text-yellow-800">
                      You've reached the maximum of 50 matches. These are the best matches for your job posting.
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </AuthGuard>
  );
}
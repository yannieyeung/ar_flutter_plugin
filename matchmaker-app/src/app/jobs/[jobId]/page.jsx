'use client';

import { useState, useEffect, use } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AuthGuard } from '@/components/AuthGuard';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ViewJobPage({ params }) {
  const { user } = useAuth();
  const router = useRouter();
  const { jobId } = use(params);
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (jobId) {
      fetchJob();
    }
  }, [jobId]);

  const fetchJob = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/jobs/${jobId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch job');
      }

      const jobData = await response.json();
      
      // Check if user owns this job
      if (user?.uid !== jobData.employerId) {
        setError('You can only view your own job postings');
        return;
      }
      
      setJob(jobData);
      
      // Debug: Log job data structure to help identify problematic fields
      console.log('Job data structure:', jobData);
      Object.entries(jobData).forEach(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
          console.log(`${key}:`, value);
        }
      });
    } catch (error) {
      console.error('Error fetching job:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatSalary = (salary) => {
    if (!salary) return 'Not specified';
    return `${salary.currency?.toUpperCase() || 'USD'} ${salary.amount || 0}`;
  };

  const formatObjectValue = (value) => {
    try {
      if (!value) return 'Not specified';
      if (typeof value === 'string') return value;
      if (typeof value === 'number') return value.toString();
      if (typeof value === 'boolean') return value ? 'Yes' : 'No';
      if (Array.isArray(value)) return value.length > 0 ? value.join(', ') : 'None specified';
      if (typeof value === 'object') {
        // Handle object values by converting to readable format
        const entries = Object.entries(value)
          .filter(([key, val]) => val !== null && val !== undefined && val !== '')
          .map(([key, val]) => {
            const readableKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            try {
              if (typeof val === 'boolean') return `${readableKey}: ${val ? 'Yes' : 'No'}`;
              if (Array.isArray(val)) return `${readableKey}: ${val.join(', ')}`;
              if (typeof val === 'object') return `${readableKey}: ${JSON.stringify(val)}`;
              return `${readableKey}: ${val}`;
            } catch (e) {
              return `${readableKey}: [Complex Value]`;
            }
          });
        return entries.length > 0 ? entries.join(' | ') : 'Not specified';
      }
      return String(value);
    } catch (error) {
      console.error('Error formatting value:', value, error);
      return 'Unable to display value';
    }
  };

  const SafeRenderer = ({ children }) => {
    try {
      return <>{children}</>;
    } catch (error) {
      console.error('Safe renderer error:', error);
      return <span className="text-red-500 text-sm">Error displaying content</span>;
    }
  };

  if (loading) {
    return (
      <AuthGuard requireRegistration={true}>
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading job details...</p>
          </div>
        </div>
      </AuthGuard>
    );
  }

  if (error) {
    return (
      <AuthGuard requireRegistration={true}>
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-md p-6 max-w-md">
              <h3 className="text-lg font-medium text-red-800 mb-2">Error</h3>
              <p className="text-red-700">{error}</p>
              <Link
                href="/dashboard"
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                ← Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </AuthGuard>
    );
  }

  if (!job) {
    return (
      <AuthGuard requireRegistration={true}>
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Job Not Found</h3>
            <p className="text-gray-600 mb-4">The job posting you're looking for doesn't exist.</p>
            <Link
              href="/dashboard"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              ← Back to Dashboard
            </Link>
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
                <h1 className="text-3xl font-bold text-gray-900">Job Details</h1>
                <p className="text-gray-600">View your job posting details</p>
              </div>
              <div className="flex space-x-3">
                <Link
                  href={`/jobs/${jobId}/edit`}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  ✏️ Edit Job
                </Link>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  ← Back to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg">
            {/* Job Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{job.jobTitle}</h2>
                  <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      📍 {job.location?.city}, {job.location?.country}
                    </span>
                    <span className="flex items-center">
                      💰 {formatSalary(job.salary)}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      job.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {job.status}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Posted on</p>
                  <p className="text-sm font-medium text-gray-900">{formatDate(job.datePosted)}</p>
                </div>
              </div>
            </div>

            {/* Job Content */}
            <div className="px-6 py-6 space-y-6">
              {/* Job Description */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Job Description</h3>
                <div className="prose prose-sm max-w-none">
                  <SafeRenderer>
                    <p className="text-gray-700 whitespace-pre-wrap">{formatObjectValue(job.jobDescription)}</p>
                  </SafeRenderer>
                </div>
              </div>

              {/* Job Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Start Date</label>
                      <p className="mt-1 text-sm text-gray-900">{formatDate(job.startDate)}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Urgency</label>
                      <p className="mt-1 text-sm text-gray-900 capitalize">{job.urgency?.replace('_', ' ') || 'Not specified'}</p>
                    </div>
                    
                    {job.category && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Category</label>
                        <p className="mt-1 text-sm text-gray-900">{job.category}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Household Information */}
                {job.householdInfo && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Household Information</h3>
                    
                    <div className="space-y-3">
                      {job.householdInfo.adultsCount !== undefined && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Adults</label>
                          <p className="mt-1 text-sm text-gray-900">{formatObjectValue(job.householdInfo.adultsCount)}</p>
                        </div>
                      )}
                      
                      {job.householdInfo.childrenCount !== undefined && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Children</label>
                          <p className="mt-1 text-sm text-gray-900">{formatObjectValue(job.householdInfo.childrenCount)}</p>
                        </div>
                      )}
                      
                      {job.householdInfo.petsCount !== undefined && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Pets</label>
                          <p className="mt-1 text-sm text-gray-900">{formatObjectValue(job.householdInfo.petsCount)}</p>
                        </div>
                      )}
                      
                      {job.householdInfo.houseType && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">House Type</label>
                          <p className="mt-1 text-sm text-gray-900">{formatObjectValue(job.householdInfo.houseType)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Working Conditions */}
              {job.workingConditions && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Working Conditions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {job.workingConditions.workingDays !== undefined && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Working Days per Week</label>
                        <p className="mt-1 text-sm text-gray-900">{formatObjectValue(job.workingConditions.workingDays)}</p>
                      </div>
                    )}
                    
                    {job.workingConditions.restDays !== undefined && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Rest Days per Week</label>
                        <p className="mt-1 text-sm text-gray-900">{formatObjectValue(job.workingConditions.restDays)}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Requirements */}
              {job.requirements && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Requirements</h3>
                  <div className="prose prose-sm max-w-none">
                    <p className="text-gray-700 whitespace-pre-wrap">{formatObjectValue(job.requirements)}</p>
                  </div>
                </div>
              )}

              {/* Additional Job Details */}
              {Object.keys(job).some(key => 
                !['id', 'jobTitle', 'jobDescription', 'location', 'salary', 'startDate', 'urgency', 'category', 'requirements', 'householdInfo', 'workingConditions', 'status', 'datePosted', 'lastUpdated', 'views', 'applicationsCount', 'employerId'].includes(key) &&
                job[key] && typeof job[key] === 'object'
              ) && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Additional Details</h3>
                  <div className="space-y-3">
                    {Object.entries(job)
                      .filter(([key, value]) => 
                        !['id', 'jobTitle', 'jobDescription', 'location', 'salary', 'startDate', 'urgency', 'category', 'requirements', 'householdInfo', 'workingConditions', 'status', 'datePosted', 'lastUpdated', 'views', 'applicationsCount', 'employerId'].includes(key) &&
                        value && typeof value === 'object'
                      )
                      .map(([key, value]) => (
                        <div key={key}>
                          <label className="block text-sm font-medium text-gray-700">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </label>
                          <p className="mt-1 text-sm text-gray-900">{formatObjectValue(value)}</p>
                        </div>
                      ))
                    }
                  </div>
                </div>
              )}

              {/* Statistics */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Job Statistics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-indigo-600">{job.views || 0}</p>
                    <p className="text-sm text-gray-600">Views</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{job.applicationsCount || 0}</p>
                    <p className="text-sm text-gray-600">Applications</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-900">{formatDate(job.datePosted)}</p>
                    <p className="text-sm text-gray-600">Posted</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-900">{formatDate(job.lastUpdated)}</p>
                    <p className="text-sm text-gray-600">Last Updated</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
              <div className="flex space-x-3">
                <Link
                  href={`/matches/${jobId}`}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                >
                  🎯 Find Matches
                </Link>
                <Link
                  href={`/jobs/${jobId}/edit`}
                  className="inline-flex items-center px-4 py-2 border border-indigo-600 text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
                >
                  ✏️ Edit Job
                </Link>
              </div>
              
              <div className="text-sm text-gray-500">
                Job ID: {job.id}
              </div>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
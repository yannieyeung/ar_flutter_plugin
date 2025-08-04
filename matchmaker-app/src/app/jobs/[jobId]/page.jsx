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

  // Component to render care requirements with special formatting
  const CareRequirementRenderer = ({ obj, title }) => {
    if (!obj || typeof obj !== 'object') return null;
    
    const isRequired = obj.required;
    const importance = obj.importance || 'medium';
    const importanceColors = {
      low: 'bg-gray-100 text-gray-700',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800'
    };

    // Determine if there are actually people in this category
    const hasInfants = obj.numberOfInfants > 0;
    const hasChildren = obj.numberOfChildren > 0;
    const hasElderly = obj.numberOfElderly > 0;
    const hasAnyPeople = hasInfants || hasChildren || hasElderly;
    
    // If no people in this category, show simplified "Not Applicable" card
    if (!hasAnyPeople) {
      return (
        <div className="p-3 rounded-lg border border-gray-300 bg-gray-50">
          <div className="flex justify-between items-center">
            <h4 className="font-medium text-gray-700">{title}</h4>
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-600">
              Not Applicable
            </span>
          </div>
          <div className="text-sm text-gray-500 mt-1 italic">
            No {title.toLowerCase().replace('care of ', '')} in this household
          </div>
        </div>
      );
    }

    // For households with people in this category, show full details
    return (
      <div className={`p-4 rounded-lg border-2 ${isRequired ? 'border-green-200 bg-green-50' : 'border-blue-200 bg-blue-50'}`}>
        <div className="flex justify-between items-start mb-3">
          <h4 className="font-semibold text-gray-900">{title}</h4>
          <div className="flex gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${isRequired ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
              {isRequired ? 'Care Required' : 'Care Optional'}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${importanceColors[importance]}`}>
              {importance.charAt(0).toUpperCase() + importance.slice(1)} Priority
            </span>
          </div>
        </div>
        
        {/* Household Composition */}
        <div className="mb-3 p-3 bg-white rounded border">
          <h5 className="text-sm font-medium text-gray-800 mb-2">👥 Household Composition</h5>
          <div className="space-y-1">
            {obj.numberOfInfants > 0 && (
              <div className="text-sm flex justify-between">
                <span className="text-gray-600">Number of Infants:</span>
                <span className="font-medium">{obj.numberOfInfants}</span>
              </div>
            )}
            {obj.numberOfChildren > 0 && (
              <div className="text-sm flex justify-between">
                <span className="text-gray-600">Number of Children:</span>
                <span className="font-medium">{obj.numberOfChildren}</span>
              </div>
            )}
            {obj.numberOfElderly > 0 && (
              <div className="text-sm flex justify-between">
                <span className="text-gray-600">Number of Elderly:</span>
                <span className="font-medium">{obj.numberOfElderly}</span>
              </div>
            )}
            {obj.ageRangeMonths && obj.ageRangeMonths.length > 0 && (
              <div className="text-sm flex justify-between">
                <span className="text-gray-600">Age Range:</span>
                <span className="font-medium">{obj.ageRangeMonths.join('-')} months</span>
              </div>
            )}
            {obj.ageRangeYears && obj.ageRangeYears.length > 0 && (
              <div className="text-sm flex justify-between">
                <span className="text-gray-600">Age Range:</span>
                <span className="font-medium">{obj.ageRangeYears.join('-')} years</span>
              </div>
            )}
          </div>
        </div>

        {/* Care Requirements (only show if care is required or has specific needs) */}
        {(isRequired || obj.schoolSupport || obj.mobilityAssistance || obj.medicationManagement || obj.disabilityType || obj.specificNeeds) && (
          <div className="p-3 bg-white rounded border">
            <h5 className="text-sm font-medium text-gray-800 mb-2">📋 Care Requirements</h5>
            <div className="space-y-2">
              {obj.schoolSupport && (
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    📚 School Support Required
                  </span>
                </div>
              )}
              {obj.mobilityAssistance && (
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                    🦽 Mobility Assistance
                  </span>
                </div>
              )}
              {obj.medicationManagement && (
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                    💊 Medication Management
                  </span>
                </div>
              )}
              {obj.disabilityType && (
                <div className="text-sm">
                  <span className="font-medium text-gray-700">Disability Type:</span> 
                  <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs">{obj.disabilityType}</span>
                </div>
              )}
              {obj.specificNeeds && (
                <div className="text-sm p-2 bg-yellow-50 rounded border-l-4 border-yellow-200">
                  <span className="font-medium text-gray-700">Specific Requirements:</span>
                  <p className="mt-1 text-gray-600">{obj.specificNeeds}</p>
                </div>
              )}
              {isRequired && !obj.schoolSupport && !obj.mobilityAssistance && !obj.medicationManagement && !obj.disabilityType && !obj.specificNeeds && (
                <div className="text-sm text-gray-600 italic">
                  General care required (no specific requirements listed)
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Component to render complex objects in a user-friendly way
  const ObjectRenderer = ({ obj }) => {
    if (!obj || typeof obj !== 'object') return <span className="text-gray-500 italic">Not specified</span>;

    const renderValue = (key, val) => {
      if (val === null || val === undefined || val === '') return null;
      
      const readableKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
      
      if (typeof val === 'boolean') {
        return (
          <div key={key} className="flex justify-between items-center py-1.5 px-3 bg-white rounded border-l-4 border-blue-200">
            <span className="text-gray-700 font-medium">{readableKey}</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${val ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {val ? 'Required' : 'Not Required'}
            </span>
          </div>
        );
      }
      
      if (Array.isArray(val)) {
        if (val.length === 0) return null;
        return (
          <div key={key} className="py-1.5 px-3 bg-white rounded border-l-4 border-green-200">
            <div className="text-gray-700 font-medium mb-1">{readableKey}</div>
            <div className="flex flex-wrap gap-1">
              {val.map((item, idx) => (
                <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                  {String(item)}
                </span>
              ))}
            </div>
          </div>
        );
      }
      
      if (typeof val === 'object') {
        return (
          <div key={key} className="py-2 px-3 bg-gray-50 rounded border-l-4 border-purple-200">
            <div className="text-gray-800 font-semibold mb-2 text-sm">{readableKey}</div>
            <div className="ml-2">
              <ObjectRenderer obj={val} />
            </div>
          </div>
        );
      }
      
      return (
        <div key={key} className="flex justify-between items-center py-1.5 px-3 bg-white rounded border-l-4 border-gray-200">
          <span className="text-gray-700 font-medium">{readableKey}</span>
          <span className="text-gray-900 font-semibold text-right max-w-xs break-words">
            {String(val)}
          </span>
        </div>
      );
    };

    const entries = Object.entries(obj)
      .map(([key, val]) => renderValue(key, val))
      .filter(Boolean);

    if (entries.length === 0) return <span className="text-gray-500 italic">No details specified</span>;

    return (
      <div className="space-y-2">
        {entries}
      </div>
    );
  };

  const formatObjectValue = (value) => {
    try {
      if (!value) return <span className="text-gray-500 italic">Not specified</span>;
      if (typeof value === 'string') return value || <span className="text-gray-500 italic">Not specified</span>;
      if (typeof value === 'number') return value.toString();
      if (typeof value === 'boolean') return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {value ? 'Yes' : 'No'}
        </span>
      );
      if (Array.isArray(value)) {
        if (value.length === 0) return <span className="text-gray-500 italic">None specified</span>;
        return (
          <div className="flex flex-wrap gap-1">
            {value.map((item, idx) => (
              <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                {String(item)}
              </span>
            ))}
          </div>
        );
      }
      if (typeof value === 'object') {
        return <ObjectRenderer obj={value} />;
      }
      return String(value);
    } catch (error) {
      console.error('Error formatting value:', value, error);
      return <span className="text-red-500 text-sm">Unable to display value</span>;
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
                    <div className="text-gray-700 whitespace-pre-wrap">{formatObjectValue(job.jobDescription)}</div>
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
                          <div className="mt-1 text-sm text-gray-900">{formatObjectValue(job.householdInfo.adultsCount)}</div>
                        </div>
                      )}
                      
                      {job.householdInfo.childrenCount !== undefined && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Children</label>
                          <div className="mt-1 text-sm text-gray-900">{formatObjectValue(job.householdInfo.childrenCount)}</div>
                        </div>
                      )}
                      
                      {job.householdInfo.petsCount !== undefined && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Pets</label>
                          <div className="mt-1 text-sm text-gray-900">{formatObjectValue(job.householdInfo.petsCount)}</div>
                        </div>
                      )}
                      
                      {job.householdInfo.houseType && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">House Type</label>
                          <div className="mt-1 text-sm text-gray-900">{formatObjectValue(job.householdInfo.houseType)}</div>
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
                        <div className="mt-1 text-sm text-gray-900">{formatObjectValue(job.workingConditions.workingDays)}</div>
                      </div>
                    )}
                    
                    {job.workingConditions.restDays !== undefined && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Rest Days per Week</label>
                        <div className="mt-1 text-sm text-gray-900">{formatObjectValue(job.workingConditions.restDays)}</div>
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
                    <div className="text-gray-700 whitespace-pre-wrap">{formatObjectValue(job.requirements)}</div>
                  </div>
                </div>
              )}

              {/* Additional Job Details */}
              {Object.keys(job).some(key => 
                !['id', 'jobTitle', 'jobDescription', 'location', 'salary', 'startDate', 'urgency', 'category', 'requirements', 'householdInfo', 'workingConditions', 'status', 'datePosted', 'lastUpdated', 'views', 'applicationsCount', 'employerId'].includes(key) &&
                job[key] && typeof job[key] === 'object'
              ) && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Care Requirements & Household Details</h3>
                  <div className="space-y-4">
                    {Object.entries(job)
                      .filter(([key, value]) => 
                        !['id', 'jobTitle', 'jobDescription', 'location', 'salary', 'startDate', 'urgency', 'category', 'requirements', 'householdInfo', 'workingConditions', 'status', 'datePosted', 'lastUpdated', 'views', 'applicationsCount', 'employerId'].includes(key) &&
                        value && typeof value === 'object'
                      )
                      .map(([key, value]) => {
                        const title = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                        
                        // Use specialized renderer for care requirements
                        if (key.toLowerCase().includes('care') || key.toLowerCase().includes('of')) {
                          return <CareRequirementRenderer key={key} obj={value} title={title} />;
                        }
                        
                        // Default renderer for other complex objects
                        return (
                          <div key={key} className="bg-white p-4 rounded-lg border border-gray-200">
                            <h4 className="font-semibold text-gray-900 mb-3">{title}</h4>
                            {formatObjectValue(value)}
                          </div>
                        );
                      })
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
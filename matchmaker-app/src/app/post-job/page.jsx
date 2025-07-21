'use client';

import { useAuth } from '@/contexts/AuthContext';
import { AuthGuard } from '@/components/AuthGuard';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import MultiStepJobPosting from '@/components/MultiStepJobPosting';
import { ClientUserService } from '@/lib/db-client';

export default function PostJobPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  // Check if user is an employer
  const isEmployer = user?.userType === 'employer';

  const handleJobSubmit = async (jobData) => {
    if (!user?.uid) {
      setSubmitMessage('User authentication required. Please sign in again.');
      return;
    }

    if (!isEmployer) {
      setSubmitMessage('Only employers can post jobs. Please check your account type.');
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      // Prepare job data with employer information
      const jobPostData = {
        ...jobData,
        employerId: user.uid,
        employerName: user.fullName || user.companyName || 'Unknown',
        employerCompany: user.companyName || '',
        employerLocation: user.location || '',
        employerEmail: user.email || '',
        employerPhone: user.phoneNumber || '',
        postedAt: new Date().toISOString(),
        status: 'active',
        applications: [],
        views: 0,
        // Add metadata for tracking
        metadata: {
          formVersion: '2.0',
          mlOptimized: true,
          source: 'web_app',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      };

      // Save job posting to database
      await ClientUserService.createJobPosting(jobPostData);
      
      setSubmitMessage('Job posted successfully! 🎉');
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);

    } catch (error) {
      console.error('Job posting error:', error);
      setSubmitMessage('Failed to post job. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show access denied for non-employers
  if (user && !isEmployer) {
    return (
      <AuthGuard requireRegistration={true}>
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto">
            <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="mt-2 text-lg font-medium text-gray-900">Access Denied</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Only employers can post jobs. Your account type is: {user.userType?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </p>
                <div className="mt-6">
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Go to Dashboard
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard requireRegistration={true}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="flex items-center text-gray-600 hover:text-gray-900"
                >
                  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Dashboard
                </button>
              </div>
              <div className="text-right">
                <h1 className="text-2xl font-bold text-gray-900">Post a Job</h1>
                <p className="text-gray-600">Find the perfect helper for your needs</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 sm:px-0">
            
            {/* Success/Error Message */}
            {submitMessage && (
              <div className={`mb-6 p-4 rounded-md ${
                submitMessage.includes('successfully') 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <p className={`text-sm font-medium ${
                  submitMessage.includes('successfully') 
                    ? 'text-green-800' 
                    : 'text-red-800'
                }`}>
                  {submitMessage}
                </p>
              </div>
            )}

            {/* Employer Info Banner */}
            {isEmployer && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">
                      Posting as: {user.fullName || user.companyName || 'Employer'}
                    </h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>Your job posting will be optimized using AI to find the best matches from our helper database.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Job Posting Form */}
            <MultiStepJobPosting 
              onSubmit={handleJobSubmit}
              isLoading={isSubmitting}
            />
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
'use client';

import { useState, useEffect, use } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AuthGuard } from '@/components/AuthGuard';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function EditJobPage({ params }) {
  const { user } = useAuth();
  const router = useRouter();
  const { jobId } = use(params);
  
  const [job, setJob] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

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
        setError('You can only edit your own job postings');
        return;
      }
      
      setJob(jobData);
      
      // Initialize form data
      setFormData({
        jobTitle: jobData.jobTitle || '',
        jobDescription: jobData.jobDescription || '',
        location: {
          city: jobData.location?.city || '',
          country: jobData.location?.country || ''
        },
        salary: {
          amount: jobData.salary?.amount || '',
          currency: jobData.salary?.currency || 'SGD'
        },
        startDate: jobData.startDate ? jobData.startDate.split('T')[0] : '',
        urgency: jobData.urgency || 'flexible',
        category: jobData.category || '',
        requirements: jobData.requirements || '',
        householdInfo: {
          adultsCount: jobData.householdInfo?.adultsCount || 0,
          childrenCount: jobData.householdInfo?.childrenCount || 0,
          petsCount: jobData.householdInfo?.petsCount || 0,
          houseType: jobData.householdInfo?.houseType || ''
        },
        workingConditions: {
          workingDays: jobData.workingConditions?.workingDays || 6,
          restDays: jobData.workingConditions?.restDays || 1
        }
      });
    } catch (error) {
      console.error('Error fetching job:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.jobTitle?.trim()) {
      newErrors.jobTitle = 'Job title is required';
    }

    if (!formData.jobDescription?.trim()) {
      newErrors.jobDescription = 'Job description is required';
    }

    if (!formData.location?.city?.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.location?.country?.trim()) {
      newErrors.country = 'Country is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.salary?.amount || formData.salary.amount <= 0) {
      newErrors.salaryAmount = 'Valid salary amount is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value, nested = null) => {
    if (nested) {
      setFormData(prev => ({
        ...prev,
        [nested]: {
          ...prev[nested],
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    setError(null);
    setSuccessMessage('');

    try {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          employerId: user.uid
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update job');
      }

      const updatedJob = await response.json();
      setJob(updatedJob);
      setSuccessMessage('Job updated successfully!');
      
      // Redirect to view page after a short delay
      setTimeout(() => {
        router.push(`/jobs/${jobId}`);
      }, 1500);

    } catch (error) {
      console.error('Error updating job:', error);
      setError(error.message);
    } finally {
      setSaving(false);
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

  return (
    <AuthGuard requireRegistration={true}>
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Edit Job</h1>
                <p className="text-gray-600">Update your job posting details</p>
              </div>
              <div className="flex space-x-3">
                <Link
                  href={`/jobs/${jobId}`}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  ← Back to Job
                </Link>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">{successMessage}</p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white shadow rounded-lg">
            <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.jobTitle || ''}
                      onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., Domestic Helper for Family with Young Children"
                    />
                    {errors.jobTitle && <p className="text-red-500 text-sm mt-1">{errors.jobTitle}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={formData.jobDescription || ''}
                      onChange={(e) => handleInputChange('jobDescription', e.target.value)}
                      rows="4"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Describe the job responsibilities, family environment, and what you're looking for..."
                    />
                    {errors.jobDescription && <p className="text-red-500 text-sm mt-1">{errors.jobDescription}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.location?.city || ''}
                        onChange={(e) => handleInputChange('city', e.target.value, 'location')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Enter city name"
                      />
                      {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.location?.country || ''}
                        onChange={(e) => handleInputChange('country', e.target.value, 'location')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Enter country name"
                      />
                      {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={formData.startDate || ''}
                        onChange={(e) => handleInputChange('startDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Urgency</label>
                      <select
                        value={formData.urgency || 'flexible'}
                        onChange={(e) => handleInputChange('urgency', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="immediate">Immediate (within 1 week)</option>
                        <option value="within_week">Within 2 weeks</option>
                        <option value="within_month">Within a month</option>
                        <option value="flexible">Flexible timing</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <select
                        value={formData.category || ''}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="">Select category</option>
                        <option value="domestic_helper">Domestic Helper</option>
                        <option value="nanny">Nanny</option>
                        <option value="elderly_care">Elderly Care</option>
                        <option value="housekeeper">Housekeeper</option>
                        <option value="cook">Cook</option>
                        <option value="driver">Driver</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Salary Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Salary Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amount <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.salary?.amount || ''}
                      onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || '', 'salary')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Enter salary amount"
                    />
                    {errors.salaryAmount && <p className="text-red-500 text-sm mt-1">{errors.salaryAmount}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                    <select
                      value={formData.salary?.currency || 'SGD'}
                      onChange={(e) => handleInputChange('currency', e.target.value, 'salary')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="SGD">SGD</option>
                      <option value="USD">USD</option>
                      <option value="MYR">MYR</option>
                      <option value="HKD">HKD</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Household Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Household Information</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Adults</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.householdInfo?.adultsCount || 0}
                      onChange={(e) => handleInputChange('adultsCount', parseInt(e.target.value) || 0, 'householdInfo')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Children</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.householdInfo?.childrenCount || 0}
                      onChange={(e) => handleInputChange('childrenCount', parseInt(e.target.value) || 0, 'householdInfo')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pets</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.householdInfo?.petsCount || 0}
                      onChange={(e) => handleInputChange('petsCount', parseInt(e.target.value) || 0, 'householdInfo')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">House Type</label>
                    <select
                      value={formData.householdInfo?.houseType || ''}
                      onChange={(e) => handleInputChange('houseType', e.target.value, 'householdInfo')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Select type</option>
                      <option value="apartment">Apartment</option>
                      <option value="house">House</option>
                      <option value="condo">Condominium</option>
                      <option value="hdb">HDB</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Working Conditions */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Working Conditions</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Working Days per Week</label>
                    <input
                      type="number"
                      min="1"
                      max="7"
                      value={formData.workingConditions?.workingDays || 6}
                      onChange={(e) => handleInputChange('workingDays', parseInt(e.target.value) || 6, 'workingConditions')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rest Days per Week</label>
                    <input
                      type="number"
                      min="0"
                      max="6"
                      value={formData.workingConditions?.restDays || 1}
                      onChange={(e) => handleInputChange('restDays', parseInt(e.target.value) || 1, 'workingConditions')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Requirements */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Requirements</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Additional Requirements</label>
                  <textarea
                    value={formData.requirements || ''}
                    onChange={(e) => handleInputChange('requirements', e.target.value)}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Any specific requirements, preferences, or things helpers should know..."
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                <Link
                  href={`/jobs/${jobId}`}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </Link>
                
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin -ml-1 mr-3 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
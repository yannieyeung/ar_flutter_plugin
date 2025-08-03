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

  // Constants for dropdowns
  const HOUSE_TYPES = [
    'Studio Apartment', 'One Bedroom Apartment', 'Two Bedroom Apartment', 'Three Bedroom Apartment',
    'Four Bedroom Apartment', 'Five Bedroom Apartment', '2-Storey House', '3-Storey House', '4-Storey House', 'Others'
  ];

  const LANGUAGES = [
    'English', 'Mandarin', 'Cantonese', 'Malay', 'Tamil', 'Hindi',
    'Tagalog', 'Indonesian', 'Burmese', 'Sinhalese', 'Thai', 'Vietnamese',
    'Arabic', 'French', 'German', 'Spanish', 'Japanese', 'Korean', 'Other'
  ];

  const NATIONALITIES = [
    'Philippines', 'Indonesia', 'Myanmar', 'Sri Lanka', 'India', 'Bangladesh',
    'Thailand', 'Vietnam', 'Cambodia', 'Malaysia', 'China', 'Nepal', 'Other'
  ];

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
      
      // Initialize comprehensive form data
      setFormData({
        // Basic Information
        jobTitle: jobData.jobTitle || '',
        jobDescription: jobData.jobDescription || '',
        location: {
          city: jobData.location?.city || '',
          country: jobData.location?.country || ''
        },
        startDate: jobData.startDate ? jobData.startDate.split('T')[0] : '',
        urgency: jobData.urgency || 'flexible',
        category: jobData.category || '',
        
        // Employer Information
        employer: {
          householdSize: jobData.employer?.householdSize || '',
          houseType: jobData.employer?.houseType || '',
          culturalBackground: jobData.employer?.culturalBackground || '',
          householdLanguages: jobData.employer?.householdLanguages || [],
          hasInfants: jobData.employer?.hasInfants || false,
          hasChildren: jobData.employer?.hasChildren || false,
          hasElderly: jobData.employer?.hasElderly || false,
          hasDisabled: jobData.employer?.hasDisabled || false,
          hasPets: jobData.employer?.hasPets || false,
          workingParents: jobData.employer?.workingParents || false
        },
        
        // Care Requirements
        careOfInfant: jobData.careOfInfant || { required: false, numberOfInfants: 0, ageRangeMonths: [], importance: 'medium', specificNeeds: '' },
        careOfChildren: jobData.careOfChildren || { required: false, numberOfChildren: 0, ageRangeYears: [], importance: 'medium', specificNeeds: '', schoolSupport: false },
        careOfOldAge: jobData.careOfOldAge || { required: false, numberOfElderly: 0, mobilityAssistance: false, medicationManagement: false, importance: 'medium', specificNeeds: '' },
        careOfDisabled: jobData.careOfDisabled || { required: false, disabilityType: '', importance: 'medium', specificNeeds: '' },
        generalHousework: jobData.generalHousework || { required: false, householdSize: '', cleaningFrequency: '', importance: 'medium', specificTasks: [] },
        cooking: jobData.cooking || { required: false, cuisinePreferences: [], dietaryRestrictions: [], mealPreparation: [], importance: 'medium', specificNeeds: '' },
        
        // Work Requirements
        minimumExperience: jobData.minimumExperience || 1,
        helperExperienceRequired: jobData.helperExperienceRequired || false,
        specificExperienceNeeded: jobData.specificExperienceNeeded || '',
        educationLevel: jobData.educationLevel || 'primary',
        ageRange: jobData.ageRange || { min: 21, max: 50 },
        nationalityPreferences: jobData.nationalityPreferences || [],
        religionPreference: jobData.religionPreference || '',
        languagesRequired: jobData.languagesRequired || [],
        communicationSkills: jobData.communicationSkills || 'basic',
        physicalRequirements: jobData.physicalRequirements || { noAllergies: false, noMedicalIssues: false, noPhysicalDisabilities: false, specificHealthRequirements: '' },
        
        // Schedule & Working Conditions
        workingDays: jobData.workingDays || [],
        workingHours: jobData.workingHours || { start: '08:00', end: '18:00', flexible: false, overtimeExpected: false },
        liveIn: jobData.liveIn || 'required',
        offDaysRequired: jobData.offDaysRequired || 1,
        foodHandlingRequirements: Array.isArray(jobData.foodHandlingRequirements) ? jobData.foodHandlingRequirements.join(', ') : jobData.foodHandlingRequirements || '',
        dietaryAccommodations: Array.isArray(jobData.dietaryAccommodations) ? jobData.dietaryAccommodations.join(', ') : jobData.dietaryAccommodations || '',
        
        // Salary Information
        salary: {
          amount: jobData.salary?.amount || '',
          currency: jobData.salary?.currency || 'SGD',
          period: jobData.salary?.period || 'monthly',
          negotiable: jobData.salary?.negotiable || false,
          performanceBonus: jobData.salary?.performanceBonus || false,
          salaryRange: jobData.salary?.salaryRange || { min: '', max: '' },
          includesFood: jobData.salary?.includesFood || false,
          includesAccommodation: jobData.salary?.includesAccommodation || false,
          overtimePay: jobData.salary?.overtimePay || false
        },
        
        // Contract Terms
        contractDuration: jobData.contractDuration || '',
        probationPeriod: jobData.probationPeriod || '',
        trialPeriod: jobData.trialPeriod || false,
        trainingProvided: jobData.trainingProvided || false,
        
        // Matching Preferences
        matchingPreferences: {
          prioritizeExperience: jobData.matchingPreferences?.prioritizeExperience || 'medium',
          prioritizeLanguages: jobData.matchingPreferences?.prioritizeLanguages || 'medium',
          prioritizeNationality: jobData.matchingPreferences?.prioritizeNationality || 'low',
          culturalFit: jobData.matchingPreferences?.culturalFit || 'medium'
        },
        
        // Contact & Interview Preferences
        contact: {
          preferredMethod: jobData.contact?.preferredMethod || '',
          interviewMethod: jobData.contact?.interviewMethod || '',
          availableForInterview: jobData.contact?.availableForInterview || '',
          contactLanguage: jobData.contact?.contactLanguage || 'English'
        },
        
        // Additional Information
        specialRequirements: jobData.specialRequirements || '',
        additionalNotes: jobData.additionalNotes || '',
        requirements: jobData.requirements || '',
        additionalBenefits: jobData.additionalBenefits || '',
        workEnvironment: jobData.workEnvironment || '',
        familyValues: jobData.familyValues || ''
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

    // Basic Information Validation
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

    // Salary Validation
    if (!formData.salary?.amount || formData.salary.amount <= 0) {
      newErrors.salaryAmount = 'Valid salary amount is required';
    }

    // Employer Information Validation
    if (!formData.employer?.householdSize) {
      newErrors.householdSize = 'Household size is required';
    }
    if (!formData.employer?.houseType) {
      newErrors.houseType = 'House type is required';
    }
    if (!formData.employer?.culturalBackground?.trim()) {
      newErrors.culturalBackground = 'Cultural background is required';
    }
    if (!formData.employer?.householdLanguages || formData.employer.householdLanguages.length === 0) {
      newErrors.householdLanguages = 'At least one household language is required';
    }

    // Care Requirements Validation
    const hasAnyCareRequirement = 
      formData.careOfInfant?.required ||
      formData.careOfChildren?.required ||
      formData.careOfOldAge?.required ||
      formData.careOfDisabled?.required ||
      formData.generalHousework?.required ||
      formData.cooking?.required;
    
    if (!hasAnyCareRequirement) {
      newErrors.careRequirements = 'Please select at least one care requirement';
    }

    // Work Requirements Validation
    if (!formData.nationalityPreferences || formData.nationalityPreferences.length === 0) {
      newErrors.nationalityPreferences = 'Please select at least one nationality preference';
    }
    if (!formData.workingDays || formData.workingDays.length === 0) {
      newErrors.workingDays = 'Please select at least one working day';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value, nested = null, subNested = null) => {
    if (subNested) {
      setFormData(prev => ({
        ...prev,
        [nested]: {
          ...prev[nested],
          [subNested]: {
            ...prev[nested]?.[subNested],
            [field]: value
          }
        }
      }));
    } else if (nested) {
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

  const handleArrayChange = (field, value, checked, nested = null) => {
    const currentArray = nested ? (formData[nested]?.[field] || []) : (formData[field] || []);
    const newArray = checked
      ? [...currentArray, value]
      : currentArray.filter(item => item !== value);
    
    if (nested) {
      handleInputChange(field, newArray, nested);
    } else {
      handleInputChange(field, newArray);
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
          employerId: user.uid,
          lastUpdated: new Date().toISOString()
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
                <p className="text-gray-600">Update your comprehensive job posting details</p>
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

        <main className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
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
            <form onSubmit={handleSubmit} className="px-6 py-6 space-y-8">
              
              {/* 1. Basic Information */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                  📝 Basic Information
                </h3>
                
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
                        value={formData.urgency || ''}
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

              {/* 2. Household Information */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                  🏠 Household Information
                </h3>
                
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Household Size <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.employer?.householdSize || ''}
                        onChange={(e) => handleInputChange('householdSize', e.target.value, 'employer')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="">Select Size</option>
                        <option value="1">1 person</option>
                        <option value="2">2 people</option>
                        <option value="3">3 people</option>
                        <option value="4">4 people</option>
                        <option value="5">5 people</option>
                        <option value="6+">6+ people</option>
                      </select>
                      {errors.householdSize && <p className="text-red-500 text-sm mt-1">{errors.householdSize}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        House Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.employer?.houseType || ''}
                        onChange={(e) => handleInputChange('houseType', e.target.value, 'employer')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="">Select House Type</option>
                        {HOUSE_TYPES.map(houseType => (
                          <option key={houseType} value={houseType}>{houseType}</option>
                        ))}
                      </select>
                      {errors.houseType && <p className="text-red-500 text-sm mt-1">{errors.houseType}</p>}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cultural Background <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.employer?.culturalBackground || ''}
                      onChange={(e) => handleInputChange('culturalBackground', e.target.value, 'employer')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., Chinese, Indian, Malay, Western"
                    />
                    {errors.culturalBackground && <p className="text-red-500 text-sm mt-1">{errors.culturalBackground}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Household Languages <span className="text-red-500">*</span>
                    </label>
                    <p className="text-sm text-gray-500 mb-2">Select languages spoken in your household</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {LANGUAGES.map(language => (
                        <label key={language} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={(formData.employer?.householdLanguages || []).includes(language)}
                            onChange={(e) => handleArrayChange('householdLanguages', language, e.target.checked, 'employer')}
                            className="mr-2"
                          />
                          {language}
                        </label>
                      ))}
                    </div>
                    {errors.householdLanguages && <p className="text-red-500 text-sm mt-1">{errors.householdLanguages}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Household Composition <span className="text-red-500">*</span>
                    </label>
                    <p className="text-sm text-gray-500 mb-2">Select all that apply to your household</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.employer?.hasInfants || false}
                          onChange={(e) => handleInputChange('hasInfants', e.target.checked, 'employer')}
                          className="mr-2"
                        />
                        Has Infants (0-12 months)
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.employer?.hasChildren || false}
                          onChange={(e) => handleInputChange('hasChildren', e.target.checked, 'employer')}
                          className="mr-2"
                        />
                        Has Children (1-12 years)
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.employer?.hasElderly || false}
                          onChange={(e) => handleInputChange('hasElderly', e.target.checked, 'employer')}
                          className="mr-2"
                        />
                        Has Elderly (65+ years)
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.employer?.hasDisabled || false}
                          onChange={(e) => handleInputChange('hasDisabled', e.target.checked, 'employer')}
                          className="mr-2"
                        />
                        Has Disabled Person
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.employer?.hasPets || false}
                          onChange={(e) => handleInputChange('hasPets', e.target.checked, 'employer')}
                          className="mr-2"
                        />
                        Has Pets
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.employer?.workingParents || false}
                          onChange={(e) => handleInputChange('workingParents', e.target.checked, 'employer')}
                          className="mr-2"
                        />
                        Working Parents
                      </label>
                    </div>
                    {errors.householdComposition && <p className="text-red-500 text-sm mt-1">{errors.householdComposition}</p>}
                  </div>
                </div>
              </div>

              {/* 3. Care Requirements */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                  👶 Care Requirements
                </h3>
                {errors.careRequirements && <p className="text-red-500 text-sm mb-4">{errors.careRequirements}</p>}
                
                <div className="space-y-6">
                  {/* Care of Infants */}
                  <div className="border rounded-lg p-6 bg-gray-50">
                    <label className="flex items-center mb-4">
                      <input
                        type="checkbox"
                        checked={formData.careOfInfant?.required || false}
                        onChange={(e) => handleInputChange('required', e.target.checked, 'careOfInfant')}
                        className="mr-3 scale-125"
                      />
                      <span className="text-lg font-medium text-gray-900">Care of Infants (0-12 months)</span>
                    </label>
                    
                    {formData.careOfInfant?.required && (
                      <div className="ml-6 space-y-4 bg-white p-4 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Number of Infants</label>
                            <select
                              value={formData.careOfInfant?.numberOfInfants || 0}
                              onChange={(e) => handleInputChange('numberOfInfants', parseInt(e.target.value), 'careOfInfant')}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                              <option value={0}>Select number</option>
                              {[1, 2, 3, 4].map(num => (
                                <option key={num} value={num}>{num}</option>
                              ))}
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Importance Level</label>
                            <select
                              value={formData.careOfInfant?.importance || ''}
                              onChange={(e) => handleInputChange('importance', e.target.value, 'careOfInfant')}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                              <option value="low">Low Priority</option>
                              <option value="medium">Medium Priority</option>
                              <option value="high">High Priority</option>
                              <option value="critical">Critical Requirement</option>
                            </select>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Specific Needs</label>
                          <textarea
                            value={formData.careOfInfant?.specificNeeds || ''}
                            onChange={(e) => handleInputChange('specificNeeds', e.target.value, 'careOfInfant')}
                            rows="2"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Any specific care requirements for infants..."
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Care of Children */}
                  <div className="border rounded-lg p-6 bg-gray-50">
                    <label className="flex items-center mb-4">
                      <input
                        type="checkbox"
                        checked={formData.careOfChildren?.required || false}
                        onChange={(e) => handleInputChange('required', e.target.checked, 'careOfChildren')}
                        className="mr-3 scale-125"
                      />
                      <span className="text-lg font-medium text-gray-900">Care of Children (1-12 years)</span>
                    </label>
                    
                    {formData.careOfChildren?.required && (
                      <div className="ml-6 space-y-4 bg-white p-4 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Number of Children</label>
                            <select
                              value={formData.careOfChildren?.numberOfChildren || 0}
                              onChange={(e) => handleInputChange('numberOfChildren', parseInt(e.target.value), 'careOfChildren')}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                              <option value={0}>Select number</option>
                              {[1, 2, 3, 4, 5].map(num => (
                                <option key={num} value={num}>{num}</option>
                              ))}
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Importance Level</label>
                            <select
                              value={formData.careOfChildren?.importance || ''}
                              onChange={(e) => handleInputChange('importance', e.target.value, 'careOfChildren')}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                              <option value="low">Low Priority</option>
                              <option value="medium">Medium Priority</option>
                              <option value="high">High Priority</option>
                              <option value="critical">Critical Requirement</option>
                            </select>
                          </div>
                        </div>
                        
                        <div>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={formData.careOfChildren?.schoolSupport || false}
                              onChange={(e) => handleInputChange('schoolSupport', e.target.checked, 'careOfChildren')}
                              className="mr-2"
                            />
                            <span className="text-sm text-gray-700">Requires school pickup/dropoff and homework help</span>
                          </label>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Specific Needs</label>
                          <textarea
                            value={formData.careOfChildren?.specificNeeds || ''}
                            onChange={(e) => handleInputChange('specificNeeds', e.target.value, 'careOfChildren')}
                            rows="2"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Any specific care requirements for children..."
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Care of Elderly */}
                  <div className="border rounded-lg p-6 bg-gray-50">
                    <label className="flex items-center mb-4">
                      <input
                        type="checkbox"
                        checked={formData.careOfOldAge?.required || false}
                        onChange={(e) => handleInputChange('required', e.target.checked, 'careOfOldAge')}
                        className="mr-3 scale-125"
                      />
                      <span className="text-lg font-medium text-gray-900">Care of Elderly (65+ years)</span>
                    </label>
                    
                    {formData.careOfOldAge?.required && (
                      <div className="ml-6 space-y-4 bg-white p-4 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Number of Elderly</label>
                            <select
                              value={formData.careOfOldAge?.numberOfElderly || 0}
                              onChange={(e) => handleInputChange('numberOfElderly', parseInt(e.target.value), 'careOfOldAge')}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                              <option value={0}>Select number</option>
                              {[1, 2, 3, 4].map(num => (
                                <option key={num} value={num}>{num}</option>
                              ))}
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Importance Level</label>
                            <select
                              value={formData.careOfOldAge?.importance || ''}
                              onChange={(e) => handleInputChange('importance', e.target.value, 'careOfOldAge')}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                              <option value="low">Low Priority</option>
                              <option value="medium">Medium Priority</option>
                              <option value="high">High Priority</option>
                              <option value="critical">Critical Requirement</option>
                            </select>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={formData.careOfOldAge?.mobilityAssistance || false}
                              onChange={(e) => handleInputChange('mobilityAssistance', e.target.checked, 'careOfOldAge')}
                              className="mr-2"
                            />
                            <span className="text-sm text-gray-700">Requires mobility assistance</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={formData.careOfOldAge?.medicationManagement || false}
                              onChange={(e) => handleInputChange('medicationManagement', e.target.checked, 'careOfOldAge')}
                              className="mr-2"
                            />
                            <span className="text-sm text-gray-700">Requires medication management</span>
                          </label>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Specific Needs</label>
                          <textarea
                            value={formData.careOfOldAge?.specificNeeds || ''}
                            onChange={(e) => handleInputChange('specificNeeds', e.target.value, 'careOfOldAge')}
                            rows="2"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Any specific care requirements for elderly..."
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Care of Disabled */}
                  <div className="border rounded-lg p-6 bg-gray-50">
                    <label className="flex items-center mb-4">
                      <input
                        type="checkbox"
                        checked={formData.careOfDisabled?.required || false}
                        onChange={(e) => handleInputChange('required', e.target.checked, 'careOfDisabled')}
                        className="mr-3 scale-125"
                      />
                      <span className="text-lg font-medium text-gray-900">Care of Disabled Person</span>
                    </label>
                    
                    {formData.careOfDisabled?.required && (
                      <div className="ml-6 space-y-4 bg-white p-4 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Disability Type</label>
                            <input
                              type="text"
                              value={formData.careOfDisabled?.disabilityType || ''}
                              onChange={(e) => handleInputChange('disabilityType', e.target.value, 'careOfDisabled')}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              placeholder="e.g., Physical, Intellectual, Sensory"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Importance Level</label>
                            <select
                              value={formData.careOfDisabled?.importance || ''}
                              onChange={(e) => handleInputChange('importance', e.target.value, 'careOfDisabled')}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                              <option value="low">Low Priority</option>
                              <option value="medium">Medium Priority</option>
                              <option value="high">High Priority</option>
                              <option value="critical">Critical Requirement</option>
                            </select>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Specific Needs</label>
                          <textarea
                            value={formData.careOfDisabled?.specificNeeds || ''}
                            onChange={(e) => handleInputChange('specificNeeds', e.target.value, 'careOfDisabled')}
                            rows="2"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Any specific care requirements for disabled person..."
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* General Housework */}
                  <div className="border rounded-lg p-6 bg-gray-50">
                    <label className="flex items-center mb-4">
                      <input
                        type="checkbox"
                        checked={formData.generalHousework?.required || false}
                        onChange={(e) => handleInputChange('required', e.target.checked, 'generalHousework')}
                        className="mr-3 scale-125"
                      />
                      <span className="text-lg font-medium text-gray-900">General Housework</span>
                    </label>
                    
                    {formData.generalHousework?.required && (
                      <div className="ml-6 space-y-4 bg-white p-4 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Cleaning Frequency</label>
                            <select
                              value={formData.generalHousework?.cleaningFrequency || ''}
                              onChange={(e) => handleInputChange('cleaningFrequency', e.target.value, 'generalHousework')}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                              <option value="">Select frequency</option>
                              <option value="daily">Daily</option>
                              <option value="weekly">Weekly</option>
                              <option value="bi-weekly">Bi-weekly</option>
                              <option value="monthly">Monthly</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Importance Level</label>
                            <select
                              value={formData.generalHousework?.importance || ''}
                              onChange={(e) => handleInputChange('importance', e.target.value, 'generalHousework')}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                              <option value="low">Low Priority</option>
                              <option value="medium">Medium Priority</option>
                              <option value="high">High Priority</option>
                              <option value="critical">Critical Requirement</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Cooking */}
                  <div className="border rounded-lg p-6 bg-gray-50">
                    <label className="flex items-center mb-4">
                      <input
                        type="checkbox"
                        checked={formData.cooking?.required || false}
                        onChange={(e) => handleInputChange('required', e.target.checked, 'cooking')}
                        className="mr-3 scale-125"
                      />
                      <span className="text-lg font-medium text-gray-900">Cooking</span>
                    </label>
                    
                    {formData.cooking?.required && (
                      <div className="ml-6 space-y-4 bg-white p-4 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Importance Level</label>
                            <select
                              value={formData.cooking?.importance || ''}
                              onChange={(e) => handleInputChange('importance', e.target.value, 'cooking')}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                              <option value="low">Low Priority</option>
                              <option value="medium">Medium Priority</option>
                              <option value="high">High Priority</option>
                              <option value="critical">Critical Requirement</option>
                            </select>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Specific Needs</label>
                          <textarea
                            value={formData.cooking?.specificNeeds || ''}
                            onChange={(e) => handleInputChange('specificNeeds', e.target.value, 'cooking')}
                            rows="2"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Any specific cooking requirements, cuisines, dietary restrictions..."
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 4. Work Requirements */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                  💼 Work Requirements
                </h3>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Experience (years)</label>
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={formData.minimumExperience || 1}
                        onChange={(e) => handleInputChange('minimumExperience', parseInt(e.target.value) || 1)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Education Level</label>
                      <select
                        value={formData.educationLevel || ''}
                        onChange={(e) => handleInputChange('educationLevel', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="primary">Primary Education</option>
                        <option value="secondary">Secondary Education</option>
                        <option value="tertiary">Tertiary Education</option>
                        <option value="any">Any Level</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Age Range</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                                          type="number"
                min="18"
                max="65"
                value={formData.ageRange?.min || ''}
                                                      onChange={(e) => handleInputChange('min', parseInt(e.target.value) || '', 'ageRange')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Min age"
                        />
                        <input
                                          type="number"
                min="18"
                max="65"
                value={formData.ageRange?.max || ''}
                                                      onChange={(e) => handleInputChange('max', parseInt(e.target.value) || '', 'ageRange')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Max age"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Communication Skills</label>
                      <select
                        value={formData.communicationSkills || ''}
                        onChange={(e) => handleInputChange('communicationSkills', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="basic">Basic</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                        <option value="fluent">Fluent</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nationality Preferences <span className="text-red-500">*</span>
                    </label>
                    <p className="text-sm text-gray-500 mb-2">Select preferred nationalities</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {NATIONALITIES.map(nationality => (
                        <label key={nationality} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={(formData.nationalityPreferences || []).includes(nationality)}
                            onChange={(e) => handleArrayChange('nationalityPreferences', nationality, e.target.checked)}
                            className="mr-2"
                          />
                          {nationality}
                        </label>
                      ))}
                    </div>
                    {errors.nationalityPreferences && <p className="text-red-500 text-sm mt-1">{errors.nationalityPreferences}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Languages Required</label>
                    <p className="text-sm text-gray-500 mb-2">Select languages the helper should speak</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {LANGUAGES.map(language => (
                        <label key={language} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={(formData.languagesRequired || []).includes(language)}
                            onChange={(e) => handleArrayChange('languagesRequired', language, e.target.checked)}
                            className="mr-2"
                          />
                          {language}
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Religion Preference</label>
                    <select
                      value={formData.religionPreference || ''}
                      onChange={(e) => handleInputChange('religionPreference', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">No preference</option>
                      <option value="Christianity">Christianity</option>
                      <option value="Islam">Islam</option>
                      <option value="Buddhism">Buddhism</option>
                      <option value="Hinduism">Hinduism</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Specific Experience Needed</label>
                    <textarea
                      value={formData.specificExperienceNeeded || ''}
                      onChange={(e) => handleInputChange('specificExperienceNeeded', e.target.value)}
                      rows="2"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Any specific experience or skills required..."
                    />
                  </div>
                </div>
              </div>

              {/* 5. Schedule & Working Conditions */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                  📅 Schedule & Working Conditions
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Working Days <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                        <label key={day} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={(formData.workingDays || []).includes(day)}
                            onChange={(e) => handleArrayChange('workingDays', day, e.target.checked)}
                            className="mr-2"
                          />
                          {day}
                        </label>
                      ))}
                    </div>
                    {errors.workingDays && <p className="text-red-500 text-sm mt-1">{errors.workingDays}</p>}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Working Hours</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="time"
                          value={formData.workingHours?.start || '08:00'}
                          onChange={(e) => handleInputChange('start', e.target.value, 'workingHours')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <input
                          type="time"
                          value={formData.workingHours?.end || '18:00'}
                          onChange={(e) => handleInputChange('end', e.target.value, 'workingHours')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Off Days Required</label>
                      <select
                        value={formData.offDaysRequired || 1}
                        onChange={(e) => handleInputChange('offDaysRequired', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value={0}>No off days</option>
                        <option value={1}>1 day per week</option>
                        <option value={2}>2 days per week</option>
                        <option value={3}>3 days per week</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Live-in Requirement</label>
                    <select
                      value={formData.liveIn || ''}
                      onChange={(e) => handleInputChange('liveIn', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="required">Live-in Required</option>
                      <option value="preferred">Live-in Preferred</option>
                      <option value="not_required">Live-in Not Required</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.workingHours?.flexible || false}
                        onChange={(e) => handleInputChange('flexible', e.target.checked, 'workingHours')}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Flexible working hours</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.workingHours?.overtimeExpected || false}
                        onChange={(e) => handleInputChange('overtimeExpected', e.target.checked, 'workingHours')}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Overtime may be expected</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* 6. Salary Information */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                  💰 Salary Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      value={formData.salary?.currency || ''}
                      onChange={(e) => handleInputChange('currency', e.target.value, 'salary')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="SGD">SGD</option>
                      <option value="USD">USD</option>
                      <option value="MYR">MYR</option>
                      <option value="HKD">HKD</option>
                    </select>
                  </div>
                  
                                                         <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Period</label>
                      <select
                        value={formData.salary?.period || 'monthly'}
                        onChange={(e) => handleInputChange('period', e.target.value, 'salary')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="monthly">Monthly</option>
                        <option value="weekly">Weekly</option>
                        <option value="daily">Daily</option>
                      </select>
                    </div>
                 </div>
                 
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Salary Range (if negotiable)</label>
                   <div className="flex space-x-2">
                     <input
                       type="number"
                       placeholder="Min"
                       value={formData.salary?.salaryRange?.min || ''}
                       onChange={(e) => handleInputChange('min', e.target.value, 'salary', 'salaryRange')}
                       className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                     />
                     <span className="py-2">-</span>
                     <input
                       type="number"
                       placeholder="Max"
                       value={formData.salary?.salaryRange?.max || ''}
                       onChange={(e) => handleInputChange('max', e.target.value, 'salary', 'salaryRange')}
                       className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                     />
                   </div>
                 </div>
                
                                 <div className="mt-4 space-y-2">
                   <label className="flex items-center">
                     <input
                       type="checkbox"
                       checked={formData.salary?.negotiable || false}
                       onChange={(e) => handleInputChange('negotiable', e.target.checked, 'salary')}
                       className="mr-2"
                     />
                     <span className="text-sm text-gray-700">Salary is negotiable</span>
                   </label>
                   <label className="flex items-center">
                     <input
                       type="checkbox"
                       checked={formData.salary?.performanceBonus || false}
                       onChange={(e) => handleInputChange('performanceBonus', e.target.checked, 'salary')}
                       className="mr-2"
                     />
                     <span className="text-sm text-gray-700">Performance bonus available</span>
                   </label>
                   <label className="flex items-center">
                     <input
                       type="checkbox"
                       checked={formData.salary?.includesFood || false}
                       onChange={(e) => handleInputChange('includesFood', e.target.checked, 'salary')}
                       className="mr-2"
                     />
                     <span className="text-sm text-gray-700">Includes food allowance</span>
                   </label>
                   <label className="flex items-center">
                     <input
                       type="checkbox"
                       checked={formData.salary?.includesAccommodation || false}
                       onChange={(e) => handleInputChange('includesAccommodation', e.target.checked, 'salary')}
                       className="mr-2"
                     />
                     <span className="text-sm text-gray-700">Includes accommodation</span>
                   </label>
                   <label className="flex items-center">
                     <input
                       type="checkbox"
                       checked={formData.salary?.overtimePay || false}
                       onChange={(e) => handleInputChange('overtimePay', e.target.checked, 'salary')}
                       className="mr-2"
                     />
                     <span className="text-sm text-gray-700">Overtime pay available</span>
                   </label>
                 </div>
                             </div>

               {/* 7. Contract Terms */}
               <div>
                 <h3 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                   📄 Contract Terms
                 </h3>
                 
                 <div className="space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">Contract Duration</label>
                       <select
                         value={formData.contractDuration || ''}
                         onChange={(e) => handleInputChange('contractDuration', e.target.value)}
                         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                       >
                         <option value="">Select Duration</option>
                         <option value="6_months">6 Months</option>
                         <option value="1_year">1 Year</option>
                         <option value="2_years">2 Years</option>
                         <option value="permanent">Permanent</option>
                         <option value="temporary">Temporary</option>
                       </select>
                     </div>
                     
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">Probation Period</label>
                       <select
                         value={formData.probationPeriod || ''}
                         onChange={(e) => handleInputChange('probationPeriod', e.target.value)}
                         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                       >
                         <option value="">No probation</option>
                         <option value="1_month">1 Month</option>
                         <option value="2_months">2 Months</option>
                         <option value="3_months">3 Months</option>
                         <option value="6_months">6 Months</option>
                       </select>
                     </div>
                   </div>
                   
                   <div className="flex items-center space-x-6">
                     <label className="flex items-center">
                       <input
                         type="checkbox"
                         checked={formData.trialPeriod || false}
                         onChange={(e) => handleInputChange('trialPeriod', e.target.checked)}
                         className="mr-2"
                       />
                       <span className="text-sm text-gray-700">Trial period available</span>
                     </label>
                     
                     <label className="flex items-center">
                       <input
                         type="checkbox"
                         checked={formData.trainingProvided || false}
                         onChange={(e) => handleInputChange('trainingProvided', e.target.checked)}
                         className="mr-2"
                       />
                       <span className="text-sm text-gray-700">Training provided</span>
                     </label>
                   </div>
                 </div>
               </div>

               {/* 8. Matching Preferences */}
               <div>
                 <h3 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                   🎯 Matching Preferences
                 </h3>
                 
                 <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                   <p className="text-gray-600 mb-4">Help us prioritize what's most important to you in finding the right match</p>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">Experience Priority</label>
                       <select
                         value={formData.matchingPreferences?.prioritizeExperience || ''}
                         onChange={(e) => handleInputChange('prioritizeExperience', e.target.value, 'matchingPreferences')}
                         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                       >
                         <option value="low">Low Priority</option>
                         <option value="medium">Medium Priority</option>
                         <option value="high">High Priority</option>
                         <option value="critical">Critical</option>
                       </select>
                     </div>
                     
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">Language Skills Priority</label>
                       <select
                         value={formData.matchingPreferences?.prioritizeLanguages || ''}
                         onChange={(e) => handleInputChange('prioritizeLanguages', e.target.value, 'matchingPreferences')}
                         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                       >
                         <option value="low">Low Priority</option>
                         <option value="medium">Medium Priority</option>
                         <option value="high">High Priority</option>
                         <option value="critical">Critical</option>
                       </select>
                     </div>
                     
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">Nationality Priority</label>
                       <select
                         value={formData.matchingPreferences?.prioritizeNationality || 'low'}
                         onChange={(e) => handleInputChange('prioritizeNationality', e.target.value, 'matchingPreferences')}
                         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                       >
                         <option value="low">Low Priority</option>
                         <option value="medium">Medium Priority</option>
                         <option value="high">High Priority</option>
                         <option value="critical">Critical</option>
                       </select>
                     </div>
                     
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">Cultural Fit</label>
                       <select
                         value={formData.matchingPreferences?.culturalFit || ''}
                         onChange={(e) => handleInputChange('culturalFit', e.target.value, 'matchingPreferences')}
                         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                       >
                         <option value="low">Low Priority</option>
                         <option value="medium">Medium Priority</option>
                         <option value="high">High Priority</option>
                         <option value="critical">Critical</option>
                       </select>
                     </div>
                   </div>
                 </div>
               </div>

               {/* 9. Contact & Interview Preferences */}
               <div>
                 <h3 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                   📞 Contact & Interview Preferences
                 </h3>
                 
                 <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Contact Method</label>
                       <select
                         value={formData.contact?.preferredMethod || ''}
                         onChange={(e) => handleInputChange('preferredMethod', e.target.value, 'contact')}
                         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                       >
                         <option value="">Select Method</option>
                         <option value="phone">Phone</option>
                         <option value="email">Email</option>
                         <option value="whatsapp">WhatsApp</option>
                         <option value="app">Through App</option>
                       </select>
                     </div>
                     
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">Interview Method</label>
                       <select
                         value={formData.contact?.interviewMethod || ''}
                         onChange={(e) => handleInputChange('interviewMethod', e.target.value, 'contact')}
                         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                       >
                         <option value="">Select Method</option>
                         <option value="whatsapp_video_call">WhatsApp Video Call</option>
                         <option value="voice_call">Voice Call</option>
                         <option value="face_to_face">Face to Face</option>
                         <option value="video_conference">Video Conference</option>
                         <option value="others">Others</option>
                       </select>
                     </div>
                     
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">Interview Availability</label>
                       <select
                         value={formData.contact?.availableForInterview || ''}
                         onChange={(e) => handleInputChange('availableForInterview', e.target.value, 'contact')}
                         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                       >
                         <option value="">Select Availability</option>
                         <option value="immediate">Immediate</option>
                         <option value="weekdays">Weekdays</option>
                         <option value="weekends">Weekends</option>
                         <option value="specific_times">Specific Times</option>
                       </select>
                     </div>
                     
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">Communication Language</label>
                       <select
                         value={formData.contact?.contactLanguage || ''}
                         onChange={(e) => handleInputChange('contactLanguage', e.target.value, 'contact')}
                         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                       >
                         <option value="English">English</option>
                         <option value="Mandarin">Mandarin</option>
                         <option value="Cantonese">Cantonese</option>
                         <option value="Malay">Malay</option>
                         <option value="Tamil">Tamil</option>
                         <option value="Hindi">Hindi</option>
                         <option value="Tagalog">Tagalog</option>
                         <option value="Indonesian">Indonesian</option>
                         <option value="Other">Other</option>
                       </select>
                     </div>
                   </div>
                 </div>
               </div>

               {/* 10. Additional Information */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                  📋 Additional Information
                </h3>
                
                                 <div className="space-y-6">
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">Special Requirements</label>
                     <textarea
                       value={formData.specialRequirements || ''}
                       onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
                       rows="3"
                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                       placeholder="Any special requirements, certifications needed, or unique aspects of the job..."
                     />
                   </div>
                   
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                     <textarea
                       value={formData.additionalNotes || ''}
                       onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                       rows="3"
                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                       placeholder="Tell potential helpers about your family, home environment, expectations, and what makes this a great opportunity..."
                     />
                   </div>
                   
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">Requirements</label>
                     <textarea
                       value={formData.requirements || ''}
                       onChange={(e) => handleInputChange('requirements', e.target.value)}
                       rows="3"
                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                       placeholder="Any specific requirements, preferences, or things helpers should know..."
                     />
                   </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Additional Benefits</label>
                    <textarea
                      value={formData.additionalBenefits || ''}
                      onChange={(e) => handleInputChange('additionalBenefits', e.target.value)}
                      rows="2"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Health insurance, annual bonus, paid leave, etc..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Work Environment</label>
                    <textarea
                      value={formData.workEnvironment || ''}
                      onChange={(e) => handleInputChange('workEnvironment', e.target.value)}
                      rows="2"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Describe the work environment, household atmosphere..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Family Values</label>
                    <textarea
                      value={formData.familyValues || ''}
                      onChange={(e) => handleInputChange('familyValues', e.target.value)}
                      rows="2"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Important family values, traditions, or cultural considerations..."
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Food Handling Requirements</label>
                      <textarea
                        value={formData.foodHandlingRequirements || ''}
                        onChange={(e) => handleInputChange('foodHandlingRequirements', e.target.value)}
                        rows="2"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Any food safety, hygiene, or handling requirements..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Dietary Accommodations</label>
                      <textarea
                        value={formData.dietaryAccommodations || ''}
                        onChange={(e) => handleInputChange('dietaryAccommodations', e.target.value)}
                        rows="2"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Allergies, dietary restrictions, special diets..."
                      />
                    </div>
                  </div>
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
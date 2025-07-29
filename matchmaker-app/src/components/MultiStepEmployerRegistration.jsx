'use client';

import React, { useState } from 'react';
import PhotoUpload from './PhotoUpload';

const MultiStepEmployerRegistration = ({ onSubmit, isLoading }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: '',
    email: '',
    location: '',
    profilePicture: [],
    
    // Household Information
    householdSize: '',
    hasKids: false,
    numberOfKids: '',
    kidsAges: '',
    hasPets: false,
    petDetails: '',
    
    // Introduction
    selfIntroduction: '',
    
    // Additional Info
    preferredLanguages: [],
    specificRequirements: ''
  });

  const [errors, setErrors] = useState({});

  const steps = [
    {
      title: 'Personal Information',
      description: 'Tell us about yourself'
    },
    {
      title: 'Household Details',
      description: 'Information about your household'
    },
    {
      title: 'Introduction & Preferences',
      description: 'Share more about your needs'
    }
  ];

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!formData.fullName.trim()) {
          newErrors.fullName = 'Full name is required';
        }
        if (!formData.email.trim()) {
          newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = 'Please enter a valid email address';
        }
        if (!formData.location.trim()) {
          newErrors.location = 'Location is required';
        }
        break;
      case 2:
        if (!formData.householdSize) {
          newErrors.householdSize = 'Please specify your household size';
        }
        if (formData.hasKids && !formData.numberOfKids) {
          newErrors.numberOfKids = 'Please specify number of children';
        }
        if (formData.hasKids && !formData.kidsAges.trim()) {
          newErrors.kidsAges = 'Please provide ages of children';
        }
        if (formData.hasPets && !formData.petDetails.trim()) {
          newErrors.petDetails = 'Please provide details about your pets';
        }
        break;
      case 3:
        // Optional validation for final step
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = () => {
    if (validateStep(currentStep)) {
      const submissionData = {
        ...formData,
        registrationCompletedAt: new Date().toISOString()
      };
      
      onSubmit(submissionData);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
        <p className="text-gray-600 mt-2">Let's start with your basic information</p>
      </div>

      {/* Profile Picture */}
      <div>
        <PhotoUpload
          label="Profile Picture"
          description="Upload a profile picture to help helpers recognize you (optional)"
          maxFiles={1}
          photos={formData.profilePicture}
          onChange={(photos) => handleInputChange('profilePicture', photos)}
          uploadPath="employer-profiles"
          className="mb-6"
        />
      </div>

      {/* Full Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Full Name *
        </label>
        <input
          type="text"
          value={formData.fullName}
          onChange={(e) => handleInputChange('fullName', e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.fullName ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="Enter your full name"
        />
        {errors.fullName && (
          <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Address *
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.email ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="Enter your email address"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Location *
        </label>
        <input
          type="text"
          value={formData.location}
          onChange={(e) => handleInputChange('location', e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.location ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="e.g., Orchard, Singapore or Petaling Jaya, Malaysia"
        />
        {errors.location && (
          <p className="text-red-500 text-sm mt-1">{errors.location}</p>
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Household Details</h2>
        <p className="text-gray-600 mt-2">Tell us about your household</p>
      </div>

      {/* Household Size */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Household Size *
        </label>
        <select
          value={formData.householdSize}
          onChange={(e) => handleInputChange('householdSize', e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.householdSize ? 'border-red-300' : 'border-gray-300'
          }`}
        >
          <option value="">Select household size</option>
          <option value="1">1 person (just me)</option>
          <option value="2">2 people</option>
          <option value="3">3 people</option>
          <option value="4">4 people</option>
          <option value="5">5 people</option>
          <option value="6+">6+ people</option>
        </select>
        {errors.householdSize && (
          <p className="text-red-500 text-sm mt-1">{errors.householdSize}</p>
        )}
      </div>

      {/* Children */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="hasKids"
            checked={formData.hasKids}
            onChange={(e) => handleInputChange('hasKids', e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="hasKids" className="text-sm font-medium text-gray-700">
            I have children at home
          </label>
        </div>

        {formData.hasKids && (
          <div className="ml-7 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Children *
              </label>
              <select
                value={formData.numberOfKids}
                onChange={(e) => handleInputChange('numberOfKids', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.numberOfKids ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select number of children</option>
                <option value="1">1 child</option>
                <option value="2">2 children</option>
                <option value="3">3 children</option>
                <option value="4">4 children</option>
                <option value="5+">5+ children</option>
              </select>
              {errors.numberOfKids && (
                <p className="text-red-500 text-sm mt-1">{errors.numberOfKids}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Children's Ages *
              </label>
              <input
                type="text"
                value={formData.kidsAges}
                onChange={(e) => handleInputChange('kidsAges', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.kidsAges ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="e.g., 3, 7, 12 years old"
              />
              {errors.kidsAges && (
                <p className="text-red-500 text-sm mt-1">{errors.kidsAges}</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Pets */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="hasPets"
            checked={formData.hasPets}
            onChange={(e) => handleInputChange('hasPets', e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="hasPets" className="text-sm font-medium text-gray-700">
            I have pets at home
          </label>
        </div>

        {formData.hasPets && (
          <div className="ml-7">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pet Details *
            </label>
            <textarea
              value={formData.petDetails}
              onChange={(e) => handleInputChange('petDetails', e.target.value)}
              rows={3}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.petDetails ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="e.g., 1 golden retriever (friendly), 2 cats (indoor only)"
            />
            {errors.petDetails && (
              <p className="text-red-500 text-sm mt-1">{errors.petDetails}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Tell Us About Yourself</h2>
        <p className="text-gray-600 mt-2">Help helpers understand what you're looking for</p>
      </div>

      {/* Self Introduction */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Self Introduction (Optional)
        </label>
        <textarea
          value={formData.selfIntroduction}
          onChange={(e) => handleInputChange('selfIntroduction', e.target.value)}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Tell us about yourself, your family, and what kind of help you're looking for. This helps helpers understand if they'd be a good fit for your household."
        />
        <p className="text-sm text-gray-500 mt-1">
          Share anything you think would be helpful for potential helpers to know
        </p>
      </div>

      {/* Preferred Languages */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Preferred Languages (Optional)
        </label>
        <div className="grid grid-cols-2 gap-3">
          {['English', 'Mandarin', 'Malay', 'Tamil', 'Tagalog', 'Indonesian', 'Thai', 'Myanmar'].map((language) => (
            <label key={language} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.preferredLanguages.includes(language)}
                onChange={(e) => {
                  if (e.target.checked) {
                    handleInputChange('preferredLanguages', [...formData.preferredLanguages, language]);
                  } else {
                    handleInputChange('preferredLanguages', formData.preferredLanguages.filter(lang => lang !== language));
                  }
                }}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{language}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Specific Requirements */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Specific Requirements or Preferences (Optional)
        </label>
        <textarea
          value={formData.specificRequirements}
          onChange={(e) => handleInputChange('specificRequirements', e.target.value)}
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Any specific requirements, preferences, or things helpers should know about working in your household"
        />
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  index + 1 < currentStep
                    ? 'bg-green-500 text-white'
                    : index + 1 === currentStep
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {index + 1 < currentStep ? '✓' : index + 1}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-16 h-1 mx-2 ${
                    index + 1 < currentStep ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <h3 className="text-lg font-semibold text-gray-900">
            {steps[currentStep - 1].title}
          </h3>
          <p className="text-gray-600">{steps[currentStep - 1].description}</p>
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className={`px-6 py-3 rounded-lg font-medium ${
              currentStep === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Previous
          </button>

          {currentStep < steps.length ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Next Step
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Completing Registration...
                </div>
              ) : (
                'Complete Registration'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MultiStepEmployerRegistration;
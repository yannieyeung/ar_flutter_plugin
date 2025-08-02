import React from 'react';
import MultiStepForm from './MultiStepForm';

// Step 1: Basic Job Information
const BasicJobInfoStep = ({ data, onChange, errors }) => (
  <div className="space-y-6">
    <div className="text-center mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Basic Job Information</h2>
      <p className="text-gray-600">Tell us about the job you're posting</p>
    </div>
    
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Job Title <span className="text-red-500">*</span></label>
        <input
          type="text"
          value={data.jobTitle || ''}
          onChange={(e) => onChange({ ...data, jobTitle: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., Domestic Helper for Family with Young Children"
        />
        {errors.jobTitle && <p className="text-red-500 text-sm mt-1">{errors.jobTitle}</p>}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Job Description <span className="text-red-500">*</span></label>
        <textarea
          value={data.jobDescription || ''}
          onChange={(e) => onChange({ ...data, jobDescription: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="4"
          placeholder="Describe the job responsibilities, family environment, and what you're looking for in a helper..."
        />
        {errors.jobDescription && <p className="text-red-500 text-sm mt-1">{errors.jobDescription}</p>}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">City <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={data.location?.city || ''}
            onChange={(e) => onChange({ 
              ...data, 
              location: { ...data.location, city: e.target.value }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter city name"
          />
          {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Country <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={data.location?.country || ''}
            onChange={(e) => onChange({ 
              ...data, 
              location: { ...data.location, country: e.target.value }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter country name"
          />
          {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Urgency</label>
          <select
                          value={data.urgency || 'flexible'}
            onChange={(e) => onChange({ ...data, urgency: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="immediate">Immediate (within 1 week)</option>
            <option value="within_week">Within 2 weeks</option>
            <option value="within_month">Within a month</option>
            <option value="flexible">Flexible timing</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Start Date <span className="text-red-500">*</span></label>
        <input
          type="date"
          value={data.startDate || ''}
          onChange={(e) => onChange({ ...data, startDate: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
      </div>
    </div>
  </div>
);

// Step 2: Household Information (Enhanced with compulsory fields)
const HouseholdInfoStep = ({ data, onChange, errors }) => {
  const HOUSE_TYPES = [
    'Studio Apartment', 'One Bedroom Apartment', 'Two Bedroom Apartment', 'Three Bedroom Apartment',
    'Four Bedroom Apartment', 'Five Bedroom Apartment', '2-Storey House', '3-Storey House', '4-Storey House', 'Others'
  ];

  const LANGUAGES = [
    'English', 'Mandarin', 'Cantonese', 'Malay', 'Tamil', 'Hindi',
    'Tagalog', 'Indonesian', 'Burmese', 'Sinhalese', 'Thai', 'Vietnamese',
    'Arabic', 'French', 'German', 'Spanish', 'Japanese', 'Korean', 'Other'
  ];

  const handleArrayChange = (field, value, checked) => {
    const current = data.employer?.[field] || [];
    const newArray = checked
      ? [...current, value]
      : current.filter(item => item !== value);
    
    onChange({
      ...data,
      employer: {
        ...data.employer,
        [field]: newArray
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Household Information</h2>
        <p className="text-gray-600">Help us understand your family to find the perfect match</p>
      </div>
      
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Household Size <span className="text-red-500">*</span></label>
              <select
                value={data.employer?.householdSize || ''}
                onChange={(e) => onChange({
                  ...data,
                  employer: { ...data.employer, householdSize: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">House Type <span className="text-red-500">*</span></label>
              <select
                value={data.employer?.houseType || ''}
                onChange={(e) => onChange({
                  ...data,
                  employer: { ...data.employer, houseType: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Cultural Background <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={data.employer?.culturalBackground || ''}
              onChange={(e) => onChange({
                ...data,
                employer: { ...data.employer, culturalBackground: e.target.value }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Chinese, Indian, Malay, Western"
            />
            {errors.culturalBackground && <p className="text-red-500 text-sm mt-1">{errors.culturalBackground}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Household Languages <span className="text-red-500">*</span></label>
            <p className="text-sm text-gray-500 mb-2">Select at least one language spoken in your household</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {LANGUAGES.map(language => (
                <label key={language} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={(data.employer?.householdLanguages || []).includes(language)}
                    onChange={(e) => handleArrayChange('householdLanguages', language, e.target.checked)}
                    className="mr-2"
                  />
                  {language}
                </label>
              ))}
            </div>
            {errors.householdLanguages && <p className="text-red-500 text-sm mt-1">{errors.householdLanguages}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Household Composition <span className="text-red-500">*</span></label>
            <p className="text-sm text-gray-500 mb-2">Select all that apply to your household</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={data.employer?.hasInfants || false}
                  onChange={(e) => onChange({
                    ...data,
                    employer: { ...data.employer, hasInfants: e.target.checked }
                  })}
                  className="mr-2"
                />
                Has Infants (0-12 months)
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={data.employer?.hasChildren || false}
                  onChange={(e) => onChange({
                    ...data,
                    employer: { ...data.employer, hasChildren: e.target.checked }
                  })}
                  className="mr-2"
                />
                Has Children (1-12 years)
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={data.employer?.hasElderly || false}
                  onChange={(e) => onChange({
                    ...data,
                    employer: { ...data.employer, hasElderly: e.target.checked }
                  })}
                  className="mr-2"
                />
                Has Elderly (65+ years)
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={data.employer?.hasDisabled || false}
                  onChange={(e) => onChange({
                    ...data,
                    employer: { ...data.employer, hasDisabled: e.target.checked }
                  })}
                  className="mr-2"
                />
                Has Disabled Person
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={data.employer?.hasPets || false}
                  onChange={(e) => onChange({
                    ...data,
                    employer: { ...data.employer, hasPets: e.target.checked }
                  })}
                  className="mr-2"
                />
                Has Pets
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={data.employer?.workingParents || false}
                  onChange={(e) => onChange({
                    ...data,
                    employer: { ...data.employer, workingParents: e.target.checked }
                  })}
                  className="mr-2"
                />
                Working Parents
              </label>
            </div>
            {errors.householdComposition && <p className="text-red-500 text-sm mt-1">{errors.householdComposition}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

// Step 3: Care Requirements (Enhanced with smart age selection)
const CareRequirementsStep = ({ data, onChange, errors }) => {
  const handleCareRequirementChange = (careType, field, value) => {
    onChange({
      ...data,
      requirements: {
        ...data.requirements,
        [careType]: {
          ...data.requirements?.[careType],
          [field]: value
        }
      }
    });
  };

  const handleAgeSelection = (careType, ageField, age, checked) => {
    const currentAges = data.requirements?.[careType]?.[ageField] || [];
    const maxNumber = data.requirements?.[careType]?.numberOfInfants || data.requirements?.[careType]?.numberOfChildren || 0;
    
    let newAges;
    if (checked) {
      // Only allow selection if under the limit
      if (currentAges.length < maxNumber) {
        newAges = [...currentAges, age];
      } else {
        return; // Don't allow more selections
      }
    } else {
      newAges = currentAges.filter(a => a !== age);
    }
    
    handleCareRequirementChange(careType, ageField, newAges);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Care Requirements <span className="text-red-500">*</span></h2>
        <p className="text-gray-600">What type of care do you need for your family members?</p>
        {errors.careRequirements && <p className="text-red-500 text-sm mt-2">{errors.careRequirements}</p>}
      </div>
      
      <div className="space-y-6">
        {/* Care of Infants */}
        <div className="border rounded-lg p-6 bg-gray-50">
          <label className="flex items-center mb-4">
            <input
              type="checkbox"
              checked={data.requirements?.careOfInfant?.required || false}
              onChange={(e) => handleCareRequirementChange('careOfInfant', 'required', e.target.checked)}
              className="mr-3 scale-125"
            />
            <span className="text-lg font-medium text-gray-900">Care of Infants (0-12 months)</span>
          </label>
          
          {data.requirements?.careOfInfant?.required && (
            <div className="ml-6 space-y-4 bg-white p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Number of Infants</label>
                  <select
                    value={data.requirements?.careOfInfant?.numberOfInfants || 0}
                    onChange={(e) => {
                      const numInfants = parseInt(e.target.value);
                      handleCareRequirementChange('careOfInfant', 'numberOfInfants', numInfants);
                      // Reset age selection when number changes
                      if (numInfants === 0) {
                        handleCareRequirementChange('careOfInfant', 'ageRangeMonths', []);
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    value={data.requirements?.careOfInfant?.importance || ''}
                    onChange={(e) => handleCareRequirementChange('careOfInfant', 'importance', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                    <option value="critical">Critical Requirement</option>
                  </select>
                </div>
              </div>
              
              {data.requirements?.careOfInfant?.numberOfInfants > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age Range (select up to {data.requirements.careOfInfant.numberOfInfants} ages)
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[...Array(13)].map((_, i) => {
                      const isSelected = (data.requirements?.careOfInfant?.ageRangeMonths || []).includes(i);
                      const isDisabled = !isSelected && 
                        (data.requirements?.careOfInfant?.ageRangeMonths || []).length >= 
                        data.requirements?.careOfInfant?.numberOfInfants;
                      
                      return (
                        <label key={i} className={`flex items-center ${isDisabled ? 'opacity-50' : ''}`}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            disabled={isDisabled}
                            onChange={(e) => handleAgeSelection('careOfInfant', 'ageRangeMonths', i, e.target.checked)}
                            className="mr-2"
                          />
                          {i} months
                        </label>
                      );
                    })}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Selected: {(data.requirements?.careOfInfant?.ageRangeMonths || []).length} / {data.requirements?.careOfInfant?.numberOfInfants || 0}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Care of Children */}
        <div className="border rounded-lg p-6 bg-gray-50">
          <label className="flex items-center mb-4">
            <input
              type="checkbox"
              checked={data.requirements?.careOfChildren?.required || false}
              onChange={(e) => handleCareRequirementChange('careOfChildren', 'required', e.target.checked)}
              className="mr-3 scale-125"
            />
            <span className="text-lg font-medium text-gray-900">Care of Children (1-12 years)</span>
          </label>
          
          {data.requirements?.careOfChildren?.required && (
            <div className="ml-6 space-y-4 bg-white p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Number of Children</label>
                  <select
                    value={data.requirements?.careOfChildren?.numberOfChildren || 0}
                    onChange={(e) => {
                      const numChildren = parseInt(e.target.value);
                      handleCareRequirementChange('careOfChildren', 'numberOfChildren', numChildren);
                      // Reset age selection when number changes
                      if (numChildren === 0) {
                        handleCareRequirementChange('careOfChildren', 'ageRangeYears', []);
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    value={data.requirements?.careOfChildren?.importance || ''}
                    onChange={(e) => handleCareRequirementChange('careOfChildren', 'importance', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                    <option value="critical">Critical Requirement</option>
                  </select>
                </div>
              </div>
              
              {data.requirements?.careOfChildren?.numberOfChildren > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age Range (select up to {data.requirements.careOfChildren.numberOfChildren} ages)
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[...Array(13)].map((_, i) => {
                      const isSelected = (data.requirements?.careOfChildren?.ageRangeYears || []).includes(i);
                      const isDisabled = !isSelected && 
                        (data.requirements?.careOfChildren?.ageRangeYears || []).length >= 
                        data.requirements?.careOfChildren?.numberOfChildren;
                      
                      return (
                        <label key={i} className={`flex items-center ${isDisabled ? 'opacity-50' : ''}`}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            disabled={isDisabled}
                            onChange={(e) => handleAgeSelection('careOfChildren', 'ageRangeYears', i, e.target.checked)}
                            className="mr-2"
                          />
                          {i} years
                        </label>
                      );
                    })}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Selected: {(data.requirements?.careOfChildren?.ageRangeYears || []).length} / {data.requirements?.careOfChildren?.numberOfChildren || 0}
                  </p>
                </div>
              )}
              
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={data.requirements?.careOfChildren?.schoolSupport || false}
                    onChange={(e) => handleCareRequirementChange('careOfChildren', 'schoolSupport', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Requires school pickup/dropoff and homework help</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Care of Elderly */}
        <div className="border rounded-lg p-6 bg-gray-50">
          <label className="flex items-center mb-4">
            <input
              type="checkbox"
              checked={data.requirements?.careOfOldAge?.required || false}
              onChange={(e) => handleCareRequirementChange('careOfOldAge', 'required', e.target.checked)}
              className="mr-3 scale-125"
            />
            <span className="text-lg font-medium text-gray-900">Care of Elderly (65+ years)</span>
          </label>
          
          {data.requirements?.careOfOldAge?.required && (
            <div className="ml-6 space-y-4 bg-white p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Number of Elderly</label>
                  <select
                    value={data.requirements?.careOfOldAge?.numberOfElderly || 0}
                    onChange={(e) => handleCareRequirementChange('careOfOldAge', 'numberOfElderly', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    value={data.requirements?.careOfOldAge?.importance || ''}
                    onChange={(e) => handleCareRequirementChange('careOfOldAge', 'importance', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    checked={data.requirements?.careOfOldAge?.mobilityAssistance || false}
                    onChange={(e) => handleCareRequirementChange('careOfOldAge', 'mobilityAssistance', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Requires mobility assistance</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={data.requirements?.careOfOldAge?.medicationManagement || false}
                    onChange={(e) => handleCareRequirementChange('careOfOldAge', 'medicationManagement', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Requires medication management</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Care of Disabled */}
        <div className="border rounded-lg p-6 bg-gray-50">
          <label className="flex items-center mb-4">
            <input
              type="checkbox"
              checked={data.requirements?.careOfDisabled?.required || false}
              onChange={(e) => handleCareRequirementChange('careOfDisabled', 'required', e.target.checked)}
              className="mr-3 scale-125"
            />
            <span className="text-lg font-medium text-gray-900">Care of Disabled Person</span>
          </label>
          
          {data.requirements?.careOfDisabled?.required && (
            <div className="ml-6 space-y-4 bg-white p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type of Disability</label>
                  <input
                    type="text"
                    value={data.requirements?.careOfDisabled?.disabilityType || ''}
                    onChange={(e) => handleCareRequirementChange('careOfDisabled', 'disabilityType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Physical, Intellectual, Autism"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Importance Level</label>
                  <select
                    value={data.requirements?.careOfDisabled?.importance || ''}
                    onChange={(e) => handleCareRequirementChange('careOfDisabled', 'importance', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                    <option value="critical">Critical Requirement</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Specific Care Needs</label>
                <textarea
                  value={data.requirements?.careOfDisabled?.specificNeeds || ''}
                  onChange={(e) => handleCareRequirementChange('careOfDisabled', 'specificNeeds', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="2"
                  placeholder="Describe specific care requirements..."
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
              checked={data.requirements?.generalHousework?.required || false}
              onChange={(e) => handleCareRequirementChange('generalHousework', 'required', e.target.checked)}
              className="mr-3 scale-125"
            />
            <span className="text-lg font-medium text-gray-900">General Housework</span>
          </label>
          
          {data.requirements?.generalHousework?.required && (
            <div className="ml-6 space-y-4 bg-white p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">House/Apartment Size</label>
                  <select
                    value={data.requirements?.generalHousework?.householdSize || ''}
                    onChange={(e) => handleCareRequirementChange('generalHousework', 'householdSize', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select size</option>
                    <option value="small">Small (1-2 rooms)</option>
                    <option value="medium">Medium (3-4 rooms)</option>
                    <option value="large">Large (5+ rooms)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cleaning Frequency</label>
                  <select
                    value={data.requirements?.generalHousework?.cleaningFrequency || ''}
                    onChange={(e) => handleCareRequirementChange('generalHousework', 'cleaningFrequency', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select frequency</option>
                    <option value="daily">Daily cleaning</option>
                    <option value="weekly">Weekly deep clean</option>
                    <option value="flexible">Flexible schedule</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Specific Tasks</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {[
                    'general_cleaning', 'deep_cleaning', 'laundry', 'ironing',
                    'grocery_shopping', 'meal_planning', 'dishwashing', 'organizing',
                    'pet_care', 'plant_care', 'car_washing'
                  ].map(task => (
                    <label key={task} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={(data.requirements?.generalHousework?.specificTasks || []).includes(task)}
                        onChange={(e) => {
                          const current = data.requirements?.generalHousework?.specificTasks || [];
                          const newArray = e.target.checked
                            ? [...current, task]
                            : current.filter(item => item !== task);
                          handleCareRequirementChange('generalHousework', 'specificTasks', newArray);
                        }}
                        className="mr-2"
                      />
                      {task.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Importance Level</label>
                <select
                  value={data.requirements?.generalHousework?.importance || ''}
                  onChange={(e) => handleCareRequirementChange('generalHousework', 'importance', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                  <option value="critical">Critical Requirement</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Cooking & Meal Preparation */}
        <div className="border rounded-lg p-6 bg-gray-50">
          <label className="flex items-center mb-4">
            <input
              type="checkbox"
              checked={data.requirements?.cooking?.required || false}
              onChange={(e) => handleCareRequirementChange('cooking', 'required', e.target.checked)}
              className="mr-3 scale-125"
            />
            <span className="text-lg font-medium text-gray-900">Cooking & Meal Preparation</span>
          </label>
          
          {data.requirements?.cooking?.required && (
            <div className="ml-6 space-y-4 bg-white p-4 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cuisine Preferences</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {[
                    'chinese', 'malay', 'indian', 'western', 'japanese', 'korean',
                    'thai', 'vietnamese', 'indonesian', 'filipino', 'italian', 'mediterranean'
                  ].map(cuisine => (
                    <label key={cuisine} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={(data.requirements?.cooking?.cuisinePreferences || []).includes(cuisine)}
                        onChange={(e) => {
                          const current = data.requirements?.cooking?.cuisinePreferences || [];
                          const newArray = e.target.checked
                            ? [...current, cuisine]
                            : current.filter(item => item !== cuisine);
                          handleCareRequirementChange('cooking', 'cuisinePreferences', newArray);
                        }}
                        className="mr-2"
                      />
                      {cuisine.charAt(0).toUpperCase() + cuisine.slice(1)}
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Meal Preparation</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {[
                    'breakfast', 'lunch', 'dinner', 'snacks', 'packed_lunches',
                    'special_diet_meals', 'baby_food', 'elderly_soft_food'
                  ].map(mealType => (
                    <label key={mealType} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={(data.requirements?.cooking?.mealPreparation || []).includes(mealType)}
                        onChange={(e) => {
                          const current = data.requirements?.cooking?.mealPreparation || [];
                          const newArray = e.target.checked
                            ? [...current, mealType]
                            : current.filter(item => item !== mealType);
                          handleCareRequirementChange('cooking', 'mealPreparation', newArray);
                        }}
                        className="mr-2"
                      />
                      {mealType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Dietary Restrictions</label>
                <input
                  type="text"
                  value={(data.requirements?.cooking?.dietaryRestrictions || []).join(', ')}
                  onChange={(e) => handleCareRequirementChange('cooking', 'dietaryRestrictions', e.target.value.split(', ').filter(item => item))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., vegetarian, halal, gluten-free (separate with commas)"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Importance Level</label>
                <select
                  value={data.requirements?.cooking?.importance || ''}
                  onChange={(e) => handleCareRequirementChange('cooking', 'importance', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                  <option value="critical">Critical Requirement</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Step 4: Work Requirements  
const WorkRequirementsStep = ({ data, onChange, errors }) => {
  const NATIONALITIES = [
    'Filipino', 'Indonesian', 'Myanmar', 'Sri Lankan', 'Indian', 
    'Bangladeshi', 'Nepalese', 'Thai', 'Vietnamese', 'Cambodian'
  ];

  const LANGUAGES = [
    'English', 'Mandarin', 'Cantonese', 'Malay', 'Tamil', 'Hindi',
    'Tagalog', 'Indonesian', 'Burmese', 'Sinhalese', 'Thai', 'Vietnamese',
    'Arabic', 'French', 'German', 'Spanish', 'Japanese', 'Korean', 'Other'
  ];

  const WORKING_DAYS = [
    'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
  ];

  const handleArrayChange = (field, value, checked) => {
    const current = data.requirements?.[field] || [];
    const newArray = checked
      ? [...current, value]
      : current.filter(item => item !== value);
    
    onChange({
      ...data,
      requirements: {
        ...data.requirements,
        [field]: newArray
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Work Requirements</h2>
        <p className="text-gray-600">What are your requirements for the helper?</p>
      </div>
      
      <div className="bg-gray-50 p-6 rounded-lg space-y-6">
        {/* Experience Requirements */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Experience Requirements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Experience Required</label>
              <select
                value={data.requirements?.minimumExperience || ''}
                onChange={(e) => onChange({
                  ...data,
                  requirements: {
                    ...data.requirements,
                    minimumExperience: e.target.value
                  }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">No specific requirement</option>
                <option value="0">No experience required</option>
                <option value="1">1+ years</option>
                <option value="2">2+ years</option>
                <option value="3">3+ years</option>
                <option value="4">4+ years</option>
                <option value="5+">5+ years</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Helper Experience Required</label>
              <select
                value={data.requirements?.helperExperienceRequired || ''}
                onChange={(e) => onChange({
                  ...data,
                  requirements: {
                    ...data.requirements,
                    helperExperienceRequired: e.target.value
                  }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">No preference</option>
                <option value="yes">Must have helper experience</option>
                <option value="preferred">Preferred but not required</option>
                <option value="no">Open to first-time helpers</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Specific Experience Needed</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {[
                'infant_care', 'toddler_care', 'school_age_care', 'elderly_care',
                'disabled_care', 'pet_care', 'cooking', 'cleaning', 'tutoring'
              ].map(experience => (
                <label key={experience} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={(data.requirements?.specificExperienceNeeded || []).includes(experience)}
                    onChange={(e) => handleArrayChange('specificExperienceNeeded', experience, e.target.checked)}
                    className="mr-2"
                  />
                  {experience.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Personal Requirements */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Requirements</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age Range</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={data.requirements?.ageRange?.min || ''}
                    onChange={(e) => onChange({
                      ...data,
                      requirements: {
                        ...data.requirements,
                        ageRange: {
                          ...data.requirements?.ageRange,
                          min: e.target.value ? parseInt(e.target.value) : ''
                        }
                      }
                    })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="21"
                    max="65"
                  />
                  <span className="py-2">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={data.requirements?.ageRange?.max || ''}
                    onChange={(e) => onChange({
                      ...data,
                      requirements: {
                        ...data.requirements,
                        ageRange: {
                          ...data.requirements?.ageRange,
                          max: e.target.value ? parseInt(e.target.value) : ''
                        }
                      }
                    })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="21"
                    max="65"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Education Level</label>
                <select
                  value={data.requirements?.educationLevel || ''}
                  onChange={(e) => onChange({
                    ...data,
                    requirements: {
                      ...data.requirements,
                      educationLevel: e.target.value
                    }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">No preference</option>
                  <option value="primary_school">Primary School</option>
                  <option value="secondary_school">Secondary School</option>
                  <option value="high_school">High School</option>
                  <option value="university">University</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nationality Preferences <span className="text-red-500">*</span></label>
              {errors.nationalityPreferences && <p className="text-red-500 text-sm mb-2">{errors.nationalityPreferences}</p>}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {NATIONALITIES.map(nationality => (
                  <label key={nationality} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={(data.requirements?.nationalityPreferences || []).includes(nationality)}
                      onChange={(e) => handleArrayChange('nationalityPreferences', nationality, e.target.checked)}
                      className="mr-2"
                    />
                    {nationality}
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Religion Preference</label>
              <input
                type="text"
                value={data.requirements?.religionPreference || ''}
                onChange={(e) => onChange({
                  ...data,
                  requirements: {
                    ...data.requirements,
                    religionPreference: e.target.value
                  }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Christian, Buddhist, Muslim, Hindu (optional)"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Languages Required</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {LANGUAGES.map(language => (
                  <label key={language} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={(data.requirements?.languagesRequired || []).includes(language)}
                      onChange={(e) => handleArrayChange('languagesRequired', language, e.target.checked)}
                      className="mr-2"
                    />
                    {language}
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Communication Skills Required</label>
              <select
                value={data.requirements?.communicationSkills || ''}
                onChange={(e) => onChange({
                  ...data,
                  requirements: {
                    ...data.requirements,
                    communicationSkills: e.target.value
                  }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="basic">Basic communication</option>
                <option value="intermediate">Intermediate communication</option>
                <option value="advanced">Advanced communication</option>
              </select>
            </div>
          </div>
        </div>

        {/* Health Requirements */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Health Requirements</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={data.requirements?.physicalRequirements?.noAllergies || false}
                  onChange={(e) => onChange({
                    ...data,
                    requirements: {
                      ...data.requirements,
                      physicalRequirements: {
                        ...data.requirements?.physicalRequirements,
                        noAllergies: e.target.checked
                      }
                    }
                  })}
                  className="mr-2"
                />
                No allergies required
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={data.requirements?.physicalRequirements?.noMedicalIssues || false}
                  onChange={(e) => onChange({
                    ...data,
                    requirements: {
                      ...data.requirements,
                      physicalRequirements: {
                        ...data.requirements?.physicalRequirements,
                        noMedicalIssues: e.target.checked
                      }
                    }
                  })}
                  className="mr-2"
                />
                No medical issues required
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={data.requirements?.physicalRequirements?.noPhysicalDisabilities || false}
                  onChange={(e) => onChange({
                    ...data,
                    requirements: {
                      ...data.requirements,
                      physicalRequirements: {
                        ...data.requirements?.physicalRequirements,
                        noPhysicalDisabilities: e.target.checked
                      }
                    }
                  })}
                  className="mr-2"
                />
                No physical disabilities required
              </label>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Specific Health Requirements</label>
              <textarea
                value={data.requirements?.physicalRequirements?.specificHealthRequirements || ''}
                onChange={(e) => onChange({
                  ...data,
                  requirements: {
                    ...data.requirements,
                    physicalRequirements: {
                      ...data.requirements?.physicalRequirements,
                      specificHealthRequirements: e.target.value
                    }
                  }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="2"
                placeholder="Any specific health requirements or considerations..."
              />
            </div>
          </div>
        </div>

        {/* Schedule Requirements */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Schedule Requirements</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Working Days <span className="text-red-500">*</span></label>
              {errors.workingDays && <p className="text-red-500 text-sm mb-2">{errors.workingDays}</p>}
              <div className="grid grid-cols-4 gap-2">
                {WORKING_DAYS.map(day => (
                  <label key={day} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={(data.requirements?.workingDays || []).includes(day)}
                      onChange={(e) => handleArrayChange('workingDays', day, e.target.checked)}
                      className="mr-2"
                    />
                    {day.charAt(0).toUpperCase() + day.slice(1)}
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Working Hours</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="time"
                    value={data.requirements?.workingHours?.start || ''}
                    onChange={(e) => onChange({
                      ...data,
                      requirements: {
                        ...data.requirements,
                        workingHours: {
                          ...data.requirements?.workingHours,
                          start: e.target.value
                        }
                      }
                    })}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span>to</span>
                  <input
                    type="time"
                    value={data.requirements?.workingHours?.end || ''}
                    onChange={(e) => onChange({
                      ...data,
                      requirements: {
                        ...data.requirements,
                        workingHours: {
                          ...data.requirements?.workingHours,
                          end: e.target.value
                        }
                      }
                    })}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Live-in Arrangement</label>
                <select
                  value={data.requirements?.liveIn || ''}
                  onChange={(e) => onChange({
                    ...data,
                    requirements: {
                      ...data.requirements,
                      liveIn: e.target.value
                    }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">No preference</option>
                  <option value="required">Live-in required</option>
                  <option value="preferred">Live-in preferred</option>
                  <option value="not_required">Live-out is fine</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Off Days Required per Week</label>
                <select
                  value={data.requirements?.offDaysRequired || ''}
                  onChange={(e) => onChange({
                    ...data,
                    requirements: {
                      ...data.requirements,
                      offDaysRequired: parseInt(e.target.value)
                    }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {[0, 1, 2, 3, 4].map(num => (
                    <option key={num} value={num}>{num} day{num !== 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={data.requirements?.workingHours?.flexible || false}
                  onChange={(e) => onChange({
                    ...data,
                    requirements: {
                      ...data.requirements,
                      workingHours: {
                        ...data.requirements?.workingHours,
                        flexible: e.target.checked
                      }
                    }
                  })}
                  className="mr-2"
                />
                Flexible working hours
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={data.requirements?.workingHours?.overtimeExpected || false}
                  onChange={(e) => onChange({
                    ...data,
                    requirements: {
                      ...data.requirements,
                      workingHours: {
                        ...data.requirements?.workingHours,
                        overtimeExpected: e.target.checked
                      }
                    }
                  })}
                  className="mr-2"
                />
                Occasional overtime expected
              </label>
            </div>
          </div>
        </div>

        {/* Food Handling Requirements */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Food Handling Requirements</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Food Handling Restrictions</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {['no_pork', 'no_beef', 'no_alcohol', 'halal_only', 'vegetarian_only', 'others'].map(restriction => (
                  <label key={restriction} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={(data.requirements?.foodHandlingRequirements || []).includes(restriction)}
                      onChange={(e) => handleArrayChange('foodHandlingRequirements', restriction, e.target.checked)}
                      className="mr-2"
                    />
                    {restriction.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Dietary Accommodations</label>
              <input
                type="text"
                value={(data.requirements?.dietaryAccommodations || []).join(', ')}
                onChange={(e) => onChange({
                  ...data,
                  requirements: {
                    ...data.requirements,
                    dietaryAccommodations: e.target.value.split(', ').filter(item => item)
                  }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., kosher, gluten-free, dairy-free (separate with commas)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Step 5: Compensation & Benefits
const CompensationStep = ({ data, onChange, errors }) => (
  <div className="space-y-6">
    <div className="text-center mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Compensation & Benefits</h2>
      <p className="text-gray-600">Define the compensation package you're offering</p>
    </div>
    
    <div className="bg-green-50 p-6 rounded-lg border border-green-200 space-y-6">
      <h3 className="text-lg font-medium text-green-800">💰 Salary Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Salary <span className="text-red-500">*</span></label>
          <input
            type="number"
            value={data.salary?.amount || ''}
            onChange={(e) => onChange({
              ...data,
              salary: { ...data.salary, amount: e.target.value }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 1000"
          />
          {errors.salary && <p className="text-red-500 text-sm mt-1">{errors.salary}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
          <select
            value={data.salary?.currency || ''}
            onChange={(e) => onChange({
              ...data,
              salary: { ...data.salary, currency: e.target.value }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="USD">USD - US Dollar</option>
            <option value="EUR">EUR - Euro</option>
            <option value="GBP">GBP - British Pound</option>
            <option value="SGD">SGD - Singapore Dollar</option>
            <option value="HKD">HKD - Hong Kong Dollar</option>
            <option value="AUD">AUD - Australian Dollar</option>
            <option value="CAD">CAD - Canadian Dollar</option>
            <option value="MYR">MYR - Malaysian Ringgit</option>
            <option value="THB">THB - Thai Baht</option>
            <option value="PHP">PHP - Philippine Peso</option>
            <option value="IDR">IDR - Indonesian Rupiah</option>
            <option value="INR">INR - Indian Rupee</option>
            <option value="AED">AED - UAE Dirham</option>
            <option value="SAR">SAR - Saudi Riyal</option>
            <option value="JPY">JPY - Japanese Yen</option>
            <option value="KRW">KRW - South Korean Won</option>
            <option value="CNY">CNY - Chinese Yuan</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Period</label>
          <select
            value={data.salary?.period || ''}
            onChange={(e) => onChange({
              ...data,
              salary: { ...data.salary, period: e.target.value }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="monthly">Monthly</option>
            <option value="weekly">Weekly</option>
            <option value="daily">Daily</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Salary Range (if negotiable)</label>
          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Min"
              value={data.salary?.salaryRange?.min || ''}
              onChange={(e) => onChange({
                ...data,
                salary: { 
                  ...data.salary, 
                  salaryRange: {
                    ...data.salary?.salaryRange,
                    min: e.target.value
                  }
                }
              })}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="py-2">-</span>
            <input
              type="number"
              placeholder="Max"
              value={data.salary?.salaryRange?.max || ''}
              onChange={(e) => onChange({
                ...data,
                salary: { 
                  ...data.salary, 
                  salaryRange: {
                    ...data.salary?.salaryRange,
                    max: e.target.value
                  }
                }
              })}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="flex flex-col justify-center space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={data.salary?.negotiable || false}
              onChange={(e) => onChange({
                ...data,
                salary: { ...data.salary, negotiable: e.target.checked }
              })}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">Salary is negotiable</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={data.salary?.performanceBonus || false}
              onChange={(e) => onChange({
                ...data,
                salary: { ...data.salary, performanceBonus: e.target.checked }
              })}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">Performance bonus available</span>
          </label>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-green-800 mb-3">🎁 Benefits & Accommodations</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Benefits</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {[
                'medical_insurance', 'dental_care', 'annual_leave', 'sick_leave',
                'public_holiday_pay', 'overtime_pay', 'performance_bonus',
                'transportation_allowance', 'phone_allowance', 'training_provided',
                'annual_ticket_home', 'loyalty_bonus'
              ].map(benefit => (
                <label key={benefit} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={(data.benefits || []).includes(benefit)}
                    onChange={(e) => {
                      const current = data.benefits || [];
                      const newArray = e.target.checked
                        ? [...current, benefit]
                        : current.filter(item => item !== benefit);
                      onChange({ ...data, benefits: newArray });
                    }}
                    className="mr-2"
                  />
                  {benefit.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Accommodations (if live-in)</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {[
                'private_room', 'shared_room', 'private_bathroom', 'shared_bathroom',
                'air_conditioning', 'wifi', 'television', 'personal_refrigerator',
                'storage_space', 'laundry_facilities', 'cooking_facilities'
              ].map(accommodation => (
                <label key={accommodation} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={(data.accommodations || []).includes(accommodation)}
                    onChange={(e) => {
                      const current = data.accommodations || [];
                      const newArray = e.target.checked
                        ? [...current, accommodation]
                        : current.filter(item => item !== accommodation);
                      onChange({ ...data, accommodations: newArray });
                    }}
                    className="mr-2"
                  />
                  {accommodation.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Step 6: Final Details
const FinalDetailsStep = ({ data, onChange, errors }) => (
  <div className="space-y-6">
    <div className="text-center mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Final Details</h2>
      <p className="text-gray-600">Almost done! Add any final details about the job</p>
    </div>
    
    <div className="space-y-6">
      {/* Job Details */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Job Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contract Duration</label>
            <select
              value={data.contractDuration || ''}
              onChange={(e) => onChange({ ...data, contractDuration: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              value={data.probationPeriod || ''}
              onChange={(e) => onChange({ ...data, probationPeriod: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">No probation</option>
              <option value="1_month">1 Month</option>
              <option value="2_months">2 Months</option>
              <option value="3_months">3 Months</option>
              <option value="6_months">6 Months</option>
            </select>
          </div>
        </div>
        
        <div className="mt-4 flex items-center space-x-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={data.trialPeriod || false}
              onChange={(e) => onChange({ ...data, trialPeriod: e.target.checked })}
              className="mr-2"
            />
            Trial period available
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={data.trainingProvided || false}
              onChange={(e) => onChange({ ...data, trainingProvided: e.target.checked })}
              className="mr-2"
            />
            Training provided
          </label>
        </div>
      </div>

      {/* Matching Preferences */}
      <div className="bg-green-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Matching Preferences</h3>
        <p className="text-gray-600 mb-4">Help us prioritize what's most important to you in finding the right match</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Experience Priority</label>
            <select
              value={data.matchingPreferences?.prioritizeExperience || ''}
              onChange={(e) => onChange({
                ...data,
                matchingPreferences: {
                  ...data.matchingPreferences,
                  prioritizeExperience: e.target.value
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              value={data.matchingPreferences?.prioritizeLanguages || ''}
              onChange={(e) => onChange({
                ...data,
                matchingPreferences: {
                  ...data.matchingPreferences,
                  prioritizeLanguages: e.target.value
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              value={data.matchingPreferences?.prioritizeNationality || ''}
              onChange={(e) => onChange({
                ...data,
                matchingPreferences: {
                  ...data.matchingPreferences,
                  prioritizeNationality: e.target.value
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              value={data.matchingPreferences?.culturalFit || ''}
              onChange={(e) => onChange({
                ...data,
                matchingPreferences: {
                  ...data.matchingPreferences,
                  culturalFit: e.target.value
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>
      </div>

      {/* Contact & Interview Preferences */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact & Interview Preferences</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Contact Method</label>
            <select
              value={data.contact?.preferredMethod || ''}
              onChange={(e) => onChange({
                ...data,
                contact: {
                  ...data.contact,
                  preferredMethod: e.target.value
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              value={data.contact?.interviewMethod || ''}
              onChange={(e) => onChange({
                ...data,
                contact: {
                  ...data.contact,
                  interviewMethod: e.target.value
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              value={data.contact?.availableForInterview || ''}
              onChange={(e) => onChange({
                ...data,
                contact: {
                  ...data.contact,
                  availableForInterview: e.target.value
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              value={data.contact?.contactLanguage || ''}
              onChange={(e) => onChange({
                ...data,
                contact: {
                  ...data.contact,
                  contactLanguage: e.target.value
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="English">English</option>
              <option value="Mandarin">Mandarin</option>
              <option value="Cantonese">Cantonese</option>
              <option value="Malay">Malay</option>
              <option value="Tamil">Tamil</option>
              <option value="Hindi">Hindi</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Additional Information</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Special Requirements</label>
            <textarea
              value={data.specialRequirements || ''}
              onChange={(e) => onChange({ ...data, specialRequirements: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              placeholder="Any special requirements, certifications needed, or unique aspects of the job..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
            <textarea
              value={data.additionalNotes || ''}
              onChange={(e) => onChange({ ...data, additionalNotes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              placeholder="Tell potential helpers about your family, home environment, expectations, and what makes this a great opportunity..."
            />
          </div>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-blue-800 mb-2">📋 Summary</h3>
        <div className="text-sm text-blue-700 space-y-1">
          <p><strong>Job:</strong> {data.jobTitle || 'Not specified'}</p>
          <p><strong>Location:</strong> {data.location?.city || 'Not specified'}, {data.location?.country || 'Not specified'}</p>
          <p><strong>Household Size:</strong> {data.employer?.householdSize || 'Not specified'}</p>
          <p><strong>Start Date:</strong> {data.startDate || 'Not specified'}</p>
          <p><strong>Salary:</strong> {data.salary?.currency || 'USD'} {data.salary?.amount || 'Not specified'} {data.salary?.period || 'monthly'}</p>
          <p><strong>Contract:</strong> {data.contractDuration ? data.contractDuration.replace('_', ' ') : 'Not specified'}</p>
          <p><strong>Care Requirements:</strong> {
            [
              data.requirements?.careOfInfant?.required && 'Infant Care',
              data.requirements?.careOfChildren?.required && 'Child Care',
              data.requirements?.careOfOldAge?.required && 'Elderly Care',
              data.requirements?.careOfDisabled?.required && 'Disabled Care',
              data.requirements?.generalHousework?.required && 'Housework',
              data.requirements?.cooking?.required && 'Cooking'
            ].filter(Boolean).join(', ') || 'None specified'
          }</p>
        </div>
      </div>
    </div>
  </div>
);

const MultiStepJobPosting = ({ onSubmit, isLoading }) => {
  const steps = [
    {
      title: 'Basic Info',
      component: BasicJobInfoStep,
      validate: (data) => {
        const errors = {};
        if (!data.jobTitle) errors.jobTitle = 'Job title is required';
        if (!data.jobDescription) errors.jobDescription = 'Job description is required';
        if (!data.location?.city) errors.city = 'City is required';
        if (!data.location?.country) errors.country = 'Country is required';
        if (!data.startDate) errors.startDate = 'Start date is required';
        return errors;
      }
    },
    {
      title: 'Household',
      component: HouseholdInfoStep,
      validate: (data) => {
        const errors = {};
        if (!data.employer?.householdSize) errors.householdSize = 'Household size is required';
        if (!data.employer?.houseType) errors.houseType = 'House type is required';
        if (!data.employer?.culturalBackground) errors.culturalBackground = 'Cultural background is required';
        if (!data.employer?.householdLanguages || data.employer.householdLanguages.length === 0) {
          errors.householdLanguages = 'At least one household language is required';
        }
        
        // Check if at least one household composition is selected
        const hasComposition = data.employer?.hasInfants || data.employer?.hasChildren || 
                             data.employer?.hasElderly || data.employer?.hasDisabled || 
                             data.employer?.hasPets || data.employer?.workingParents;
        if (!hasComposition) {
          errors.householdComposition = 'Please select at least one household composition option';
        }
        
        return errors;
      }
    },
    {
      title: 'Care Needs',
      component: CareRequirementsStep,
      validate: (data) => {
        const errors = {};
        
        // Check if at least one care requirement is selected
        const careRequirements = data.requirements || {};
        const hasAnyCareRequirement = 
          careRequirements.careOfInfant?.required ||
          careRequirements.careOfChildren?.required ||
          careRequirements.careOfOldAge?.required ||
          careRequirements.careOfDisabled?.required ||
          careRequirements.generalHousework?.required ||
          careRequirements.cooking?.required;
        
        if (!hasAnyCareRequirement) {
          errors.careRequirements = 'Please select at least one care requirement';
        }
        
        return errors;
      }
    },
    {
      title: 'Work Details',
      component: WorkRequirementsStep,
      validate: (data) => {
        const errors = {};
        
        // Nationality Preferences - require at least one selection
        if (!data.requirements?.nationalityPreferences || data.requirements.nationalityPreferences.length === 0) {
          errors.nationalityPreferences = 'Please select at least one nationality preference';
        }
        
        // Schedule Requirements - require working days selection
        if (!data.requirements?.workingDays || data.requirements.workingDays.length === 0) {
          errors.workingDays = 'Please select at least one working day';
        }
        
        return errors;
      }
    },
    {
      title: 'Compensation',
      component: CompensationStep,
      validate: (data) => {
        const errors = {};
        if (!data.salary?.amount) errors.salary = 'Salary is required';
        return errors;
      }
    },
    {
      title: 'Final Details',
      component: FinalDetailsStep,
      validate: (data) => ({}) // No required fields for final details
    }
  ];

  const handleSubmit = (formData) => {
    console.log('🎯 Multi-step job posting submitted:', formData);
    
    // Initialize missing required structures
    const processedData = {
      // Basic job information
      jobTitle: formData.jobTitle || '',
      jobDescription: formData.jobDescription || '',
      location: {
        address: '',
        city: formData.location?.city || '',
        country: formData.location?.country || '',
        coordinates: { lat: '', lng: '' }
      },
      
      // Employer demographics
      employer: {
        householdSize: formData.employer?.householdSize || '',
        houseType: formData.employer?.houseType || '',
        hasInfants: formData.employer?.hasInfants || false,
        hasChildren: formData.employer?.hasChildren || false,
        hasElderly: formData.employer?.hasElderly || false,
        hasDisabled: formData.employer?.hasDisabled || false,
        hasPets: formData.employer?.hasPets || false,
        petTypes: formData.employer?.petTypes || [],
        householdLanguages: formData.employer?.householdLanguages || [],
        culturalBackground: formData.employer?.culturalBackground || '',
        workingParents: formData.employer?.workingParents || false,
        cookingStyle: formData.employer?.cookingStyle || []
      },
      
      // Care Requirements (stored at top level to match form structure)
      careOfInfant: formData.requirements?.careOfInfant || {
        required: false,
        ageRangeMonths: [],
        numberOfInfants: 0,
        importance: 'medium',
        specificNeeds: ''
      },
      careOfChildren: formData.requirements?.careOfChildren || {
        required: false,
        ageRangeYears: [],
        numberOfChildren: 0,
        importance: 'medium',
        specificNeeds: '',
        schoolSupport: false
      },
      careOfDisabled: formData.requirements?.careOfDisabled || {
        required: false,
        disabilityType: '',
        importance: 'medium',
        specificNeeds: ''
      },
      careOfOldAge: formData.requirements?.careOfOldAge || {
        required: false,
        numberOfElderly: 0,
        mobilityAssistance: false,
        medicationManagement: false,
        importance: 'medium',
        specificNeeds: ''
      },
      generalHousework: formData.requirements?.generalHousework || {
        required: false,
        householdSize: '',
        cleaningFrequency: '',
        importance: 'medium',
        specificTasks: []
      },
      cooking: formData.requirements?.cooking || {
        required: false,
        cuisinePreferences: [],
        dietaryRestrictions: [],
        mealPreparation: [],
        importance: 'medium',
        specificNeeds: ''
      },
      
      // Work Requirements (stored at top level)
      minimumExperience: formData.requirements?.minimumExperience || 1,
      helperExperienceRequired: formData.requirements?.helperExperienceRequired || 'required',
      specificExperienceNeeded: formData.requirements?.specificExperienceNeeded || [],
      educationLevel: formData.requirements?.educationLevel || 'primary',
      ageRange: formData.requirements?.ageRange || { min: 21, max: 50 },
      nationalityPreferences: formData.requirements?.nationalityPreferences || [],
      religionPreference: formData.requirements?.religionPreference || '',
      languagesRequired: formData.requirements?.languagesRequired || [],
      communicationSkills: formData.requirements?.communicationSkills || 'basic',
      physicalRequirements: formData.requirements?.physicalRequirements || {
        noAllergies: false,
        noMedicalIssues: false,
        noPhysicalDisabilities: false,
        specificHealthRequirements: ''
      },
      
      // Schedule & Working Conditions (stored at top level)
      workingDays: formData.requirements?.workingDays || [],
      workingHours: formData.requirements?.workingHours || { 
        start: '08:00', 
        end: '18:00',
        flexible: false,
        overtimeExpected: false
      },
      liveIn: formData.requirements?.liveIn || 'required',
      offDaysRequired: formData.requirements?.offDaysRequired || 1,
      foodHandlingRequirements: formData.requirements?.foodHandlingRequirements || '',
      dietaryAccommodations: formData.requirements?.dietaryAccommodations || '',
      
      // Salary information
      salary: {
        amount: formData.salary?.amount || '',
        currency: formData.salary?.currency || 'USD',
        period: formData.salary?.period || 'monthly',
        negotiable: formData.salary?.negotiable || false,
        performanceBonus: formData.salary?.performanceBonus || false,
        salaryRange: formData.salary?.salaryRange || { min: '', max: '' }
      },
      
      // Job details
      startDate: formData.startDate || '',
      contractDuration: formData.contractDuration || '',
      urgency: formData.urgency || 'flexible',
      probationPeriod: formData.probationPeriod || '',
      
      // Matching preferences
      matchingPreferences: formData.matchingPreferences || {
        prioritizeExperience: 'medium',
        prioritizeLanguages: 'medium',
        prioritizeNationality: 'low',
        culturalFit: 'medium'
      },
      
      // Contact and additional info
      contact: formData.contact || {
        preferredMethod: '',
        interviewMethod: '',
        availableForInterview: '',
        contactLanguage: 'English'
      },
      
      // Additional Information
      specialRequirements: formData.specialRequirements || '',
      additionalNotes: formData.additionalNotes || '',
      trialPeriod: formData.trialPeriod || false,
      trainingProvided: formData.trainingProvided || false
    };
    
    onSubmit(processedData);
  };

  return (
    <MultiStepForm
      steps={steps}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      title="Post a Job"
      allowSkip={false}
    />
  );
};

export default MultiStepJobPosting;
import React from 'react';

const PersonalInfoStep = ({ data, onChange, errors }) => {
  const COUNTRIES = [
    'Philippines', 'Indonesia', 'Myanmar', 'Sri Lanka', 'India', 'Bangladesh', 'Nepal', 'Thailand', 'Vietnam', 'Cambodia'
  ];

  const handleInputChange = (field, value) => {
    const newData = { ...data, [field]: value };
    onChange(newData);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Personal Information</h2>
        <p className="text-gray-600">Let's start with your basic information</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={data.name || ''}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your full name"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date of Birth <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={data.dateOfBirth || ''}
            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Country of Birth</label>
          <select
            value={data.countryOfBirth || ''}
            onChange={(e) => handleInputChange('countryOfBirth', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Country</option>
            {COUNTRIES.map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">City/Town of Birth</label>
          <input
            type="text"
            value={data.cityOfBirth || ''}
            onChange={(e) => handleInputChange('cityOfBirth', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your city or town of birth"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nationality <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={data.nationality || ''}
            onChange={(e) => handleInputChange('nationality', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Filipino, Indonesian"
          />
          {errors.nationality && <p className="text-red-500 text-sm mt-1">{errors.nationality}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Religion</label>
          <input
            type="text"
            value={data.religion || ''}
            onChange={(e) => handleInputChange('religion', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Catholic, Buddhist, Muslim"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm)</label>
          <input
            type="number"
            value={data.height || ''}
            onChange={(e) => handleInputChange('height', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 160"
            min="120"
            max="220"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
          <input
            type="number"
            value={data.weight || ''}
            onChange={(e) => handleInputChange('weight', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 55"
            min="30"
            max="200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Education Level <span className="text-red-500">*</span>
          </label>
          <select
            value={data.educationLevel || ''}
            onChange={(e) => handleInputChange('educationLevel', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Education Level</option>
            <option value="primary_school">Primary School</option>
            <option value="secondary_school">Secondary School</option>
            <option value="high_school">High School</option>
            <option value="university">University</option>
          </select>
          {errors.educationLevel && <p className="text-red-500 text-sm mt-1">{errors.educationLevel}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Number of Siblings</label>
          <select
            value={data.numberOfSiblings || ''}
            onChange={(e) => handleInputChange('numberOfSiblings', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Number</option>
            {[...Array(11)].map((_, i) => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Marital Status <span className="text-red-500">*</span>
          </label>
          <select
            value={data.maritalStatus || ''}
            onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Status</option>
            <option value="single">Single</option>
            <option value="married">Married</option>
            <option value="divorced">Divorced</option>
            <option value="widowed">Widowed</option>
          </select>
          {errors.maritalStatus && <p className="text-red-500 text-sm mt-1">{errors.maritalStatus}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Number of Children</label>
          <select
            value={data.numberOfChildren || ''}
            onChange={(e) => handleInputChange('numberOfChildren', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Number</option>
            {[...Array(11)].map((_, i) => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Residential Address in Home Country
          </label>
          <textarea
            value={data.residentialAddress || ''}
            onChange={(e) => handleInputChange('residentialAddress', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
            placeholder="Enter your complete home address"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Name of Port/Airport for Repatriation
          </label>
          <input
            type="text"
            value={data.repatriationPort || ''}
            onChange={(e) => handleInputChange('repatriationPort', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Ninoy Aquino International Airport"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contact Number in Home Country
          </label>
          <input
            type="tel"
            value={data.contactNumber || ''}
            onChange={(e) => handleInputChange('contactNumber', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="+63 912 345 6789"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Have you worked as a helper before? <span className="text-red-500">*</span>
          </label>
          <div className="flex space-x-6">
            <label className="flex items-center">
              <input
                type="radio"
                name="hasBeenHelperBefore"
                value="yes"
                checked={data.hasBeenHelperBefore === 'yes'}
                onChange={(e) => handleInputChange('hasBeenHelperBefore', e.target.value)}
                className="mr-2"
              />
              Yes, I have experience
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="hasBeenHelperBefore"
                value="no"
                checked={data.hasBeenHelperBefore === 'no'}
                onChange={(e) => handleInputChange('hasBeenHelperBefore', e.target.value)}
                className="mr-2"
              />
              No, I'm new to this
            </label>
          </div>
          {errors.hasBeenHelperBefore && <p className="text-red-500 text-sm mt-1">{errors.hasBeenHelperBefore}</p>}
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoStep;
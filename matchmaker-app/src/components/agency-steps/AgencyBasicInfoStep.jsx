import React from 'react';

const AgencyBasicInfoStep = ({ data, onChange, errors }) => {
  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Basic Business Information</h2>
        <p className="text-gray-600">Tell us about your employment agency</p>
      </div>

      <div className="space-y-6">
        {/* Business Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Name of Business <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={data.businessName || ''}
            onChange={(e) => handleChange('businessName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., ABC Employment Agency Pte Ltd"
          />
          {errors.businessName && <p className="text-red-500 text-sm mt-1">{errors.businessName}</p>}
        </div>

        {/* UEN Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            UEN Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={data.uenNumber || ''}
            onChange={(e) => handleChange('uenNumber', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 201234567A"
          />
          {errors.uenNumber && <p className="text-red-500 text-sm mt-1">{errors.uenNumber}</p>}
          <p className="text-xs text-gray-500 mt-1">
            Unique Entity Number (UEN) issued by ACRA for Singapore businesses
          </p>
        </div>

        {/* Contact Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contact Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={data.contactNumber || ''}
            onChange={(e) => handleChange('contactNumber', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., +65 6123 4567"
          />
          {errors.contactNumber && <p className="text-red-500 text-sm mt-1">{errors.contactNumber}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={data.email || ''}
            onChange={(e) => handleChange('email', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., contact@abcagency.com"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        {/* Business Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business Address <span className="text-red-500">*</span>
          </label>
          <textarea
            value={data.businessAddress || ''}
            onChange={(e) => handleChange('businessAddress', e.target.value)}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 123 Business Street, #12-34, Business Building, Singapore 123456"
          />
          {errors.businessAddress && <p className="text-red-500 text-sm mt-1">{errors.businessAddress}</p>}
        </div>

        {/* Website (Optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Website (Optional)
          </label>
          <input
            type="url"
            value={data.website || ''}
            onChange={(e) => handleChange('website', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., https://www.abcagency.com"
          />
        </div>

        {/* Business Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business Description (Optional)
          </label>
          <textarea
            value={data.businessDescription || ''}
            onChange={(e) => handleChange('businessDescription', e.target.value)}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe your agency, years of experience, specializations, and what makes you unique..."
          />
          <p className="text-xs text-gray-500 mt-1">
            This description will be shown to potential clients and helpers
          </p>
        </div>

        {/* Years in Business */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Years in Business (Optional)
          </label>
          <select
            value={data.yearsInBusiness || ''}
            onChange={(e) => handleChange('yearsInBusiness', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select years in business</option>
            <option value="Less than 1 year">Less than 1 year</option>
            <option value="1-3 years">1-3 years</option>
            <option value="4-7 years">4-7 years</option>
            <option value="8-15 years">8-15 years</option>
            <option value="More than 15 years">More than 15 years</option>
          </select>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <div className="flex items-start">
          <svg className="h-5 w-5 text-blue-400 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <h3 className="text-sm font-medium text-blue-800">Why we need this information</h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc list-inside space-y-1">
                <li>UEN number helps verify your business registration</li>
                <li>Contact details allow employers and helpers to reach you</li>
                <li>Business address may be required for legal documentation</li>
                <li>Complete profiles get better visibility and trust from clients</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgencyBasicInfoStep;
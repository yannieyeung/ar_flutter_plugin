import React from 'react';

const AgencyServicesStep = ({ data, onChange, errors }) => {
  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  const handleArrayChange = (field, value, checked) => {
    const current = data[field] || [];
    const newArray = checked
      ? [...current, value]
      : current.filter(item => item !== value);
    handleChange(field, newArray);
  };

  const COUNTRIES = [
    'Indonesia',
    'Philippines', 
    'Myanmar',
    'Sri Lanka',
    'India',
    'Bangladesh',
    'Cambodia',
    'Malaysia',
    'Thailand',
    'Hong Kong',
    'Macau',
    'South Korea',
    'Taiwan'
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Services & Geographic Coverage</h2>
        <p className="text-gray-600">Tell us about the services you provide and countries you recruit from</p>
      </div>

      <div className="space-y-8">
        {/* Services Provided */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Service Provided <span className="text-red-500">*</span>
          </label>
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="flex items-start">
                <input
                  type="checkbox"
                  checked={(data.servicesProvided || []).includes('Agency Hire')}
                  onChange={(e) => handleArrayChange('servicesProvided', 'Agency Hire', e.target.checked)}
                  className="mr-3 mt-1"
                />
                <div>
                  <span className="font-medium text-gray-900">Agency Hire</span>
                  <p className="text-sm text-gray-600 mt-1">
                    Direct placement of helpers with employers. The agency sources, screens, and places helpers directly with families.
                  </p>
                </div>
              </label>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="flex items-start">
                <input
                  type="checkbox"
                  checked={(data.servicesProvided || []).includes('Direct Hire')}
                  onChange={(e) => handleArrayChange('servicesProvided', 'Direct Hire', e.target.checked)}
                  className="mr-3 mt-1"
                />
                <div>
                  <span className="font-medium text-gray-900">Direct Hire</span>
                  <p className="text-sm text-gray-600 mt-1">
                    Facilitate connections between employers and helpers who have already been identified. Handle paperwork and administrative processes.
                  </p>
                </div>
              </label>
            </div>
          </div>
          {errors.servicesProvided && <p className="text-red-500 text-sm mt-2">{errors.servicesProvided}</p>}
        </div>

        {/* Countries of Helpers */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Countries of Helpers <span className="text-red-500">*</span>
          </label>
          <p className="text-sm text-gray-600 mb-4">
            Select the countries from which you recruit or have helpers available
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {COUNTRIES.map(country => (
              <label key={country} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(data.countriesOfHelpers || []).includes(country)}
                  onChange={(e) => handleArrayChange('countriesOfHelpers', country, e.target.checked)}
                  className="mr-3"
                />
                <span className="text-sm font-medium text-gray-700">{country}</span>
              </label>
            ))}
          </div>
          {errors.countriesOfHelpers && <p className="text-red-500 text-sm mt-2">{errors.countriesOfHelpers}</p>}
        </div>

        {/* Specializations */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Specializations (Optional)
          </label>
          <p className="text-sm text-gray-600 mb-4">
            Select areas where your agency has particular expertise or focus
          </p>
          
          <div className="space-y-3">
            {[
              { value: 'infant_care', label: 'Infant Care (0-12 months)', description: 'Specialists in caring for newborns and infants' },
              { value: 'child_care', label: 'Child Care (1-12 years)', description: 'Experienced in childcare and child development' },
              { value: 'elderly_care', label: 'Elderly Care', description: 'Trained in elderly care and companionship' },
              { value: 'disabled_care', label: 'Special Needs Care', description: 'Specialized in caring for disabled individuals' },
              { value: 'cooking_specialist', label: 'Cooking Specialists', description: 'Helpers with advanced cooking skills' },
              { value: 'pet_care', label: 'Pet Care', description: 'Comfortable with and experienced in pet care' },
              { value: 'multilingual', label: 'Multilingual Helpers', description: 'Helpers who speak multiple languages' }
            ].map(spec => (
              <div key={spec.value} className="bg-gray-50 p-3 rounded-lg">
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    checked={(data.specializations || []).includes(spec.value)}
                    onChange={(e) => handleArrayChange('specializations', spec.value, e.target.checked)}
                    className="mr-3 mt-1"
                  />
                  <div>
                    <span className="font-medium text-gray-900">{spec.label}</span>
                    <p className="text-sm text-gray-600 mt-1">{spec.description}</p>
                  </div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Services */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Additional Services (Optional)
          </label>
          
          <div className="space-y-3">
            {[
              { value: 'training_programs', label: 'Training Programs', description: 'Provide skill development and training for helpers' },
              { value: 'orientation_services', label: 'Orientation Services', description: 'Help helpers adjust to Singapore culture and work environment' },
              { value: 'ongoing_support', label: 'Ongoing Support', description: 'Continuous support during employment period' },
              { value: 'mediation_services', label: 'Mediation Services', description: 'Help resolve conflicts between employers and helpers' },
              { value: 'emergency_replacement', label: 'Emergency Replacement', description: 'Quick replacement service for urgent situations' },
              { value: 'documentation_assistance', label: 'Documentation Assistance', description: 'Help with work permits, medical checks, and other paperwork' }
            ].map(service => (
              <div key={service.value} className="bg-gray-50 p-3 rounded-lg">
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    checked={(data.additionalServices || []).includes(service.value)}
                    onChange={(e) => handleArrayChange('additionalServices', service.value, e.target.checked)}
                    className="mr-3 mt-1"
                  />
                  <div>
                    <span className="font-medium text-gray-900">{service.label}</span>
                    <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                  </div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Service Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Detailed Service Description (Optional)
          </label>
          <textarea
            value={data.serviceDescription || ''}
            onChange={(e) => handleChange('serviceDescription', e.target.value)}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe your agency's unique approach, processes, quality assurance measures, or any special services you offer..."
          />
          <p className="text-xs text-gray-500 mt-1">
            This description will help employers understand your agency's strengths and approach
          </p>
        </div>
      </div>

      {/* Summary Box */}
      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
        <h3 className="text-sm font-medium text-green-800 mb-2">Service Summary</h3>
        <div className="text-sm text-green-700 space-y-1">
          <p><strong>Services:</strong> {(data.servicesProvided || []).join(', ') || 'None selected'}</p>
          <p><strong>Countries:</strong> {(data.countriesOfHelpers || []).length} selected</p>
          <p><strong>Specializations:</strong> {(data.specializations || []).length} selected</p>
          <p><strong>Additional Services:</strong> {(data.additionalServices || []).length} selected</p>
        </div>
      </div>
    </div>
  );
};

export default AgencyServicesStep;
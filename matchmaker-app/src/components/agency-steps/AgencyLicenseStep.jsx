import React from 'react';

const AgencyLicenseStep = ({ data, onChange, errors }) => {
  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">License & Regulatory Information</h2>
        <p className="text-gray-600">Provide your employment agency licensing details</p>
      </div>

      <div className="space-y-6">
        {/* EA License Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            EA License Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={data.eaLicenseNumber || ''}
            onChange={(e) => handleChange('eaLicenseNumber', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 12C3456"
          />
          {errors.eaLicenseNumber && <p className="text-red-500 text-sm mt-1">{errors.eaLicenseNumber}</p>}
          <p className="text-xs text-gray-500 mt-1">
            Employment Agency (EA) License issued by the Ministry of Manpower (MOM)
          </p>
        </div>

        {/* License Expiry Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            License Expiry Date (Optional)
          </label>
          <input
            type="date"
            value={data.licenseExpiryDate || ''}
            onChange={(e) => handleChange('licenseExpiryDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Help ensure your license is current and valid
          </p>
        </div>

        {/* Key Personnel */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Key Personnel (Optional)
          </label>
          <textarea
            value={data.keyPersonnel || ''}
            onChange={(e) => handleChange('keyPersonnel', e.target.value)}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., John Doe (Director), Jane Smith (Manager)"
          />
          <p className="text-xs text-gray-500 mt-1">
            List key personnel or authorized representatives
          </p>
        </div>

        {/* Additional Certifications */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Certifications (Optional)
          </label>
          <div className="space-y-2">
            {[
              { value: 'case_trust', label: 'CaseTrust Accreditation' },
              { value: 'iso_certification', label: 'ISO Certification' },
              { value: 'better_business', label: 'Better Business Bureau Member' },
              { value: 'industry_association', label: 'Industry Association Member' }
            ].map(cert => (
              <label key={cert.value} className="flex items-center">
                <input
                  type="checkbox"
                  checked={(data.additionalCertifications || []).includes(cert.value)}
                  onChange={(e) => {
                    const current = data.additionalCertifications || [];
                    const newCerts = e.target.checked
                      ? [...current, cert.value]
                      : current.filter(c => c !== cert.value);
                    handleChange('additionalCertifications', newCerts);
                  }}
                  className="mr-2"
                />
                {cert.label}
              </label>
            ))}
          </div>
        </div>

        {/* Other Licenses */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Other Relevant Licenses or Permits (Optional)
          </label>
          <textarea
            value={data.otherLicenses || ''}
            onChange={(e) => handleChange('otherLicenses', e.target.value)}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="List any other relevant business licenses, permits, or regulatory approvals..."
          />
        </div>

        {/* Compliance Statement */}
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h3 className="text-sm font-medium text-yellow-800 mb-3">Compliance Declaration</h3>
          <div className="space-y-3">
            <label className="flex items-start">
              <input
                type="checkbox"
                checked={data.complianceDeclaration?.mom || false}
                onChange={(e) => handleChange('complianceDeclaration', {
                  ...data.complianceDeclaration,
                  mom: e.target.checked
                })}
                className="mr-2 mt-1"
              />
              <span className="text-sm text-yellow-700">
                I confirm that my agency is in good standing with the Ministry of Manpower (MOM) and all licenses are current and valid.
              </span>
            </label>

            <label className="flex items-start">
              <input
                type="checkbox"
                checked={data.complianceDeclaration?.ethicalPractices || false}
                onChange={(e) => handleChange('complianceDeclaration', {
                  ...data.complianceDeclaration,
                  ethicalPractices: e.target.checked
                })}
                className="mr-2 mt-1"
              />
              <span className="text-sm text-yellow-700">
                I commit to following ethical practices in employment agency services and fair treatment of all workers.
              </span>
            </label>

            <label className="flex items-start">
              <input
                type="checkbox"
                checked={data.complianceDeclaration?.noUnlawfulCharges || false}
                onChange={(e) => handleChange('complianceDeclaration', {
                  ...data.complianceDeclaration,
                  noUnlawfulCharges: e.target.checked
                })}
                className="mr-2 mt-1"
              />
              <span className="text-sm text-yellow-700">
                I confirm that my agency does not charge unlawful fees to foreign domestic workers as per MOM regulations.
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <div className="flex items-start">
          <svg className="h-5 w-5 text-blue-400 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <h3 className="text-sm font-medium text-blue-800">EA License Requirements</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p className="mb-2">All employment agencies in Singapore must have a valid EA license from MOM to:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Place foreign domestic workers with employers</li>
                <li>Operate as an employment agency</li>
                <li>Charge fees for employment services</li>
                <li>Access government portals and systems</li>
              </ul>
              <p className="mt-2 text-xs">
                <strong>Note:</strong> Providing false licensing information may result in account suspension.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgencyLicenseStep;
import React from 'react';

export const AgencyBusinessInfo = ({ user, isEditing, editData, setEditData }) => (
  <div className="bg-white overflow-hidden shadow rounded-lg">
    <div className="px-4 py-5 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Business Information</h3>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Business Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Business Name</label>
          {isEditing ? (
            <input
              type="text"
              value={editData.businessName}
              onChange={(e) => setEditData({...editData, businessName: e.target.value})}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          ) : (
            <p className="mt-1 text-sm text-gray-900">{user?.businessName || 'Not provided'}</p>
          )}
        </div>

        {/* UEN Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700">UEN Number</label>
          {isEditing ? (
            <input
              type="text"
              value={editData.uenNumber}
              onChange={(e) => setEditData({...editData, uenNumber: e.target.value})}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          ) : (
            <p className="mt-1 text-sm text-gray-900">{user?.uenNumber || 'Not provided'}</p>
          )}
        </div>

        {/* Contact Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Contact Number</label>
          {isEditing ? (
            <input
              type="text"
              value={editData.contactNumber}
              onChange={(e) => setEditData({...editData, contactNumber: e.target.value})}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          ) : (
            <p className="mt-1 text-sm text-gray-900">{user?.contactNumber || 'Not provided'}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Email Address</label>
          {isEditing ? (
            <input
              type="email"
              value={editData.email}
              onChange={(e) => setEditData({...editData, email: e.target.value})}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          ) : (
            <p className="mt-1 text-sm text-gray-900">{user?.email || user?.phoneNumber || 'Not provided'}</p>
          )}
        </div>

        {/* Website */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Website</label>
          {isEditing ? (
            <input
              type="url"
              value={editData.website}
              onChange={(e) => setEditData({...editData, website: e.target.value})}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          ) : (
            <p className="mt-1 text-sm text-gray-900">
              {user?.website ? (
                <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800">
                  {user.website}
                </a>
              ) : (
                'Not provided'
              )}
            </p>
          )}
        </div>

        {/* Years in Business */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Years in Business</label>
          {isEditing ? (
            <select
              value={editData.yearsInBusiness}
              onChange={(e) => setEditData({...editData, yearsInBusiness: e.target.value})}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Select years in business</option>
              <option value="Less than 1 year">Less than 1 year</option>
              <option value="1-3 years">1-3 years</option>
              <option value="4-7 years">4-7 years</option>
              <option value="8-15 years">8-15 years</option>
              <option value="More than 15 years">More than 15 years</option>
            </select>
          ) : (
            <p className="mt-1 text-sm text-gray-900">
              {user?.yearsInBusiness || 'Not provided'}
            </p>
          )}
        </div>

        {/* Business Address */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Business Address</label>
          {isEditing ? (
            <textarea
              value={editData.businessAddress}
              onChange={(e) => setEditData({...editData, businessAddress: e.target.value})}
              rows={3}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          ) : (
            <p className="mt-1 text-sm text-gray-900">{user?.businessAddress || 'Not provided'}</p>
          )}
        </div>

        {/* Business Description */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Business Description</label>
          {isEditing ? (
            <textarea
              value={editData.businessDescription}
              onChange={(e) => setEditData({...editData, businessDescription: e.target.value})}
              rows={4}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Describe your agency, years of experience, specializations..."
            />
          ) : (
            <p className="mt-1 text-sm text-gray-900">{user?.businessDescription || 'Not provided'}</p>
          )}
        </div>
      </div>
    </div>
  </div>
);

export const AgencyLicenseInfo = ({ user, isEditing, editData, setEditData }) => (
  <div className="bg-white overflow-hidden shadow rounded-lg">
    <div className="px-4 py-5 sm:p-6">
      <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">License & Regulatory Information</h3>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        
        {/* EA License Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700">EA License Number</label>
          {isEditing ? (
            <input
              type="text"
              value={editData.eaLicenseNumber}
              onChange={(e) => setEditData({...editData, eaLicenseNumber: e.target.value})}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          ) : (
            <p className="mt-1 text-sm text-gray-900">{user?.eaLicenseNumber || 'Not provided'}</p>
          )}
        </div>

        {/* License Expiry Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700">License Expiry Date</label>
          {isEditing ? (
            <input
              type="date"
              value={editData.licenseExpiryDate}
              onChange={(e) => setEditData({...editData, licenseExpiryDate: e.target.value})}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          ) : (
            <p className="mt-1 text-sm text-gray-900">
              {user?.licenseExpiryDate ? new Date(user.licenseExpiryDate).toLocaleDateString() : 'Not provided'}
            </p>
          )}
        </div>

        {/* Key Personnel */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Key Personnel</label>
          {isEditing ? (
            <textarea
              value={editData.keyPersonnel}
              onChange={(e) => setEditData({...editData, keyPersonnel: e.target.value})}
              rows={3}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="e.g., John Doe (Director), Jane Smith (Manager)"
            />
          ) : (
            <p className="mt-1 text-sm text-gray-900">{user?.keyPersonnel || 'Not provided'}</p>
          )}
        </div>

        {/* Additional Certifications */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Additional Certifications</label>
          {isEditing ? (
            <div className="mt-1 space-y-2">
              {[
                { value: 'case_trust', label: 'CaseTrust Accreditation' },
                { value: 'iso_certification', label: 'ISO Certification' },
                { value: 'better_business', label: 'Better Business Bureau Member' },
                { value: 'industry_association', label: 'Industry Association Member' }
              ].map(cert => (
                <label key={cert.value} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={(editData.additionalCertifications || []).includes(cert.value)}
                    onChange={(e) => {
                      const current = editData.additionalCertifications || [];
                      const newCerts = e.target.checked
                        ? [...current, cert.value]
                        : current.filter(c => c !== cert.value);
                      setEditData({...editData, additionalCertifications: newCerts});
                    }}
                    className="mr-2"
                  />
                  {cert.label}
                </label>
              ))}
            </div>
          ) : (
            <div className="mt-1 flex flex-wrap gap-2">
              {(user?.additionalCertifications || []).length > 0 ? (
                user.additionalCertifications.map((cert, index) => (
                  <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {cert.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                ))
              ) : (
                <p className="text-sm text-gray-900">None specified</p>
              )}
            </div>
          )}
        </div>

        {/* Other Licenses */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Other Relevant Licenses or Permits</label>
          {isEditing ? (
            <textarea
              value={editData.otherLicenses}
              onChange={(e) => setEditData({...editData, otherLicenses: e.target.value})}
              rows={3}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="List any other relevant business licenses, permits, or regulatory approvals..."
            />
          ) : (
            <p className="mt-1 text-sm text-gray-900">{user?.otherLicenses || 'Not provided'}</p>
          )}
        </div>
      </div>
    </div>
  </div>
);

export const AgencyServicesInfo = ({ user, isEditing, editData, setEditData }) => (
  <div className="bg-white overflow-hidden shadow rounded-lg">
    <div className="px-4 py-5 sm:p-6">
      <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Services & Coverage</h3>
      <div className="space-y-6">
        
        {/* Services Provided */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Services Provided</label>
          {isEditing ? (
            <div className="space-y-2">
              {['Agency Hire', 'Direct Hire'].map(service => (
                <label key={service} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={(editData.servicesProvided || []).includes(service)}
                    onChange={(e) => {
                      const current = editData.servicesProvided || [];
                      const newServices = e.target.checked
                        ? [...current, service]
                        : current.filter(s => s !== service);
                      setEditData({...editData, servicesProvided: newServices});
                    }}
                    className="mr-2"
                  />
                  {service}
                </label>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {(user?.servicesProvided || []).length > 0 ? (
                user.servicesProvided.map((service, index) => (
                  <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {service}
                  </span>
                ))
              ) : (
                <p className="text-sm text-gray-900">None specified</p>
              )}
            </div>
          )}
        </div>

        {/* Countries of Helpers */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Countries of Helpers</label>
          {isEditing ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {[
                'Indonesia', 'Philippines', 'Myanmar', 'Sri Lanka', 'India', 'Bangladesh',
                'Cambodia', 'Malaysia', 'Thailand', 'Hong Kong', 'Macau', 'South Korea', 'Taiwan'
              ].map(country => (
                <label key={country} className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={(editData.countriesOfHelpers || []).includes(country)}
                    onChange={(e) => {
                      const current = editData.countriesOfHelpers || [];
                      const newCountries = e.target.checked
                        ? [...current, country]
                        : current.filter(c => c !== country);
                      setEditData({...editData, countriesOfHelpers: newCountries});
                    }}
                    className="mr-2"
                  />
                  {country}
                </label>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {(user?.countriesOfHelpers || []).length > 0 ? (
                user.countriesOfHelpers.map((country, index) => (
                  <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    {country}
                  </span>
                ))
              ) : (
                <p className="text-sm text-gray-900">None specified</p>
              )}
            </div>
          )}
        </div>

        {/* Specializations */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Specializations</label>
          <div className="flex flex-wrap gap-2">
            {(user?.specializations || []).length > 0 ? (
              user.specializations.map((spec, index) => (
                <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  {spec.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              ))
            ) : (
              <p className="text-sm text-gray-900">None specified</p>
            )}
          </div>
        </div>

        {/* Service Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Service Description</label>
          {isEditing ? (
            <textarea
              value={editData.serviceDescription}
              onChange={(e) => setEditData({...editData, serviceDescription: e.target.value})}
              rows={4}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Describe your agency's unique approach, processes, quality assurance measures..."
            />
          ) : (
            <p className="mt-1 text-sm text-gray-900">{user?.serviceDescription || 'Not provided'}</p>
          )}
        </div>
      </div>
    </div>
  </div>
);

export const AgencyFeesInfo = ({ user, isEditing, editData, setEditData }) => {
  const CURRENCIES = [
    { code: 'SGD', name: 'Singapore Dollar (SGD)', symbol: 'S$' },
    { code: 'USD', name: 'US Dollar (USD)', symbol: '$' },
    { code: 'MYR', name: 'Malaysian Ringgit (MYR)', symbol: 'RM' },
    { code: 'HKD', name: 'Hong Kong Dollar (HKD)', symbol: 'HK$' },
    { code: 'IDR', name: 'Indonesian Rupiah (IDR)', symbol: 'Rp' },
    { code: 'PHP', name: 'Philippine Peso (PHP)', symbol: '₱' }
  ];

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Fees & Policies</h3>
        <div className="space-y-6">
          
          {/* Agency Fee */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Agency Fee Structure</label>
            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600">Currency</label>
                    <select
                      value={editData.agencyFee?.currency || ''}
                      onChange={(e) => setEditData({
                        ...editData,
                        agencyFee: { ...editData.agencyFee, currency: e.target.value }
                      })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="">Select Currency</option>
                      {CURRENCIES.map(currency => (
                        <option key={currency.code} value={currency.code}>{currency.code}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600">Minimum Fee</label>
                    <input
                      type="number"
                      value={editData.agencyFee?.minAmount || ''}
                      onChange={(e) => setEditData({
                        ...editData,
                        agencyFee: { ...editData.agencyFee, minAmount: e.target.value }
                      })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600">Maximum Fee</label>
                    <input
                      type="number"
                      value={editData.agencyFee?.maxAmount || ''}
                      onChange={(e) => setEditData({
                        ...editData,
                        agencyFee: { ...editData.agencyFee, maxAmount: e.target.value }
                      })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-900">
                {user?.agencyFee?.currency && user?.agencyFee?.minAmount && user?.agencyFee?.maxAmount ? (
                  <>
                    {CURRENCIES.find(c => c.code === user.agencyFee.currency)?.symbol}
                    {user.agencyFee.minAmount} - {CURRENCIES.find(c => c.code === user.agencyFee.currency)?.symbol}
                    {user.agencyFee.maxAmount} {user.agencyFee.currency}
                  </>
                ) : (
                  'Not specified'
                )}
              </p>
            )}
          </div>

          {/* Replacement Policy */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Replacement Policy</label>
            {isEditing ? (
              <div className="space-y-2">
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="providesReplacement"
                      value="yes"
                      checked={editData.providesReplacement === 'yes'}
                      onChange={(e) => setEditData({...editData, providesReplacement: e.target.value})}
                      className="mr-2"
                    />
                    Yes, we provide replacements
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="providesReplacement"
                      value="no"
                      checked={editData.providesReplacement === 'no'}
                      onChange={(e) => setEditData({...editData, providesReplacement: e.target.value})}
                      className="mr-2"
                    />
                    No replacements
                  </label>
                </div>
                {editData.providesReplacement === 'yes' && (
                  <div className="ml-4 space-y-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-600">Number of Replacements</label>
                      <select
                        value={editData.replacementCount || ''}
                        onChange={(e) => setEditData({...editData, replacementCount: e.target.value})}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        <option value="">Select number</option>
                        <option value="1">1 replacement</option>
                        <option value="2">2 replacements</option>
                        <option value="3">3 replacements</option>
                        <option value="unlimited">Unlimited</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-900">
                {user?.providesReplacement === 'yes' ? (
                  <>Yes ({user?.replacementCount || 'Number not specified'})</>
                ) : user?.providesReplacement === 'no' ? (
                  'No'
                ) : (
                  'Not specified'
                )}
              </p>
            )}
          </div>

          {/* Payment Terms */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Terms</label>
            <div className="flex flex-wrap gap-2">
              {(user?.paymentTerms || []).length > 0 ? (
                user.paymentTerms.map((term, index) => (
                  <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {term.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                ))
              ) : (
                <p className="text-sm text-gray-900">None specified</p>
              )}
            </div>
          </div>

          {/* Additional Policies */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Additional Policies & Terms</label>
            {isEditing ? (
              <textarea
                value={editData.additionalPolicies}
                onChange={(e) => setEditData({...editData, additionalPolicies: e.target.value})}
                rows={4}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Include any other important policies, terms of service, cancellation policies..."
              />
            ) : (
              <p className="mt-1 text-sm text-gray-900">{user?.additionalPolicies || 'Not provided'}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
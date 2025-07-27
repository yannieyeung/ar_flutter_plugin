import React from 'react';

const AgencyFeesStep = ({ data, onChange, errors }) => {
  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  const handleNestedChange = (parentField, childField, value) => {
    onChange({ 
      ...data, 
      [parentField]: { 
        ...data[parentField], 
        [childField]: value 
      } 
    });
  };

  const CURRENCIES = [
    { code: 'SGD', name: 'Singapore Dollar (SGD)', symbol: 'S$' },
    { code: 'USD', name: 'US Dollar (USD)', symbol: '$' },
    { code: 'MYR', name: 'Malaysian Ringgit (MYR)', symbol: 'RM' },
    { code: 'HKD', name: 'Hong Kong Dollar (HKD)', symbol: 'HK$' },
    { code: 'IDR', name: 'Indonesian Rupiah (IDR)', symbol: 'Rp' },
    { code: 'PHP', name: 'Philippine Peso (PHP)', symbol: '₱' }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Fees & Policies</h2>
        <p className="text-gray-600">Set your agency fees and replacement policies</p>
      </div>

      <div className="space-y-8">
        {/* Agency Fee */}
        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <h3 className="text-lg font-medium text-green-800 mb-4">💰 Agency Fee Structure</h3>
          
          <div className="space-y-4">
            {/* Currency Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Currency <span className="text-red-500">*</span>
              </label>
              <select
                value={data.agencyFee?.currency || ''}
                onChange={(e) => handleNestedChange('agencyFee', 'currency', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Currency</option>
                {CURRENCIES.map(currency => (
                  <option key={currency.code} value={currency.code}>
                    {currency.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Fee Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Fee <span className="text-red-500">*</span>
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 py-2 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-l-md">
                    {CURRENCIES.find(c => c.code === data.agencyFee?.currency)?.symbol || '$'}
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={data.agencyFee?.minAmount || ''}
                    onChange={(e) => handleNestedChange('agencyFee', 'minAmount', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="1000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Fee <span className="text-red-500">*</span>
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 py-2 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-l-md">
                    {CURRENCIES.find(c => c.code === data.agencyFee?.currency)?.symbol || '$'}
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={data.agencyFee?.maxAmount || ''}
                    onChange={(e) => handleNestedChange('agencyFee', 'maxAmount', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="2000"
                  />
                </div>
              </div>
            </div>

            {errors.agencyFee && <p className="text-red-500 text-sm mt-2">{errors.agencyFee}</p>}

            {/* Fee Structure Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fee Structure (Optional)
              </label>
              <select
                value={data.agencyFee?.structure || ''}
                onChange={(e) => handleNestedChange('agencyFee', 'structure', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select fee structure</option>
                <option value="one_time">One-time payment</option>
                <option value="split_payment">Split payment (e.g., 50% upfront, 50% after probation)</option>
                <option value="monthly_installments">Monthly installments</option>
                <option value="performance_based">Performance-based (varies with service quality)</option>
              </select>
            </div>

            {/* Additional Fee Information */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fee Details & Inclusions (Optional)
              </label>
              <textarea
                value={data.agencyFee?.details || ''}
                onChange={(e) => handleNestedChange('agencyFee', 'details', e.target.value)}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe what's included in your fee (e.g., replacement guarantee, orientation, documentation assistance, ongoing support)..."
              />
            </div>
          </div>
        </div>

        {/* Replacement Policy */}
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h3 className="text-lg font-medium text-blue-800 mb-4">🔄 Replacement Policy</h3>
          
          <div className="space-y-4">
            {/* Provides Replacement */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Do you provide replacement of helpers? <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="providesReplacement"
                    value="yes"
                    checked={data.providesReplacement === 'yes'}
                    onChange={(e) => handleChange('providesReplacement', e.target.value)}
                    className="mr-2"
                  />
                  Yes, we provide replacement helpers
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="providesReplacement"
                    value="no"
                    checked={data.providesReplacement === 'no'}
                    onChange={(e) => handleChange('providesReplacement', e.target.value)}
                    className="mr-2"
                  />
                  No, we do not provide replacements
                </label>
              </div>
              {errors.providesReplacement && <p className="text-red-500 text-sm mt-2">{errors.providesReplacement}</p>}
            </div>

            {/* Replacement Details (if yes) */}
            {data.providesReplacement === 'yes' && (
              <div className="space-y-4 ml-6 p-4 bg-white rounded-lg border border-blue-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Replacements Provided
                  </label>
                  <select
                    value={data.replacementCount || ''}
                    onChange={(e) => handleChange('replacementCount', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select number of replacements</option>
                    <option value="1">1 replacement</option>
                    <option value="2">2 replacements</option>
                    <option value="3">3 replacements</option>
                    <option value="unlimited">Unlimited (within guarantee period)</option>
                    <option value="negotiable">Negotiable based on circumstances</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Replacement Guarantee Period (Optional)
                  </label>
                  <select
                    value={data.replacementPeriod || ''}
                    onChange={(e) => handleChange('replacementPeriod', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select guarantee period</option>
                    <option value="3_months">3 months</option>
                    <option value="6_months">6 months</option>
                    <option value="12_months">12 months</option>
                    <option value="lifetime">Lifetime guarantee</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Replacement Conditions (Optional)
                  </label>
                  <textarea
                    value={data.replacementConditions || ''}
                    onChange={(e) => handleChange('replacementConditions', e.target.value)}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Specify conditions for replacement (e.g., reasons that qualify for replacement, timeframe for finding replacement, any additional costs)..."
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Payment Terms */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Payment Terms & Conditions (Optional)
          </label>
          
          <div className="space-y-3">
            {[
              { value: 'full_upfront', label: 'Full payment required upfront' },
              { value: 'partial_upfront', label: 'Partial payment upfront, balance after probation period' },
              { value: 'no_upfront', label: 'No upfront payment required' },
              { value: 'refund_policy', label: 'Refund policy available for unsatisfactory service' },
              { value: 'installments', label: 'Payment installments accepted' }
            ].map(term => (
              <label key={term.value} className="flex items-center">
                <input
                  type="checkbox"
                  checked={(data.paymentTerms || []).includes(term.value)}
                  onChange={(e) => {
                    const current = data.paymentTerms || [];
                    const newTerms = e.target.checked
                      ? [...current, term.value]
                      : current.filter(t => t !== term.value);
                    handleChange('paymentTerms', newTerms);
                  }}
                  className="mr-2"
                />
                {term.label}
              </label>
            ))}
          </div>
        </div>

        {/* Additional Policies */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Policies & Terms (Optional)
          </label>
          <textarea
            value={data.additionalPolicies || ''}
            onChange={(e) => handleChange('additionalPolicies', e.target.value)}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Include any other important policies, terms of service, cancellation policies, or special conditions..."
          />
        </div>
      </div>

      {/* Fee Summary */}
      <div className="bg-gray-100 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-gray-800 mb-2">Fee Summary:</h4>
        <div className="text-sm text-gray-600 space-y-1">
          <p>
            <strong>Fee Range:</strong> {
              data.agencyFee?.currency && data.agencyFee?.minAmount && data.agencyFee?.maxAmount
                ? `${CURRENCIES.find(c => c.code === data.agencyFee.currency)?.symbol}${data.agencyFee.minAmount} - ${CURRENCIES.find(c => c.code === data.agencyFee.currency)?.symbol}${data.agencyFee.maxAmount} ${data.agencyFee.currency}`
                : 'Not specified'
            }
          </p>
          <p><strong>Replacement Service:</strong> {data.providesReplacement === 'yes' ? `Yes (${data.replacementCount || 'Not specified'})` : data.providesReplacement === 'no' ? 'No' : 'Not specified'}</p>
          <p><strong>Payment Terms:</strong> {(data.paymentTerms || []).length} selected</p>
        </div>
      </div>
    </div>
  );
};

export default AgencyFeesStep;
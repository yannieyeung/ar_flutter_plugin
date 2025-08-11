import React from 'react';

export const HelperPersonalInfo = ({ user, isEditing, editData, setEditData, handleLanguageChange, addLanguage, removeLanguage, formatDate, calculateAge }) => (
  <div className="bg-white overflow-hidden shadow-lg rounded-2xl border border-slate-200">
    <div className="px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-slate-900 flex items-center">
          <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Personal Information
        </h3>
      </div>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
          {isEditing ? (
            <input
              type="text"
              value={editData.fullName || ''}
              onChange={(e) => setEditData({...editData, fullName: e.target.value})}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          ) : (
            <p className="text-slate-900 font-medium">{user?.fullName || 'Not provided'}</p>
          )}
        </div>

        {/* Contact Number */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Contact Number</label>
          {isEditing ? (
            <input
              type="text"
              value={editData.contactNumber || ''}
              onChange={(e) => setEditData({...editData, contactNumber: e.target.value})}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          ) : (
            <p className="text-slate-900">{user?.contactNumber || 'Not provided'}</p>
          )}
        </div>

        {/* Email/Phone */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Email/Phone</label>
          <p className="text-slate-900">{user?.email || user?.phoneNumber || 'Not provided'}</p>
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Date of Birth</label>
          {isEditing ? (
            <input
              type="date"
              value={editData.dateOfBirth || ''}
              onChange={(e) => setEditData({...editData, dateOfBirth: e.target.value})}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          ) : (
            <div>
              <p className="text-slate-900">{formatDate(user?.dateOfBirth)}</p>
              {user?.dateOfBirth && (
                <p className="text-slate-500 text-sm">Age: {calculateAge(user.dateOfBirth)} years old</p>
              )}
            </div>
          )}
        </div>

        {/* Nationality */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Nationality</label>
          {isEditing ? (
            <input
              type="text"
              value={editData.nationality || ''}
              onChange={(e) => setEditData({...editData, nationality: e.target.value})}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          ) : (
            <p className="text-slate-900">{user?.nationality || 'Not provided'}</p>
          )}
        </div>

        {/* Country of Birth */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Country of Birth</label>
          {isEditing ? (
            <input
              type="text"
              value={editData.countryOfBirth || ''}
              onChange={(e) => setEditData({...editData, countryOfBirth: e.target.value})}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          ) : (
            <p className="text-slate-900">{user?.countryOfBirth || 'Not provided'}</p>
          )}
        </div>

        {/* City of Birth */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">City of Birth</label>
          {isEditing ? (
            <input
              type="text"
              value={editData.cityOfBirth || ''}
              onChange={(e) => setEditData({...editData, cityOfBirth: e.target.value})}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          ) : (
            <p className="text-slate-900">{user?.cityOfBirth || 'Not provided'}</p>
          )}
        </div>

        {/* Religion */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Religion</label>
          {isEditing ? (
            <input
              type="text"
              value={editData.religion || ''}
              onChange={(e) => setEditData({...editData, religion: e.target.value})}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          ) : (
            <p className="text-slate-900">{user?.religion || 'Not provided'}</p>
          )}
        </div>

        {/* Education Level */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Education Level</label>
          {isEditing ? (
            <select
              value={editData.educationLevel || ''}
              onChange={(e) => setEditData({...editData, educationLevel: e.target.value})}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="">Select education level</option>
              <option value="primary_school">Primary School</option>
              <option value="secondary_school">Secondary School</option>
              <option value="high_school">High School</option>
              <option value="university">University</option>
              <option value="postgraduate">Postgraduate</option>
            </select>
          ) : (
            <p className="text-slate-900 capitalize">
              {user?.educationLevel?.replace('_', ' ') || 'Not provided'}
            </p>
          )}
        </div>

        {/* Marital Status */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Marital Status</label>
          {isEditing ? (
            <select
              value={editData.maritalStatus || ''}
              onChange={(e) => setEditData({...editData, maritalStatus: e.target.value})}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="">Select marital status</option>
              <option value="single">Single</option>
              <option value="married">Married</option>
              <option value="divorced">Divorced</option>
              <option value="widowed">Widowed</option>
            </select>
          ) : (
            <p className="text-slate-900 capitalize">{user?.maritalStatus || 'Not provided'}</p>
          )}
        </div>

        {/* Height */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Height (cm)</label>
          {isEditing ? (
            <input
              type="number"
              value={editData.height || ''}
              onChange={(e) => setEditData({...editData, height: e.target.value})}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              min="120"
              max="220"
            />
          ) : (
            <p className="text-slate-900">{user?.height ? `${user.height} cm` : 'Not provided'}</p>
          )}
        </div>

        {/* Weight */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Weight (kg)</label>
          {isEditing ? (
            <input
              type="number"
              value={editData.weight || ''}
              onChange={(e) => setEditData({...editData, weight: e.target.value})}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              min="30"
              max="200"
            />
          ) : (
            <p className="text-slate-900">{user?.weight ? `${user.weight} kg` : 'Not provided'}</p>
          )}
        </div>

        {/* Number of Siblings */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Number of Siblings</label>
          {isEditing ? (
            <select
              value={editData.numberOfSiblings || ''}
              onChange={(e) => setEditData({...editData, numberOfSiblings: e.target.value})}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="">Select number</option>
              {[...Array(11)].map((_, i) => (
                <option key={i} value={i}>{i}</option>
              ))}
            </select>
          ) : (
            <p className="text-slate-900">{user?.numberOfSiblings || 'Not provided'}</p>
          )}
        </div>

        {/* Number of Children */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Number of Children</label>
          {isEditing ? (
            <select
              value={editData.numberOfChildren || ''}
              onChange={(e) => setEditData({...editData, numberOfChildren: e.target.value})}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="">Select number</option>
              {[...Array(11)].map((_, i) => (
                <option key={i} value={i}>{i}</option>
              ))}
            </select>
          ) : (
            <p className="text-slate-900">{user?.numberOfChildren || 'Not provided'}</p>
          )}
        </div>

        {/* Helper Experience Status */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-2">Previous Helper Experience</label>
          {isEditing ? (
            <div className="flex space-x-6">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="hasBeenHelperBefore"
                  value="yes"
                  checked={editData.hasBeenHelperBefore === 'yes'}
                  onChange={(e) => setEditData({...editData, hasBeenHelperBefore: e.target.value})}
                  className="mr-2 text-blue-600"
                />
                Yes, I have experience
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="hasBeenHelperBefore"
                  value="no"
                  checked={editData.hasBeenHelperBefore === 'no'}
                  onChange={(e) => setEditData({...editData, hasBeenHelperBefore: e.target.value})}
                  className="mr-2 text-blue-600"
                />
                No, I'm new to this
              </label>
            </div>
          ) : (
            <p className="text-slate-900">
              {user?.hasBeenHelperBefore === 'yes' ? 'Yes, I have experience' : 
               user?.hasBeenHelperBefore === 'no' ? 'No, I\'m new to this' : 'Not provided'}
            </p>
          )}
        </div>

        {/* Residential Address */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-2">Residential Address</label>
          {isEditing ? (
            <textarea
              value={editData.residentialAddress || ''}
              onChange={(e) => setEditData({...editData, residentialAddress: e.target.value})}
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          ) : (
            <p className="text-slate-900">{user?.residentialAddress || 'Not provided'}</p>
          )}
        </div>

        {/* Emergency Contact */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-2">Emergency Contact</label>
          {isEditing ? (
            <input
              type="text"
              value={editData.emergencyContact || ''}
              onChange={(e) => setEditData({...editData, emergencyContact: e.target.value})}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Name and phone number"
            />
          ) : (
            <p className="text-slate-900">{user?.emergencyContact || 'Not provided'}</p>
          )}
        </div>

        {/* Repatriation Port */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-2">Repatriation Port/Airport</label>
          {isEditing ? (
            <input
              type="text"
              value={editData.repatriationPort || ''}
              onChange={(e) => setEditData({...editData, repatriationPort: e.target.value})}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          ) : (
            <p className="text-slate-900">{user?.repatriationPort || 'Not provided'}</p>
          )}
        </div>

        {/* Languages */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-2">Languages Spoken</label>
          {isEditing ? (
            <div className="space-y-3">
              {(editData.experience?.languagesSpoken || []).map((langObj, index) => (
                <div key={index} className="border border-slate-200 rounded-lg p-3 bg-slate-50">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Language</label>
                      <input
                        type="text"
                        value={langObj.language || ''}
                        onChange={(e) => handleLanguageChange(index, 'language', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        placeholder="e.g., Mandarin"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Proficiency</label>
                      <select
                        value={langObj.proficiency || 'basic'}
                        onChange={(e) => handleLanguageChange(index, 'proficiency', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      >
                        <option value="basic">Basic</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                        <option value="native">Native</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Can Teach Children</label>
                      <div className="flex items-center space-x-4 mt-2">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name={`canTeach-${index}`}
                            checked={langObj.canTeach === true}
                            onChange={() => handleLanguageChange(index, 'canTeach', true)}
                            className="mr-1 text-blue-600"
                          />
                          <span className="text-sm">Yes</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name={`canTeach-${index}`}
                            checked={langObj.canTeach === false}
                            onChange={() => handleLanguageChange(index, 'canTeach', false)}
                            className="mr-1 text-blue-600"
                          />
                          <span className="text-sm">No</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeLanguage(index)}
                    className="mt-2 text-red-600 hover:text-red-800 text-xs font-medium"
                  >
                    Remove Language
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addLanguage}
                className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-100 transition-colors"
              >
                + Add Language
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {(() => {
                // Check multiple possible locations for language data
                const languagesSpoken = user?.experience?.languagesSpoken || 
                                      editData?.experience?.languagesSpoken || 
                                      [];
                
                return languagesSpoken.length > 0 ? languagesSpoken.map((langObj, index) => (
                  <div key={index} className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-slate-900">{langObj.language || 'Unknown Language'}</h4>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          langObj.proficiency === 'native' ? 'bg-green-100 text-green-800' :
                          langObj.proficiency === 'advanced' ? 'bg-blue-100 text-blue-800' :
                          langObj.proficiency === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {langObj.proficiency === 'native' ? 'Native' :
                           langObj.proficiency === 'advanced' ? 'Advanced' :
                           langObj.proficiency === 'intermediate' ? 'Intermediate' :
                           'Basic'}
                        </span>
                        {langObj.canTeach && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            Can Teach
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-slate-600">
                      <span className="font-medium">Proficiency:</span> {
                        langObj.proficiency === 'native' ? 'Native speaker' :
                        langObj.proficiency === 'advanced' ? 'Advanced level' :
                        langObj.proficiency === 'intermediate' ? 'Intermediate level' :
                        'Basic level'
                      }
                      {langObj.canTeach !== undefined && (
                        <>
                          <span className="mx-2">•</span>
                          <span className="font-medium">Can teach children:</span> {langObj.canTeach ? 'Yes' : 'No'}
                        </>
                      )}
                    </div>
                  </div>
                )) : <p className="text-slate-900">No languages specified</p>;
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

export const HelperMedicalInfo = ({ user, isEditing, editData, setEditData }) => (
  <div className="bg-white overflow-hidden shadow-lg rounded-2xl border border-slate-200">
    <div className="px-6 py-6">
      <h3 className="text-xl font-semibold text-slate-900 mb-6 flex items-center">
        <svg className="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Medical Information
      </h3>
      
      <div className="space-y-6">
        {/* Allergies */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">Do you have any allergies?</label>
          {isEditing ? (
            <div className="space-y-3">
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="hasAllergies"
                    value="yes"
                    checked={editData.hasAllergies === 'yes'}
                    onChange={(e) => setEditData({...editData, hasAllergies: e.target.value})}
                    className="mr-2 text-blue-600"
                  />
                  Yes
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="hasAllergies"
                    value="no"
                    checked={editData.hasAllergies === 'no'}
                    onChange={(e) => setEditData({...editData, hasAllergies: e.target.value})}
                    className="mr-2 text-blue-600"
                  />
                  No
                </label>
              </div>
              {editData.hasAllergies === 'yes' && (
                <textarea
                  value={editData.allergiesDetails || ''}
                  onChange={(e) => setEditData({...editData, allergiesDetails: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Please describe your allergies..."
                  rows="3"
                />
              )}
            </div>
          ) : (
            <div>
              <p className="text-slate-900 font-medium">
                {user?.hasAllergies === 'yes' ? 'Yes' : user?.hasAllergies === 'no' ? 'No' : 'Not provided'}
              </p>
              {user?.hasAllergies === 'yes' && user?.allergiesDetails && (
                <p className="text-slate-600 mt-2 bg-slate-50 p-3 rounded-lg">{user.allergiesDetails}</p>
              )}
            </div>
          )}
        </div>

        {/* Past Illness */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">Any past serious illness or surgery?</label>
          {isEditing ? (
            <div className="space-y-3">
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="hasPastIllness"
                    value="yes"
                    checked={editData.hasPastIllness === 'yes'}
                    onChange={(e) => setEditData({...editData, hasPastIllness: e.target.value})}
                    className="mr-2 text-blue-600"
                  />
                  Yes
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="hasPastIllness"
                    value="no"
                    checked={editData.hasPastIllness === 'no'}
                    onChange={(e) => setEditData({...editData, hasPastIllness: e.target.value})}
                    className="mr-2 text-blue-600"
                  />
                  No
                </label>
              </div>
              {editData.hasPastIllness === 'yes' && (
                <textarea
                  value={editData.illnessDetails || ''}
                  onChange={(e) => setEditData({...editData, illnessDetails: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Please describe..."
                  rows="3"
                />
              )}
            </div>
          ) : (
            <div>
              <p className="text-slate-900 font-medium">
                {user?.hasPastIllness === 'yes' ? 'Yes' : user?.hasPastIllness === 'no' ? 'No' : 'Not provided'}
              </p>
              {user?.hasPastIllness === 'yes' && (user?.illnessDetails || user?.pastIllnessDetails) && (
                <p className="text-slate-600 mt-2 bg-slate-50 p-3 rounded-lg">{user.illnessDetails || user.pastIllnessDetails}</p>
              )}
            </div>
          )}
        </div>

        {/* Physical Disabilities */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">Any physical disabilities?</label>
          {isEditing ? (
            <div className="space-y-3">
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="hasPhysicalDisabilities"
                    value="yes"
                    checked={editData.hasPhysicalDisabilities === 'yes'}
                    onChange={(e) => setEditData({...editData, hasPhysicalDisabilities: e.target.value})}
                    className="mr-2 text-blue-600"
                  />
                  Yes
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="hasPhysicalDisabilities"
                    value="no"
                    checked={editData.hasPhysicalDisabilities === 'no'}
                    onChange={(e) => setEditData({...editData, hasPhysicalDisabilities: e.target.value})}
                    className="mr-2 text-blue-600"
                  />
                  No
                </label>
              </div>
              {editData.hasPhysicalDisabilities === 'yes' && (
                <textarea
                  value={editData.disabilitiesDetails || ''}
                  onChange={(e) => setEditData({...editData, disabilitiesDetails: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Please describe..."
                  rows="3"
                />
              )}
            </div>
          ) : (
            <div>
              <p className="text-slate-900 font-medium">
                {user?.hasPhysicalDisabilities === 'yes' ? 'Yes' : user?.hasPhysicalDisabilities === 'no' ? 'No' : 'Not provided'}
              </p>
              {user?.hasPhysicalDisabilities === 'yes' && (user?.disabilitiesDetails || user?.physicalDisabilitiesDetails) && (
                <p className="text-slate-600 mt-2 bg-slate-50 p-3 rounded-lg">{user.disabilitiesDetails || user.physicalDisabilitiesDetails}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

// NEW: Experience Information Section
export const HelperExperienceInfo = ({ user, isEditing, editData, setEditData }) => {
  const handleExperienceChange = (skillType, field, value) => {
    setEditData(prev => {
      const newData = {
        ...prev,
        experience: {
          ...prev.experience,
          [skillType]: {
            ...prev.experience?.[skillType],
            [field]: value
          }
        }
      };

      // Initialize countryExperiences when hasExperience is set to true
      if (field === 'hasExperience' && value === true && !newData.experience[skillType].countryExperiences) {
        newData.experience[skillType].countryExperiences = [{ country: '', startYear: '', endYear: '' }];
      }

      return newData;
    });
  };

  const skillTypes = [
    { key: 'careOfInfant', label: 'Care of Infant (0-2 years)' },
    { key: 'careOfChildren', label: 'Care of Children (3-12 years)' },
    { key: 'careOfDisabled', label: 'Care of Disabled' },
    { key: 'careOfOldAge', label: 'Care of Elderly' },
    { key: 'generalHousework', label: 'General Housework' },
    { key: 'cooking', label: 'Cooking' }
  ];

  return (
    <div className="bg-white overflow-hidden shadow-lg rounded-2xl border border-slate-200">
      <div className="px-6 py-6">
        <h3 className="text-xl font-semibold text-slate-900 mb-6 flex items-center">
          <svg className="w-6 h-6 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 8.172V5L8 4z" />
          </svg>
          Experience & Skills
        </h3>
        
        {user?.hasBeenHelperBefore === 'yes' ? (
          <div className="space-y-6">
            {skillTypes.map(({ key, label }) => {
              const experienceData = user?.experience?.[key] || {};
              const editExperienceData = editData?.experience?.[key] || {};
              
              return (
                <div key={key} className="bg-slate-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-slate-900 mb-3">{label}</h4>
                  
                  {isEditing ? (
                    <div className="space-y-4">
                      {/* Has Experience */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Experience</label>
                        <select
                          value={editExperienceData.hasExperience || ''}
                          onChange={(e) => handleExperienceChange(key, 'hasExperience', e.target.value === 'true')}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select</option>
                          <option value="true">Yes</option>
                          <option value="false">No</option>
                        </select>
                      </div>

                      {editExperienceData.hasExperience && (
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <label className="block text-sm font-medium text-slate-700">Work Experience by Country</label>
                            <button
                              type="button"
                              onClick={() => {
                                const currentEntries = editExperienceData.countryExperiences || [{ country: '', startYear: '', endYear: '' }];
                                handleExperienceChange(key, 'countryExperiences', [
                                  ...currentEntries,
                                  { country: '', startYear: '', endYear: '' }
                                ]);
                              }}
                              className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-600 text-sm font-medium rounded-md hover:bg-blue-100"
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                              Add Country
                            </button>
                          </div>
                          
                          {((editExperienceData.countryExperiences?.length > 0) 
                            ? editExperienceData.countryExperiences 
                            : [{ country: '', startYear: '', endYear: '' }]
                          ).map((entry, index) => (
                            <div key={index} className="border border-slate-200 rounded-lg p-3 bg-white">
                              <div className="flex justify-between items-start mb-3">
                                <h5 className="text-sm font-medium text-slate-700">Experience #{index + 1}</h5>
                                {index > 0 && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const currentEntries = editExperienceData.countryExperiences || [];
                                      const newEntries = currentEntries.filter((_, i) => i !== index);
                                      handleExperienceChange(key, 'countryExperiences', newEntries);
                                    }}
                                    className="text-red-500 hover:text-red-700 text-sm"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                )}
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div>
                                  <label className="block text-sm font-medium text-slate-700 mb-1">Country</label>
                                  <select
                                    value={entry.country || ''}
                                    onChange={(e) => {
                                      const currentEntries = editExperienceData.countryExperiences || [];
                                      const newEntries = currentEntries.map((exp, i) => 
                                        i === index ? { ...exp, country: e.target.value } : exp
                                      );
                                      handleExperienceChange(key, 'countryExperiences', newEntries);
                                    }}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                  >
                                    <option value="">Select Country</option>
                                    <option value="Singapore">Singapore</option>
                                    <option value="Hong Kong">Hong Kong</option>
                                    <option value="Malaysia">Malaysia</option>
                                    <option value="UAE">UAE</option>
                                    <option value="Saudi Arabia">Saudi Arabia</option>
                                    <option value="Qatar">Qatar</option>
                                    <option value="Kuwait">Kuwait</option>
                                    <option value="Taiwan">Taiwan</option>
                                    <option value="Philippines">Philippines</option>
                                    <option value="Indonesia">Indonesia</option>
                                    <option value="Myanmar">Myanmar</option>
                                    <option value="Sri Lanka">Sri Lanka</option>
                                    <option value="India">India</option>
                                    <option value="Others">Others</option>
                                  </select>
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-medium text-slate-700 mb-1">Start Year</label>
                                  <input
                                    type="number"
                                    value={entry.startYear || ''}
                                    onChange={(e) => {
                                      const currentEntries = editExperienceData.countryExperiences || [];
                                      const newEntries = currentEntries.map((exp, i) => 
                                        i === index ? { ...exp, startYear: parseInt(e.target.value) || '' } : exp
                                      );
                                      handleExperienceChange(key, 'countryExperiences', newEntries);
                                    }}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    min="1990"
                                    max={new Date().getFullYear()}
                                    placeholder="e.g., 2018"
                                  />
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-medium text-slate-700 mb-1">End Year</label>
                                  <input
                                    type="number"
                                    value={entry.endYear || ''}
                                    onChange={(e) => {
                                      const currentEntries = editExperienceData.countryExperiences || [];
                                      const newEntries = currentEntries.map((exp, i) => 
                                        i === index ? { ...exp, endYear: parseInt(e.target.value) || '' } : exp
                                      );
                                      handleExperienceChange(key, 'countryExperiences', newEntries);
                                    }}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    min="1990"
                                    max={new Date().getFullYear()}
                                    placeholder="Current"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-slate-900">
                        <span className="font-medium">Experience:</span> {experienceData.hasExperience ? 'Yes' : 'No'}
                      </p>
                      {experienceData.hasExperience && (
                        <div className="space-y-3">
                          {/* Display country experiences if available */}
                          {experienceData.countryExperiences?.length > 0 ? (
                            <div>
                              <p className="text-sm font-medium text-slate-700 mb-2">Work Experience by Country:</p>
                              {experienceData.countryExperiences.map((exp, index) => (
                                <div key={index} className="bg-white p-3 rounded border border-slate-200 mb-2">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <p className="font-medium text-slate-900">{exp.country || 'Unknown Country'}</p>
                                      <p className="text-sm text-slate-600">
                                        {exp.startYear || 'N/A'} - {exp.endYear || 'Ongoing'}
                                        {exp.startYear && (
                                          <span className="ml-2 text-slate-500">
                                            ({Math.max(0, (exp.endYear || new Date().getFullYear()) - exp.startYear + 1)} years)
                                          </span>
                                        )}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                              {/* Total summary */}
                              <div className="bg-blue-50 p-2 rounded text-sm text-blue-800">
                                <strong>Total Experience:</strong> {
                                  (() => {
                                    const totalYears = experienceData.countryExperiences.reduce((total, exp) => {
                                      if (exp.startYear) {
                                        return total + Math.max(0, (exp.endYear || new Date().getFullYear()) - exp.startYear + 1);
                                      }
                                      return total;
                                    }, 0);
                                    const countries = [...new Set(experienceData.countryExperiences.filter(exp => exp.country).map(exp => exp.country))];
                                    return `${totalYears} years across ${countries.join(', ')}`;
                                  })()
                                }
                              </div>
                            </div>
                          ) : (
                            /* Fall back to legacy single experience display */
                            <p className="text-slate-700">
                              <span className="font-medium">Period:</span> {experienceData.startYear || 'N/A'} - {experienceData.endYear || 'Ongoing'}
                            </p>
                          )}
                          {experienceData.startYear && (
                            <p className="text-slate-600 text-sm">
                              <span className="font-medium">Duration:</span> {
                                experienceData.endYear 
                                  ? `${experienceData.endYear - experienceData.startYear} years`
                                  : `${new Date().getFullYear() - experienceData.startYear} years (ongoing)`
                              }
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-blue-800">No previous helper experience. This is a new helper.</p>
            {(user?.relevantSkills || user?.previousWork) && (
              <div className="mt-4 space-y-3">
                {user?.relevantSkills && (
                  <div>
                    <h4 className="font-medium text-slate-900 mb-2">Relevant Skills</h4>
                    {isEditing ? (
                      <textarea
                        value={editData.relevantSkills || ''}
                        onChange={(e) => setEditData({...editData, relevantSkills: e.target.value})}
                        rows={3}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <p className="text-slate-700">{user.relevantSkills}</p>
                    )}
                  </div>
                )}
                {user?.previousWork && (
                  <div>
                    <h4 className="font-medium text-slate-900 mb-2">Previous Work Experience</h4>
                    {isEditing ? (
                      <textarea
                        value={editData.previousWork || ''}
                        onChange={(e) => setEditData({...editData, previousWork: e.target.value})}
                        rows={3}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <p className="text-slate-700">{user.previousWork}</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// NEW: Preferences Information Section  
export const HelperPreferencesInfo = ({ user, isEditing, editData, setEditData }) => {
  const handlePreferenceChange = (category, field, value) => {
    setEditData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [category]: {
          ...prev.preferences?.[category],
          [field]: value
        }
      }
    }));
  };

  const handleLocationPreferenceChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        location: {
          ...prev.preferences?.location,
          [field]: value
        }
      }
    }));
  };

  return (
    <div className="bg-white overflow-hidden shadow-lg rounded-2xl border border-slate-200">
      <div className="px-6 py-6">
        <h3 className="text-xl font-semibold text-slate-900 mb-6 flex items-center">
          <svg className="w-6 h-6 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          Job Preferences
        </h3>
        
        <div className="space-y-6">
          {/* Work Environment Preferences */}
          <div className="bg-slate-50 p-4 rounded-lg">
            <h4 className="font-semibold text-slate-900 mb-4">Work Environment</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Live-in Preference */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Living Arrangement</label>
                {isEditing ? (
                  <select
                    value={editData.preferences?.workEnvironment?.liveInPreference || ''}
                    onChange={(e) => handlePreferenceChange('workEnvironment', 'liveInPreference', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select preference</option>
                    <option value="live_in_only">Live-in only</option>
                    <option value="live_out_only">Live-out only</option>
                    <option value="either">Either is fine</option>
                  </select>
                ) : (
                  <p className="text-slate-900 capitalize">
                    {user?.preferences?.workEnvironment?.liveInPreference?.replace('_', ' ') || 'Not specified'}
                  </p>
                )}
              </div>

              {/* Pet Preference */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Working with Pets</label>
                {isEditing ? (
                  <select
                    value={editData.preferences?.workEnvironment?.petFriendly || ''}
                    onChange={(e) => handlePreferenceChange('workEnvironment', 'petFriendly', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select preference</option>
                    <option value="love_pets">I love working with pets</option>
                    <option value="comfortable">Comfortable with pets</option>
                    <option value="no_pets">Prefer no pets</option>
                  </select>
                ) : (
                  <p className="text-slate-900">
                    {user?.preferences?.workEnvironment?.petFriendly === 'love_pets' ? 'I love working with pets' :
                     user?.preferences?.workEnvironment?.petFriendly === 'comfortable' ? 'Comfortable with pets' :
                     user?.preferences?.workEnvironment?.petFriendly === 'no_pets' ? 'Prefer no pets' : 'Not specified'}
                  </p>
                )}
              </div>

              {/* Required Off Days */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Required Off Days per Week</label>
                {isEditing ? (
                  <select
                    value={editData.preferences?.workEnvironment?.requiredOffDays || ''}
                    onChange={(e) => handlePreferenceChange('workEnvironment', 'requiredOffDays', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select number</option>
                    {[0, 1, 2, 3, 4].map(num => (
                      <option key={num} value={num}>{num} day{num !== 1 ? 's' : ''} per week</option>
                    ))}
                  </select>
                ) : (
                  <p className="text-slate-900">
                    {user?.preferences?.workEnvironment?.requiredOffDays !== undefined 
                      ? `${user.preferences.workEnvironment.requiredOffDays} day${user.preferences.workEnvironment.requiredOffDays !== 1 ? 's' : ''} per week`
                      : 'Not specified'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Preferred Countries */}
          <div className="bg-slate-50 p-4 rounded-lg">
            <h4 className="font-semibold text-slate-900 mb-4">Location Preferences</h4>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Preferred Countries to Work In</label>
              {isEditing ? (
                <div className="grid grid-cols-3 gap-2">
                  {['Singapore', 'Hong Kong', 'UAE', 'Saudi Arabia', 'Qatar', 'Kuwait', 'Taiwan', 'Malaysia', 'Others'].map(country => (
                    <label key={country} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={(editData.preferences?.location?.preferredCountries || []).includes(country)}
                        onChange={(e) => {
                          const current = editData.preferences?.location?.preferredCountries || [];
                          const newCountries = e.target.checked
                            ? [...current, country]
                            : current.filter(c => c !== country);
                          handleLocationPreferenceChange('preferredCountries', newCountries);
                        }}
                        className="mr-2 text-blue-600"
                      />
                      <span className="text-sm">{country}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {(user?.preferences?.location?.preferredCountries || []).map((country, index) => (
                    <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                      {country}
                    </span>
                  ))}
                  {(!user?.preferences?.location?.preferredCountries || user.preferences.location.preferredCountries.length === 0) && (
                    <p className="text-slate-900">No preferences specified</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// NEW: Availability & Readiness Section
export const HelperAvailabilityInfo = ({ user, isEditing, editData, setEditData }) => {
  const handleExpectationChange = (category, field, value) => {
    setEditData(prev => ({
      ...prev,
      expectations: {
        ...prev.expectations,
        [category]: {
          ...prev.expectations?.[category],
          [field]: value
        }
      }
    }));
  };

  const handleReadinessChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      readiness: {
        ...prev.readiness,
        [field]: value
      }
    }));
  };

  const handleInterviewChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      interview: {
        ...prev.interview,
        [field]: value
      }
    }));
  };

  return (
    <div className="bg-white overflow-hidden shadow-lg rounded-2xl border border-slate-200">
      <div className="px-6 py-6">
        <h3 className="text-xl font-semibold text-slate-900 mb-6 flex items-center">
          <svg className="w-6 h-6 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Availability & Readiness
        </h3>
        
        <div className="space-y-6">
          {/* Salary Expectations */}
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h4 className="font-semibold text-green-800 mb-4 flex items-center">
              💰 Salary Expectations
            </h4>
            
            {/* Currency Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">Currency</label>
              {isEditing ? (
                <select
                  value={editData.expectations?.salary?.currency || 'SGD'}
                  onChange={(e) => handleExpectationChange('salary', 'currency', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="SGD">Singapore Dollar (SGD)</option>
                  <option value="HKD">Hong Kong Dollar (HKD)</option>
                  <option value="MYR">Malaysian Ringgit (MYR)</option>
                  <option value="USD">US Dollar (USD)</option>
                  <option value="AED">UAE Dirham (AED)</option>
                  <option value="SAR">Saudi Riyal (SAR)</option>
                  <option value="QAR">Qatari Riyal (QAR)</option>
                  <option value="KWD">Kuwaiti Dinar (KWD)</option>
                  <option value="TWD">Taiwan Dollar (TWD)</option>
                  <option value="PHP">Philippine Peso (PHP)</option>
                  <option value="IDR">Indonesian Rupiah (IDR)</option>
                  <option value="LKR">Sri Lankan Rupee (LKR)</option>
                  <option value="INR">Indian Rupee (INR)</option>
                </select>
              ) : (
                <p className="text-slate-900 font-medium">
                  {editData?.expectations?.salary?.currency || 'SGD'}
                </p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Minimum Monthly Salary Expected</label>
                {isEditing ? (
                  <div className="flex">
                    <span className="inline-flex items-center px-3 py-2 border border-r-0 border-slate-300 bg-slate-50 text-slate-500 text-sm rounded-l-lg">
                      {editData.expectations?.salary?.currency || 'SGD'} $
                    </span>
                    <input
                      type="number"
                      min="500"
                      max="3000"
                      step="50"
                      value={editData.expectations?.salary?.minimumAmount || ''}
                      onChange={(e) => handleExpectationChange('salary', 'minimumAmount', e.target.value)}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-r-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="800"
                    />
                  </div>
                ) : (
                  <p className="text-slate-900 font-medium">
                    {editData?.expectations?.salary?.minimumAmount ? `${editData.expectations.salary.currency || 'SGD'} $${editData.expectations.salary.minimumAmount}` : 'Not specified'}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Preferred Monthly Salary</label>
                {isEditing ? (
                  <div className="flex">
                    <span className="inline-flex items-center px-3 py-2 border border-r-0 border-slate-300 bg-slate-50 text-slate-500 text-sm rounded-l-lg">
                      {editData.expectations?.salary?.currency || 'SGD'} $
                    </span>
                    <input
                      type="number"
                      min="500"
                      max="3000"
                      step="50"
                      value={editData.expectations?.salary?.preferredAmount || ''}
                      onChange={(e) => handleExpectationChange('salary', 'preferredAmount', e.target.value)}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-r-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="1000"
                    />
                  </div>
                ) : (
                  <p className="text-slate-900 font-medium">
                    {editData?.expectations?.salary?.preferredAmount ? `${editData.expectations.salary.currency || 'SGD'} $${editData.expectations.salary.preferredAmount}` : 'Not specified'}
                  </p>
                )}
              </div>
            </div>
            
            {/* Salary Options */}
            <div className="mt-4 space-y-3">
              <label className="flex items-center">
                {isEditing ? (
                  <input
                    type="checkbox"
                    checked={editData.expectations?.salary?.negotiable || false}
                    onChange={(e) => handleExpectationChange('salary', 'negotiable', e.target.checked)}
                    className="mr-2 text-blue-600"
                  />
                ) : (
                  <span className={`w-4 h-4 mr-2 rounded ${editData?.expectations?.salary?.negotiable ? 'bg-blue-600' : 'bg-slate-300'}`}></span>
                )}
                <span className="text-sm text-slate-700">My salary is negotiable based on job requirements</span>
              </label>
              
              <label className="flex items-center">
                {isEditing ? (
                  <input
                    type="checkbox"
                    checked={editData.expectations?.salary?.performanceBonusExpected || false}
                    onChange={(e) => handleExpectationChange('salary', 'performanceBonusExpected', e.target.checked)}
                    className="mr-2 text-blue-600"
                  />
                ) : (
                  <span className={`w-4 h-4 mr-2 rounded ${editData?.expectations?.salary?.performanceBonusExpected ? 'bg-blue-600' : 'bg-slate-300'}`}></span>
                )}
                <span className="text-sm text-slate-700">I would like performance bonuses</span>
              </label>
            </div>
          </div>

          {/* Work Readiness */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-4 flex items-center">
              🛂 Work Readiness
            </h4>
            <div className="space-y-4">
              {/* Passport Status */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Do you have a valid passport?</label>
                {isEditing ? (
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="hasValidPassport"
                        value="yes"
                        checked={editData.readiness?.hasValidPassport === 'yes'}
                        onChange={(e) => handleReadinessChange('hasValidPassport', e.target.value)}
                        className="mr-2 text-blue-600"
                      />
                      Yes, valid passport
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="hasValidPassport"
                        value="no"
                        checked={editData.readiness?.hasValidPassport === 'no'}
                        onChange={(e) => handleReadinessChange('hasValidPassport', e.target.value)}
                        className="mr-2 text-blue-600"
                      />
                      No, need to apply/renew
                    </label>
                  </div>
                                ) : (
                  <p className="text-slate-900">
                    {editData?.readiness?.hasValidPassport === 'yes' ? 'Yes, valid passport' :
                     editData?.readiness?.hasValidPassport === 'no' ? 'No, need to apply/renew' : 'Not specified'}
                  </p>
                )}
              </div>

              {/* Passport Expiry (conditional) */}
              {(isEditing ? editData.readiness?.hasValidPassport === 'yes' : editData?.readiness?.hasValidPassport === 'yes') && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Passport Expiry Date</label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={editData.readiness?.passportExpiry || ''}
                      onChange={(e) => handleReadinessChange('passportExpiry', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-slate-900">
                      {editData?.readiness?.passportExpiry ? new Date(editData.readiness.passportExpiry).toLocaleDateString() : 'Not specified'}
                    </p>
                  )}
                </div>
              )}

              {/* Can Start Work */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">When can you start working?</label>
                {isEditing ? (
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="canStartWork"
                        value="immediately"
                        checked={editData.readiness?.canStartWork === 'immediately'}
                        onChange={(e) => handleReadinessChange('canStartWork', e.target.value)}
                        className="mr-2 text-blue-600"
                      />
                      Immediately (ready to start within 1-2 weeks)
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="canStartWork"
                        value="within_month"
                        checked={editData.readiness?.canStartWork === 'within_month'}
                        onChange={(e) => handleReadinessChange('canStartWork', e.target.value)}
                        className="mr-2 text-blue-600"
                      />
                      Within 1 month
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="canStartWork"
                        value="after_date"
                        checked={editData.readiness?.canStartWork === 'after_date'}
                        onChange={(e) => handleReadinessChange('canStartWork', e.target.value)}
                        className="mr-2 text-blue-600"
                      />
                      After a specific date
                    </label>
                  </div>
                ) : (
                  <p className="text-slate-900">
                    {editData?.readiness?.canStartWork === 'immediately' ? 'Immediately (ready to start within 1-2 weeks)' :
                     editData?.readiness?.canStartWork === 'within_month' ? 'Within 1 month' :
                     editData?.readiness?.canStartWork === 'after_date' ? 'After a specific date' : 'Not specified'}
                  </p>
                )}
              </div>

              {/* Start Date (conditional) */}
              {(isEditing ? editData.readiness?.canStartWork === 'after_date' : editData?.readiness?.canStartWork === 'after_date') && (
                <div className="ml-6">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Start Date</label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={editData.readiness?.startDate || ''}
                      onChange={(e) => handleReadinessChange('startDate', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-slate-900">
                      {editData?.readiness?.startDate ? new Date(editData.readiness.startDate).toLocaleDateString() : 'Not specified'}
                    </p>
                  )}
                </div>
              )}

              {/* Visa Status */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Current Visa/Work Permit Status</label>
                {isEditing ? (
                  <select
                    value={editData.readiness?.visaStatus || ''}
                    onChange={(e) => handleReadinessChange('visaStatus', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Visa Status</option>
                    <option value="first_time">First time applying (no previous work permit)</option>
                    <option value="valid_permit">Currently have valid work permit</option>
                    <option value="expired_permit">Previous work permit expired</option>
                    <option value="transfer_ready">Ready for transfer from current employer</option>
                    <option value="citizen_pr">Singapore Citizen/PR</option>
                  </select>
                ) : (
                  <p className="text-slate-900">
                    {editData?.readiness?.visaStatus === 'first_time' ? 'First time applying (no previous work permit)' :
                     editData?.readiness?.visaStatus === 'valid_permit' ? 'Currently have valid work permit' :
                     editData?.readiness?.visaStatus === 'expired_permit' ? 'Previous work permit expired' :
                     editData?.readiness?.visaStatus === 'transfer_ready' ? 'Ready for transfer from current employer' :
                     editData?.readiness?.visaStatus === 'citizen_pr' ? 'Singapore Citizen/PR' : 'Not specified'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Interview Preferences */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <h4 className="font-semibold text-slate-900 mb-4 flex items-center">
              📞 Interview Preferences
            </h4>
            <div className="space-y-4">
              {/* Interview Availability */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">When are you available for interviews?</label>
                {isEditing ? (
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="interviewAvailability"
                        value="immediate"
                        checked={editData.interview?.availability === 'immediate'}
                        onChange={(e) => handleInterviewChange('availability', e.target.value)}
                        className="mr-2 text-blue-600"
                      />
                      Available anytime
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="interviewAvailability"
                        value="weekdays_only"
                        checked={editData.interview?.availability === 'weekdays_only'}
                        onChange={(e) => handleInterviewChange('availability', e.target.value)}
                        className="mr-2 text-blue-600"
                      />
                      Weekdays only
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="interviewAvailability"
                        value="weekends_only"
                        checked={editData.interview?.availability === 'weekends_only'}
                        onChange={(e) => handleInterviewChange('availability', e.target.value)}
                        className="mr-2 text-blue-600"
                      />
                      Weekends only
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="interviewAvailability"
                        value="after_date"
                        checked={editData.interview?.availability === 'after_date'}
                        onChange={(e) => handleInterviewChange('availability', e.target.value)}
                        className="mr-2 text-blue-600"
                      />
                      After a specific date
                    </label>
                  </div>
                ) : (
                  <p className="text-slate-900">
                    {editData?.interview?.availability === 'immediate' ? 'Available anytime' :
                     editData?.interview?.availability === 'weekdays_only' ? 'Weekdays only' :
                     editData?.interview?.availability === 'weekends_only' ? 'Weekends only' :
                     editData?.interview?.availability === 'after_date' ? 'After a specific date' : 'Not specified'}
                  </p>
                )}
              </div>

              {/* Interview Availability Date (conditional) */}
              {(isEditing ? editData.interview?.availability === 'after_date' : editData?.interview?.availability === 'after_date') && (
                <div className="ml-6">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Available from Date</label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={editData.interview?.availabilityDate || ''}
                      onChange={(e) => handleInterviewChange('availabilityDate', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-slate-900">
                      {editData?.interview?.availabilityDate ? new Date(editData.interview.availabilityDate).toLocaleDateString() : 'Not specified'}
                    </p>
                  )}
                </div>
              )}

              {/* Interview Method */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Preferred Interview Method</label>
                {isEditing ? (
                  <select
                    value={editData.interview?.means || ''}
                    onChange={(e) => handleInterviewChange('means', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Interview Method</option>
                    <option value="whatsapp_video_call">WhatsApp Video Call</option>
                    <option value="zoom_video_call">Zoom Video Call</option>
                    <option value="voice_call">Voice Call</option>
                    <option value="face_to_face">Face to Face Meeting</option>
                    <option value="others">Others (specify in comments)</option>
                  </select>
                ) : (
                  <p className="text-slate-900">
                    {editData?.interview?.means === 'whatsapp_video_call' ? 'WhatsApp Video Call' :
                     editData?.interview?.means === 'zoom_video_call' ? 'Zoom Video Call' :
                     editData?.interview?.means === 'voice_call' ? 'Voice Call' :
                     editData?.interview?.means === 'face_to_face' ? 'Face to Face Meeting' :
                     editData?.interview?.means === 'others' ? 'Others (specify in comments)' : 'Not specified'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Additional Comments */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <h4 className="font-semibold text-slate-900 mb-4">Additional Comments & Special Requests</h4>
            {isEditing ? (
              <textarea
                value={editData.otherRemarks || ''}
                onChange={(e) => setEditData({...editData, otherRemarks: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="4"
                placeholder="Anything else you'd like potential employers to know about you, your availability, salary expectations, or special requests..."
              />
            ) : (
              <p className="text-slate-900">
                {editData?.otherRemarks || 'No additional comments'}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
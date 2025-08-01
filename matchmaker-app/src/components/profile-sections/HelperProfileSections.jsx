import React from 'react';

export const HelperPersonalInfo = ({ user, isEditing, editData, setEditData, handleLanguageChange, addLanguage, removeLanguage, formatDate, calculateAge }) => (
  <div className="bg-white overflow-hidden shadow rounded-lg">
    <div className="px-4 py-5 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Personal Information</h3>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          {isEditing ? (
            <input
              type="text"
              value={editData.fullName}
              onChange={(e) => setEditData({...editData, fullName: e.target.value})}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          ) : (
            <p className="mt-1 text-sm text-gray-900">{user?.fullName || 'Not provided'}</p>
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

        {/* Email/Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Email/Phone</label>
          <p className="mt-1 text-sm text-gray-900">{user?.email || user?.phoneNumber || 'Not provided'}</p>
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
          {isEditing ? (
            <input
              type="date"
              value={editData.dateOfBirth}
              onChange={(e) => setEditData({...editData, dateOfBirth: e.target.value})}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          ) : (
            <p className="mt-1 text-sm text-gray-900">
              {formatDate(user?.dateOfBirth)} 
              {user?.dateOfBirth && (
                <span className="text-gray-500 ml-2">({calculateAge(user.dateOfBirth)} years old)</span>
              )}
            </p>
          )}
        </div>

        {/* Nationality */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Nationality</label>
          {isEditing ? (
            <input
              type="text"
              value={editData.nationality}
              onChange={(e) => setEditData({...editData, nationality: e.target.value})}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          ) : (
            <p className="mt-1 text-sm text-gray-900">{user?.nationality || 'Not provided'}</p>
          )}
        </div>

        {/* Education Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Education Level</label>
          {isEditing ? (
            <select
              value={editData.educationLevel}
              onChange={(e) => setEditData({...editData, educationLevel: e.target.value})}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Select education level</option>
              <option value="primary_school">Primary School</option>
              <option value="secondary_school">Secondary School</option>
              <option value="high_school">High School</option>
              <option value="university">University</option>
              <option value="postgraduate">Postgraduate</option>
            </select>
          ) : (
            <p className="mt-1 text-sm text-gray-900 capitalize">
              {user?.educationLevel?.replace('_', ' ') || 'Not provided'}
            </p>
          )}
        </div>

        {/* Marital Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Marital Status</label>
          {isEditing ? (
            <select
              value={editData.maritalStatus}
              onChange={(e) => setEditData({...editData, maritalStatus: e.target.value})}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Select marital status</option>
              <option value="single">Single</option>
              <option value="married">Married</option>
              <option value="divorced">Divorced</option>
              <option value="widowed">Widowed</option>
            </select>
          ) : (
            <p className="mt-1 text-sm text-gray-900 capitalize">
              {user?.maritalStatus || 'Not provided'}
            </p>
          )}
        </div>

        {/* Religion */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Religion</label>
          {isEditing ? (
            <input
              type="text"
              value={editData.religion}
              onChange={(e) => setEditData({...editData, religion: e.target.value})}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          ) : (
            <p className="mt-1 text-sm text-gray-900">{user?.religion || 'Not provided'}</p>
          )}
        </div>

        {/* Country of Birth */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Country of Birth</label>
          {isEditing ? (
            <input
              type="text"
              value={editData.countryOfBirth}
              onChange={(e) => setEditData({...editData, countryOfBirth: e.target.value})}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          ) : (
            <p className="mt-1 text-sm text-gray-900">{user?.countryOfBirth || 'Not provided'}</p>
          )}
        </div>

        {/* City of Birth */}
        <div>
          <label className="block text-sm font-medium text-gray-700">City of Birth</label>
          {isEditing ? (
            <input
              type="text"
              value={editData.cityOfBirth}
              onChange={(e) => setEditData({...editData, cityOfBirth: e.target.value})}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          ) : (
            <p className="mt-1 text-sm text-gray-900">{user?.cityOfBirth || 'Not provided'}</p>
          )}
        </div>

        {/* Height */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Height (cm)</label>
          {isEditing ? (
            <input
              type="number"
              value={editData.height}
              onChange={(e) => setEditData({...editData, height: e.target.value})}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              min="120"
              max="220"
            />
          ) : (
            <p className="mt-1 text-sm text-gray-900">{user?.height ? `${user.height} cm` : 'Not provided'}</p>
          )}
        </div>

        {/* Weight */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
          {isEditing ? (
            <input
              type="number"
              value={editData.weight}
              onChange={(e) => setEditData({...editData, weight: e.target.value})}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              min="30"
              max="200"
            />
          ) : (
            <p className="mt-1 text-sm text-gray-900">{user?.weight ? `${user.weight} kg` : 'Not provided'}</p>
          )}
        </div>

        {/* Number of Siblings */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Number of Siblings</label>
          {isEditing ? (
            <select
              value={editData.numberOfSiblings}
              onChange={(e) => setEditData({...editData, numberOfSiblings: e.target.value})}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Select number</option>
              {[...Array(11)].map((_, i) => (
                <option key={i} value={i}>{i}</option>
              ))}
            </select>
          ) : (
            <p className="mt-1 text-sm text-gray-900">{user?.numberOfSiblings || 'Not provided'}</p>
          )}
        </div>

        {/* Number of Children */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Number of Children</label>
          {isEditing ? (
            <select
              value={editData.numberOfChildren}
              onChange={(e) => setEditData({...editData, numberOfChildren: e.target.value})}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Select number</option>
              {[...Array(11)].map((_, i) => (
                <option key={i} value={i}>{i}</option>
              ))}
            </select>
          ) : (
            <p className="mt-1 text-sm text-gray-900">{user?.numberOfChildren || 'Not provided'}</p>
          )}
        </div>

        {/* Residential Address */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Residential Address</label>
          {isEditing ? (
            <textarea
              value={editData.residentialAddress}
              onChange={(e) => setEditData({...editData, residentialAddress: e.target.value})}
              rows={3}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          ) : (
            <p className="mt-1 text-sm text-gray-900">{user?.residentialAddress || 'Not provided'}</p>
          )}
        </div>

        {/* Repatriation Port */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Repatriation Port/Airport</label>
          {isEditing ? (
            <input
              type="text"
              value={editData.repatriationPort}
              onChange={(e) => setEditData({...editData, repatriationPort: e.target.value})}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          ) : (
            <p className="mt-1 text-sm text-gray-900">{user?.repatriationPort || 'Not provided'}</p>
          )}
        </div>

        {/* Emergency Contact */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Emergency Contact</label>
          {isEditing ? (
            <input
              type="text"
              value={editData.emergencyContact}
              onChange={(e) => setEditData({...editData, emergencyContact: e.target.value})}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Name and phone number"
            />
          ) : (
            <p className="mt-1 text-sm text-gray-900">{user?.emergencyContact || 'Not provided'}</p>
          )}
        </div>

                {/* Languages */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Languages</label>
          {isEditing ? (
            <div className="mt-1 space-y-2">
              {editData.languages.map((language, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={language}
                    onChange={(e) => handleLanguageChange(index, e.target.value)}
                    className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Language"
                  />
                  <button
                    type="button"
                    onClick={() => removeLanguage(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addLanguage}
                className="text-indigo-600 hover:text-indigo-800 text-sm"
              >
                + Add Language
              </button>
            </div>
          ) : (
            <div className="mt-1 flex flex-wrap gap-2">
              {(() => {
                const languages = Array.isArray(user?.languages) ? user.languages : 
                                 (typeof user?.languages === 'string' && user.languages) ? 
                                 user.languages.split(',').map(lang => lang.trim()).filter(lang => lang) : [];
                
                return languages.length > 0 ? languages.map((language, index) => (
                  <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {language}
                  </span>
                )) : <p className="text-sm text-gray-900">Not provided</p>;
              })()}
            </div>
          )}
        </div>

        {/* Helper Experience */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Previous Helper Experience</label>
          <div className="mt-1">
            {isEditing ? (
              <div className="flex space-x-6">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="hasBeenHelperBefore"
                    value="yes"
                    checked={editData.hasBeenHelperBefore === 'yes'}
                    onChange={(e) => setEditData({...editData, hasBeenHelperBefore: e.target.value})}
                    className="mr-2"
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
                    className="mr-2"
                  />
                  No, I'm new to this
                </label>
              </div>
            ) : (
              <p className="text-sm text-gray-900">
                {user?.hasBeenHelperBefore === 'yes' ? 'Yes, I have experience' : 
                 user?.hasBeenHelperBefore === 'no' ? 'No, I\'m new to this' : 'Not provided'}
              </p>
            )}
          </div>
        </div>

        {/* Availability */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Availability</label>
          {isEditing ? (
            <textarea
              value={editData.availability}
              onChange={(e) => setEditData({...editData, availability: e.target.value})}
              rows={2}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Days and hours available"
            />
          ) : (
            <p className="mt-1 text-sm text-gray-900">{user?.availability || 'Not provided'}</p>
          )}
        </div>

        {/* Skills & Experience */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Skills & Experience</label>
          {isEditing ? (
            <textarea
              value={editData.relevantSkills}
              onChange={(e) => setEditData({...editData, relevantSkills: e.target.value})}
              rows={4}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Describe your relevant skills and experience..."
            />
          ) : (
            <p className="mt-1 text-sm text-gray-900">{user?.relevantSkills || 'Not provided'}</p>
          )}
        </div>

        {/* Previous Work */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Previous Work Experience</label>
          {isEditing ? (
            <textarea
              value={editData.previousWork}
              onChange={(e) => setEditData({...editData, previousWork: e.target.value})}
              rows={3}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Describe your previous work experience..."
            />
          ) : (
            <p className="mt-1 text-sm text-gray-900">{user?.previousWork || 'Not provided'}</p>
          )}
        </div>
      </div>
    </div>
  </div>
);

export const HelperMedicalInfo = ({ user, isEditing, editData, setEditData }) => (
  <div className="bg-white overflow-hidden shadow rounded-lg">
    <div className="px-4 py-5 sm:p-6">
      <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Medical Information</h3>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        
        {/* Allergies */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Do you have any allergies?</label>
          <div className="mt-1">
            {isEditing ? (
              <div className="space-y-2">
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="hasAllergies"
                      value="yes"
                      checked={editData.hasAllergies === 'yes'}
                      onChange={(e) => setEditData({...editData, hasAllergies: e.target.value})}
                      className="mr-2"
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
                      className="mr-2"
                    />
                    No
                  </label>
                </div>
                {editData.hasAllergies === 'yes' && (
                  <textarea
                    value={editData.allergiesDetails}
                    onChange={(e) => setEditData({...editData, allergiesDetails: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Please describe your allergies..."
                    rows="2"
                  />
                )}
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-900">
                  {user?.hasAllergies === 'yes' ? 'Yes' : user?.hasAllergies === 'no' ? 'No' : 'Not provided'}
                </p>
                {user?.hasAllergies === 'yes' && user?.allergiesDetails && (
                  <p className="text-sm text-gray-600 mt-1">{user.allergiesDetails}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Past Illness */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Any past serious illness or surgery?</label>
          <div className="mt-1">
            {isEditing ? (
              <div className="space-y-2">
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="hasPastIllness"
                      value="yes"
                      checked={editData.hasPastIllness === 'yes'}
                      onChange={(e) => setEditData({...editData, hasPastIllness: e.target.value})}
                      className="mr-2"
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
                      className="mr-2"
                    />
                    No
                  </label>
                </div>
                {editData.hasPastIllness === 'yes' && (
                  <textarea
                    value={editData.pastIllnessDetails}
                    onChange={(e) => setEditData({...editData, pastIllnessDetails: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Please describe..."
                    rows="2"
                  />
                )}
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-900">
                  {user?.hasPastIllness === 'yes' ? 'Yes' : user?.hasPastIllness === 'no' ? 'No' : 'Not provided'}
                </p>
                {user?.hasPastIllness === 'yes' && user?.pastIllnessDetails && (
                  <p className="text-sm text-gray-600 mt-1">{user.pastIllnessDetails}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Physical Disabilities */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Any physical disabilities?</label>
          <div className="mt-1">
            {isEditing ? (
              <div className="space-y-2">
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="hasPhysicalDisabilities"
                      value="yes"
                      checked={editData.hasPhysicalDisabilities === 'yes'}
                      onChange={(e) => setEditData({...editData, hasPhysicalDisabilities: e.target.value})}
                      className="mr-2"
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
                      className="mr-2"
                    />
                    No
                  </label>
                </div>
                {editData.hasPhysicalDisabilities === 'yes' && (
                  <textarea
                    value={editData.physicalDisabilitiesDetails}
                    onChange={(e) => setEditData({...editData, physicalDisabilitiesDetails: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Please describe..."
                    rows="2"
                  />
                )}
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-900">
                  {user?.hasPhysicalDisabilities === 'yes' ? 'Yes' : user?.hasPhysicalDisabilities === 'no' ? 'No' : 'Not provided'}
                </p>
                {user?.hasPhysicalDisabilities === 'yes' && user?.physicalDisabilitiesDetails && (
                  <p className="text-sm text-gray-600 mt-1">{user.physicalDisabilitiesDetails}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Dietary Restrictions */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Any dietary restrictions?</label>
          <div className="mt-1">
            {isEditing ? (
              <div className="space-y-2">
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="hasDietaryRestrictions"
                      value="yes"
                      checked={editData.hasDietaryRestrictions === 'yes'}
                      onChange={(e) => setEditData({...editData, hasDietaryRestrictions: e.target.value})}
                      className="mr-2"
                    />
                    Yes
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="hasDietaryRestrictions"
                      value="no"
                      checked={editData.hasDietaryRestrictions === 'no'}
                      onChange={(e) => setEditData({...editData, hasDietaryRestrictions: e.target.value})}
                      className="mr-2"
                    />
                    No
                  </label>
                </div>
                {editData.hasDietaryRestrictions === 'yes' && (
                  <textarea
                    value={editData.dietaryRestrictionsDetails}
                    onChange={(e) => setEditData({...editData, dietaryRestrictionsDetails: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Please describe..."
                    rows="2"
                  />
                )}
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-900">
                  {user?.hasDietaryRestrictions === 'yes' ? 'Yes' : user?.hasDietaryRestrictions === 'no' ? 'No' : 'Not provided'}
                </p>
                {user?.hasDietaryRestrictions === 'yes' && user?.dietaryRestrictionsDetails && (
                  <p className="text-sm text-gray-600 mt-1">{user.dietaryRestrictionsDetails}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
);
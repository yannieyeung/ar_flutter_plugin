import React from 'react';

export const EmployerPersonalInfo = ({ user, isEditing, editData, setEditData }) => (
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
            <p className="mt-1 text-sm text-gray-900">{user?.email || 'Not provided'}</p>
          )}
        </div>

        {/* Location */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Location</label>
          {isEditing ? (
            <input
              type="text"
              value={editData.location}
              onChange={(e) => setEditData({...editData, location: e.target.value})}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="e.g., Orchard, Singapore or Petaling Jaya, Malaysia"
            />
          ) : (
            <p className="mt-1 text-sm text-gray-900">{user?.location || 'Not provided'}</p>
          )}
        </div>

        {/* Self Introduction */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Self Introduction</label>
          {isEditing ? (
            <textarea
              value={editData.selfIntroduction}
              onChange={(e) => setEditData({...editData, selfIntroduction: e.target.value})}
              rows={4}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Tell us about yourself, your family, and what kind of help you're looking for..."
            />
          ) : (
            <p className="mt-1 text-sm text-gray-900">{user?.selfIntroduction || 'Not provided'}</p>
          )}
        </div>
      </div>
    </div>
  </div>
);

export const EmployerHouseholdInfo = ({ user, isEditing, editData, setEditData }) => (
  <div className="bg-white overflow-hidden shadow rounded-lg">
    <div className="px-4 py-5 sm:p-6">
      <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Household Information</h3>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        
        {/* Household Size */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Household Size</label>
          {isEditing ? (
            <select
              value={editData.householdSize}
              onChange={(e) => setEditData({...editData, householdSize: e.target.value})}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Select household size</option>
              <option value="1">1 person (just me)</option>
              <option value="2">2 people</option>
              <option value="3">3 people</option>
              <option value="4">4 people</option>
              <option value="5">5 people</option>
              <option value="6+">6+ people</option>
            </select>
          ) : (
            <p className="mt-1 text-sm text-gray-900">{user?.householdSize ? `${user.householdSize} ${user.householdSize === '1' ? 'person' : 'people'}` : 'Not provided'}</p>
          )}
        </div>

        {/* Has Kids */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Children at Home</label>
          {isEditing ? (
            <div className="mt-1">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={editData.hasKids || false}
                  onChange={(e) => setEditData({...editData, hasKids: e.target.checked})}
                  className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                <span className="ml-2 text-sm text-gray-700">I have children at home</span>
              </label>
            </div>
          ) : (
            <p className="mt-1 text-sm text-gray-900">{user?.hasKids ? 'Yes' : 'No'}</p>
          )}
        </div>

        {/* Number of Kids - only show if hasKids is true */}
        {(isEditing ? editData.hasKids : user?.hasKids) && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Number of Children</label>
            {isEditing ? (
              <select
                value={editData.numberOfKids}
                onChange={(e) => setEditData({...editData, numberOfKids: e.target.value})}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select number of children</option>
                <option value="1">1 child</option>
                <option value="2">2 children</option>
                <option value="3">3 children</option>
                <option value="4">4 children</option>
                <option value="5+">5+ children</option>
              </select>
            ) : (
              <p className="mt-1 text-sm text-gray-900">{user?.numberOfKids || 'Not specified'}</p>
            )}
          </div>
        )}

        {/* Kids Ages - only show if hasKids is true */}
        {(isEditing ? editData.hasKids : user?.hasKids) && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Children's Ages</label>
            {isEditing ? (
              <input
                type="text"
                value={editData.kidsAges}
                onChange={(e) => setEditData({...editData, kidsAges: e.target.value})}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="e.g., 3, 7, 12 years old"
              />
            ) : (
              <p className="mt-1 text-sm text-gray-900">{user?.kidsAges || 'Not specified'}</p>
            )}
          </div>
        )}

        {/* Has Pets */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Pets at Home</label>
          {isEditing ? (
            <div className="mt-1">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={editData.hasPets || false}
                  onChange={(e) => setEditData({...editData, hasPets: e.target.checked})}
                  className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                <span className="ml-2 text-sm text-gray-700">I have pets at home</span>
              </label>
            </div>
          ) : (
            <p className="mt-1 text-sm text-gray-900">{user?.hasPets ? 'Yes' : 'No'}</p>
          )}
        </div>

        {/* Pet Details - only show if hasPets is true */}
        {(isEditing ? editData.hasPets : user?.hasPets) && (
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Pet Details</label>
            {isEditing ? (
              <textarea
                value={editData.petDetails}
                onChange={(e) => setEditData({...editData, petDetails: e.target.value})}
                rows={3}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="e.g., 1 golden retriever (friendly), 2 cats (indoor only)"
              />
            ) : (
              <p className="mt-1 text-sm text-gray-900">{user?.petDetails || 'Not specified'}</p>
            )}
          </div>
        )}
      </div>
    </div>
  </div>
);

export const EmployerPreferences = ({ user, isEditing, editData, setEditData }) => (
  <div className="bg-white overflow-hidden shadow rounded-lg">
    <div className="px-4 py-5 sm:p-6">
      <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Preferences & Requirements</h3>
      <div className="grid grid-cols-1 gap-6">
        
        {/* Preferred Languages */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Preferred Languages</label>
          {isEditing ? (
            <div className="mt-1 grid grid-cols-2 gap-3">
              {['English', 'Mandarin', 'Malay', 'Tamil', 'Tagalog', 'Indonesian', 'Thai', 'Myanmar'].map((language) => (
                <label key={language} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={editData.preferredLanguages?.includes(language) || false}
                    onChange={(e) => {
                      const currentLanguages = editData.preferredLanguages || [];
                      if (e.target.checked) {
                        setEditData({...editData, preferredLanguages: [...currentLanguages, language]});
                      } else {
                        setEditData({...editData, preferredLanguages: currentLanguages.filter(lang => lang !== language)});
                      }
                    }}
                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                  <span className="text-sm text-gray-700">{language}</span>
                </label>
              ))}
            </div>
          ) : (
            <p className="mt-1 text-sm text-gray-900">
              {user?.preferredLanguages && user.preferredLanguages.length > 0 
                ? user.preferredLanguages.join(', ') 
                : 'No preference specified'}
            </p>
          )}
        </div>

        {/* Specific Requirements */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Specific Requirements</label>
          {isEditing ? (
            <textarea
              value={editData.specificRequirements}
              onChange={(e) => setEditData({...editData, specificRequirements: e.target.value})}
              rows={3}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Any specific requirements, preferences, or things helpers should know about working in your household"
            />
          ) : (
            <p className="mt-1 text-sm text-gray-900">{user?.specificRequirements || 'No specific requirements'}</p>
          )}
        </div>
      </div>
    </div>
  </div>
);
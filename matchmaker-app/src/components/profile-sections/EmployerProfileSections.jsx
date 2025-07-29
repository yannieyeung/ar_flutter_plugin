import React from 'react';

export const EmployerPersonalInfo = ({ user, isEditing, editData, setEditData }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
    <div className="px-8 py-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-slate-900">Personal Information</h3>
          <p className="text-sm text-slate-500">Your basic profile details</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">Full Name</label>
          {isEditing ? (
            <input
              type="text"
              value={editData.fullName}
              onChange={(e) => setEditData({...editData, fullName: e.target.value})}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="Enter your full name"
            />
          ) : (
            <div className="px-4 py-3 bg-slate-50 rounded-xl">
              <p className="text-slate-900 font-medium">{user?.fullName || 'Not provided'}</p>
            </div>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">Email Address</label>
          {isEditing ? (
            <input
              type="email"
              value={editData.email}
              onChange={(e) => setEditData({...editData, email: e.target.value})}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="Enter your email address"
            />
          ) : (
            <div className="px-4 py-3 bg-slate-50 rounded-xl">
              <p className="text-slate-900 font-medium">{user?.email || 'Not provided'}</p>
            </div>
          )}
        </div>

        {/* Location */}
        <div className="md:col-span-2 space-y-2">
          <label className="block text-sm font-medium text-slate-700">Location</label>
          {isEditing ? (
            <input
              type="text"
              value={editData.location}
              onChange={(e) => setEditData({...editData, location: e.target.value})}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="e.g., Orchard, Singapore or Petaling Jaya, Malaysia"
            />
          ) : (
            <div className="px-4 py-3 bg-slate-50 rounded-xl">
              <p className="text-slate-900 font-medium">{user?.location || 'Not provided'}</p>
            </div>
          )}
        </div>

        {/* Self Introduction */}
        <div className="md:col-span-2 space-y-2">
          <label className="block text-sm font-medium text-slate-700">Self Introduction</label>
          {isEditing ? (
            <textarea
              value={editData.selfIntroduction}
              onChange={(e) => setEditData({...editData, selfIntroduction: e.target.value})}
              rows={4}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
              placeholder="Tell us about yourself, your family, and what kind of help you're looking for..."
            />
          ) : (
            <div className="px-4 py-3 bg-slate-50 rounded-xl">
              <p className="text-slate-900 leading-relaxed">{user?.selfIntroduction || 'Not provided'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

export const EmployerHouseholdInfo = ({ user, isEditing, editData, setEditData }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
    <div className="px-8 py-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-slate-900">Household Information</h3>
          <p className="text-sm text-slate-500">Details about your home and family</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Household Size */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">Household Size</label>
          {isEditing ? (
            <select
              value={editData.householdSize}
              onChange={(e) => setEditData({...editData, householdSize: e.target.value})}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
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
            <div className="px-4 py-3 bg-slate-50 rounded-xl">
              <p className="text-slate-900 font-medium">
                {user?.householdSize ? `${user.householdSize} ${user.householdSize === '1' ? 'person' : 'people'}` : 'Not provided'}
              </p>
            </div>
          )}
        </div>

        {/* Has Kids */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">Children at Home</label>
          {isEditing ? (
            <div className="px-4 py-3 bg-slate-50 rounded-xl">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={editData.hasKids || false}
                  onChange={(e) => setEditData({...editData, hasKids: e.target.checked})}
                  className="w-5 h-5 text-blue-600 bg-white border-slate-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <span className="text-slate-700 font-medium">I have children at home</span>
              </label>
            </div>
          ) : (
            <div className="px-4 py-3 bg-slate-50 rounded-xl">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${user?.hasKids ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                <p className="text-slate-900 font-medium">{user?.hasKids ? 'Yes' : 'No'}</p>
              </div>
            </div>
          )}
        </div>

        {/* Number of Kids - only show if hasKids is true */}
        {(isEditing ? editData.hasKids : user?.hasKids) && (
          <>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Number of Children</label>
              {isEditing ? (
                <select
                  value={editData.numberOfKids}
                  onChange={(e) => setEditData({...editData, numberOfKids: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                >
                  <option value="">Select number of children</option>
                  <option value="1">1 child</option>
                  <option value="2">2 children</option>
                  <option value="3">3 children</option>
                  <option value="4">4 children</option>
                  <option value="5+">5+ children</option>
                </select>
              ) : (
                <div className="px-4 py-3 bg-slate-50 rounded-xl">
                  <p className="text-slate-900 font-medium">{user?.numberOfKids || 'Not specified'}</p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Children's Ages</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.kidsAges}
                  onChange={(e) => setEditData({...editData, kidsAges: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="e.g., 3, 7, 12 years old"
                />
              ) : (
                <div className="px-4 py-3 bg-slate-50 rounded-xl">
                  <p className="text-slate-900 font-medium">{user?.kidsAges || 'Not specified'}</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* Has Pets */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">Pets at Home</label>
          {isEditing ? (
            <div className="px-4 py-3 bg-slate-50 rounded-xl">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={editData.hasPets || false}
                  onChange={(e) => setEditData({...editData, hasPets: e.target.checked})}
                  className="w-5 h-5 text-blue-600 bg-white border-slate-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <span className="text-slate-700 font-medium">I have pets at home</span>
              </label>
            </div>
          ) : (
            <div className="px-4 py-3 bg-slate-50 rounded-xl">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${user?.hasPets ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                <p className="text-slate-900 font-medium">{user?.hasPets ? 'Yes' : 'No'}</p>
              </div>
            </div>
          )}
        </div>

        {/* Pet Details - only show if hasPets is true */}
        {(isEditing ? editData.hasPets : user?.hasPets) && (
          <div className="md:col-span-2 space-y-2">
            <label className="block text-sm font-medium text-slate-700">Pet Details</label>
            {isEditing ? (
              <textarea
                value={editData.petDetails}
                onChange={(e) => setEditData({...editData, petDetails: e.target.value})}
                rows={3}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                placeholder="e.g., 1 golden retriever (friendly), 2 cats (indoor only)"
              />
            ) : (
              <div className="px-4 py-3 bg-slate-50 rounded-xl">
                <p className="text-slate-900 leading-relaxed">{user?.petDetails || 'Not specified'}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  </div>
);

export const EmployerPreferences = ({ user, isEditing, editData, setEditData }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
    <div className="px-8 py-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-slate-900">Preferences & Requirements</h3>
          <p className="text-sm text-slate-500">Your preferences for the perfect helper</p>
        </div>
      </div>
      
      <div className="space-y-6">
        
        {/* Preferred Languages */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-slate-700">Preferred Languages</label>
          {isEditing ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['English', 'Mandarin', 'Malay', 'Tamil', 'Tagalog', 'Indonesian', 'Thai', 'Myanmar'].map((language) => (
                <label key={language} className="flex items-center space-x-2 px-3 py-2 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer">
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
                    className="w-4 h-4 text-blue-600 bg-white border-slate-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-sm text-slate-700 font-medium">{language}</span>
                </label>
              ))}
            </div>
          ) : (
            <div className="px-4 py-3 bg-slate-50 rounded-xl">
              {user?.preferredLanguages && user.preferredLanguages.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {user.preferredLanguages.map((language, index) => (
                    <span key={index} className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                      {language}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 font-medium">No preference specified</p>
              )}
            </div>
          )}
        </div>

        {/* Specific Requirements */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">Specific Requirements</label>
          {isEditing ? (
            <textarea
              value={editData.specificRequirements}
              onChange={(e) => setEditData({...editData, specificRequirements: e.target.value})}
              rows={4}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
              placeholder="Any specific requirements, preferences, or things helpers should know about working in your household"
            />
          ) : (
            <div className="px-4 py-3 bg-slate-50 rounded-xl">
              <p className="text-slate-900 leading-relaxed">{user?.specificRequirements || 'No specific requirements'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);
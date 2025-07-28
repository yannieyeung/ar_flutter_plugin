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

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Location</label>
          {isEditing ? (
            <input
              type="text"
              value={editData.location}
              onChange={(e) => setEditData({...editData, location: e.target.value})}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="City, State"
            />
          ) : (
            <p className="mt-1 text-sm text-gray-900">{user?.location || 'Not provided'}</p>
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

        {/* Description */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">About Me</label>
          {isEditing ? (
            <textarea
              value={editData.description}
              onChange={(e) => setEditData({...editData, description: e.target.value})}
              rows={4}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Tell us about yourself and what you're looking for in a helper..."
            />
          ) : (
            <p className="mt-1 text-sm text-gray-900">{user?.description || 'Not provided'}</p>
          )}
        </div>
      </div>
    </div>
  </div>
);

export const EmployerCompanyInfo = ({ user, isEditing, editData, setEditData }) => (
  <div className="bg-white overflow-hidden shadow rounded-lg">
    <div className="px-4 py-5 sm:p-6">
      <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Company Information</h3>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        
        {/* Company Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Company Name</label>
          {isEditing ? (
            <input
              type="text"
              value={editData.companyName}
              onChange={(e) => setEditData({...editData, companyName: e.target.value})}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          ) : (
            <p className="mt-1 text-sm text-gray-900">{user?.companyName || 'Not provided'}</p>
          )}
        </div>

        {/* Company Size */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Company Size</label>
          {isEditing ? (
            <select
              value={editData.companySize}
              onChange={(e) => setEditData({...editData, companySize: e.target.value})}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Select company size</option>
              <option value="1-10">1-10 employees</option>
              <option value="11-50">11-50 employees</option>
              <option value="51-200">51-200 employees</option>
              <option value="201-500">201-500 employees</option>
              <option value="500+">500+ employees</option>
            </select>
          ) : (
            <p className="mt-1 text-sm text-gray-900">{user?.companySize || 'Not provided'}</p>
          )}
        </div>

        {/* Industry */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Industry</label>
          {isEditing ? (
            <input
              type="text"
              value={editData.industry}
              onChange={(e) => setEditData({...editData, industry: e.target.value})}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="e.g., Healthcare, Technology, Manufacturing"
            />
          ) : (
            <p className="mt-1 text-sm text-gray-900">{user?.industry || 'Not provided'}</p>
          )}
        </div>
      </div>
    </div>
  </div>
);
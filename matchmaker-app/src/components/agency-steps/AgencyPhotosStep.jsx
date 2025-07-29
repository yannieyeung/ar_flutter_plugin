import React from 'react';
import PhotoUpload from '../PhotoUpload';

const AgencyPhotosStep = ({ data, onChange, errors }) => {
  const handlePhotoChange = (field, photos) => {
    const newData = { ...data, [field]: photos };
    onChange(newData);
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Agency Photos</h2>
        <p className="text-gray-600">Showcase your agency with professional photos</p>
      </div>

      {/* Profile Photo */}
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
        <PhotoUpload
          label="Agency Profile Photo"
          description="Upload a professional photo representing your agency. This could be your logo, office front, or a team photo."
          maxFiles={1}
          photos={data.profilePhoto || []}
          onChange={(photos) => handlePhotoChange('profilePhoto', photos)}
          uploadPath="agency-profile-photos"
          required={false}
        />
      </div>

      {/* Business Photos */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <PhotoUpload
          label="Business Photos"
          description="Upload photos that showcase your business - office interior, meeting rooms, staff, certificates, or any other relevant business imagery."
          maxFiles={5}
          photos={data.businessPhotos || []}
          onChange={(photos) => handlePhotoChange('businessPhotos', photos)}
          uploadPath="agency-business-photos"
          required={false}
        />
      </div>

      {/* Photo Guidelines */}
      <div className="bg-green-50 p-6 rounded-lg border border-green-200">
        <h3 className="text-lg font-medium text-green-800 mb-3">📸 Photo Guidelines for Professional Presentation</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h4 className="font-medium text-green-700 mb-3">Profile Photo Tips:</h4>
            <ul className="text-green-600 space-y-2">
              <li>• Use your official company logo if available</li>
              <li>• Professional headshot of the owner/manager</li>
              <li>• Clear photo of your office exterior with signage</li>
              <li>• High resolution and good lighting</li>
              <li>• Avoid blurry or pixelated images</li>
              <li>• Keep it professional and trustworthy</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-green-700 mb-3">Business Photo Ideas:</h4>
            <ul className="text-green-600 space-y-2">
              <li>• Office interior and reception area</li>
              <li>• Meeting or consultation rooms</li>
              <li>• Team photos with staff members</li>
              <li>• Certificates and awards displayed</li>
              <li>• Training or orientation sessions</li>
              <li>• Professional events or ceremonies</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Photo Benefits */}
      <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
        <h3 className="text-lg font-medium text-yellow-800 mb-3">🌟 Why Photos Matter for Your Agency</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-yellow-700">
          <div>
            <h4 className="font-medium mb-2">Build Trust & Credibility:</h4>
            <ul className="space-y-1">
              <li>• Shows you have a real, physical presence</li>
              <li>• Demonstrates professionalism and transparency</li>
              <li>• Helps employers feel confident in your services</li>
              <li>• Creates a personal connection with potential clients</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Competitive Advantage:</h4>
            <ul className="space-y-1">
              <li>• Stand out from agencies without photos</li>
              <li>• Showcase your modern, tech-savvy approach</li>
              <li>• Highlight your office environment and facilities</li>
              <li>• Display team expertise and professionalism</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Technical Requirements */}
      <div className="bg-gray-100 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-gray-800 mb-3">Technical Requirements:</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
          <div>
            <h5 className="font-medium text-gray-700">File Formats:</h5>
            <p>JPG, PNG, WebP</p>
          </div>
          <div>
            <h5 className="font-medium text-gray-700">File Size:</h5>
            <p>Maximum 5MB per photo</p>
          </div>
          <div>
            <h5 className="font-medium text-gray-700">Recommended Size:</h5>
            <p>At least 800x600 pixels</p>
          </div>
        </div>
      </div>

      {/* Photo Summary */}
      <div className="bg-gray-100 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-gray-800 mb-2">Photo Summary:</h4>
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <span className="font-medium">Profile Photo:</span>
            <span className="ml-1">{(data.profilePhoto || []).length}/1</span>
          </div>
          <div>
            <span className="font-medium">Business Photos:</span>
            <span className="ml-1">{(data.businessPhotos || []).length}/5</span>
          </div>
        </div>
      </div>

      {/* Optional Notice */}
      <div className="text-center p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-700">
          <strong>Note:</strong> All photo uploads are optional, but they significantly improve your agency's credibility and trustworthiness. 
          Agencies with photos receive 3x more inquiries from potential clients.
          You can always add more photos later from your agency dashboard.
        </p>
      </div>

      {/* Privacy Notice */}
      <div className="text-center p-3 bg-gray-50 rounded-lg border">
        <p className="text-xs text-gray-600">
          <strong>Privacy:</strong> Your photos are stored securely and only displayed to verified employers and helpers on our platform. 
          You can update or remove photos at any time from your agency profile settings.
        </p>
      </div>
    </div>
  );
};

export default AgencyPhotosStep;
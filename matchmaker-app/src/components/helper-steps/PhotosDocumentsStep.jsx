import React from 'react';
import HybridPhotoUpload from '../HybridPhotoUpload';

const PhotosDocumentsStep = ({ data, onChange, errors }) => {
  const handlePhotoChange = (field, photos) => {
    const newData = { ...data, [field]: photos };
    onChange(newData);
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Photos & Documents</h2>
        <p className="text-gray-600">Add your photos and supporting documents (all optional)</p>
      </div>

      {/* Profile Picture */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <HybridPhotoUpload
          label="Profile Picture"
          description="Upload a clear, professional photo of yourself. This will be shown to potential employers."
          maxFiles={1}
          photos={data.profilePicture || []}
          onChange={(photos) => handlePhotoChange('profilePicture', photos)}
          category="profile"
          required={false}
        />
      </div>

      {/* Portfolio Photos */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <HybridPhotoUpload
          label="Portfolio Photos"
          description="Showcase your work! Upload photos of meals you've cooked, spaces you've organized, or any work you're proud of."
          maxFiles={6}
          photos={data.portfolioPhotos || []}
          onChange={(photos) => handlePhotoChange('portfolioPhotos', photos)}
          category="portfolio"
          required={false}
        />
      </div>

      {/* Work Experience Proof (conditional) */}
      {data.hasBeenHelperBefore === 'yes' && (
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <HybridPhotoUpload
            label="Work Experience Proof"
            description="Upload documents that prove your work experience, such as employment certificates, recommendation letters, or work permits."
            maxFiles={5}
            photos={data.experienceProof || []}
            onChange={(photos) => handlePhotoChange('experienceProof', photos)}
            category="experience-proof"
            required={false}
          />
          
          <div className="mt-4 p-4 bg-blue-100 rounded-lg">
            <h4 className="text-sm font-medium text-blue-800 mb-2">Helpful Documents to Upload:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Employment certificates from previous employers</li>
              <li>• Recommendation letters or reference letters</li>
              <li>• Work permits or employment passes</li>
              <li>• Training certificates (e.g., First Aid, Cooking)</li>
              <li>• Photos with previous employer families (with permission)</li>
            </ul>
          </div>
        </div>
      )}

      {/* Certificates & Training */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <HybridPhotoUpload
          label="Certificates & Training"
          description="Upload any relevant certificates, training documents, or qualifications you have earned."
          maxFiles={5}
          photos={data.certificates || []}
          onChange={(photos) => handlePhotoChange('certificates', photos)}
          category="certificates"
          required={false}
        />
        
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <h4 className="text-sm font-medium text-gray-800 mb-2">Useful Certificates to Upload:</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• First Aid or CPR certification</li>
            <li>• Cooking or culinary certificates</li>
            <li>• Childcare or eldercare training</li>
            <li>• Language proficiency certificates</li>
            <li>• Health certificates or medical clearance</li>
            <li>• Educational diplomas or transcripts</li>
          </ul>
        </div>
      </div>

      {/* Identity Documents */}
      <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
        <HybridPhotoUpload
          label="Identity Documents"
          description="Upload copies of your official identification documents. These help verify your identity and eligibility to work."
          maxFiles={3}
          photos={data.identityDocuments || []}
          onChange={(photos) => handlePhotoChange('identityDocuments', photos)}
          category="identity-documents"
          required={false}
        />
        
        <div className="mt-4 p-4 bg-yellow-100 rounded-lg">
          <h4 className="text-sm font-medium text-yellow-800 mb-2">Required Identity Documents:</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Passport (photo page and any relevant visa pages)</li>
            <li>• National ID or government-issued identification</li>
            <li>• Birth certificate (if applicable)</li>
          </ul>
          <div className="mt-3 text-xs text-yellow-600">
            <strong>Privacy Note:</strong> Your documents are stored securely and only shared with potential employers you choose to connect with.
          </div>
        </div>
      </div>

      {/* Photo Guidelines */}
      <div className="bg-green-50 p-6 rounded-lg border border-green-200">
        <h3 className="text-lg font-medium text-green-800 mb-3">📸 Photo Guidelines for Best Results</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-green-700 mb-2">Profile Picture Tips:</h4>
            <ul className="text-green-600 space-y-1">
              <li>• Use good lighting (natural light is best)</li>
              <li>• Smile naturally and look at the camera</li>
              <li>• Wear clean, professional clothing</li>
              <li>• Keep the background simple</li>
              <li>• Avoid sunglasses or hats</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-green-700 mb-2">Portfolio Photo Tips:</h4>
            <ul className="text-green-600 space-y-1">
              <li>• Show your actual work and skills</li>
              <li>• Take clear, well-lit photos</li>
              <li>• Include before/after cleaning photos</li>
              <li>• Show organized spaces or prepared meals</li>
              <li>• Get permission before photographing employer property</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gray-100 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-gray-800 mb-2">Photo Summary:</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
          <div>
            <span className="font-medium">Profile:</span>
            <span className="ml-1">{(data.profilePicture || []).length}/1</span>
          </div>
          <div>
            <span className="font-medium">Portfolio:</span>
            <span className="ml-1">{(data.portfolioPhotos || []).length}/6</span>
          </div>
          <div>
            <span className="font-medium">Certificates:</span>
            <span className="ml-1">{(data.certificates || []).length}/5</span>
          </div>
          <div>
            <span className="font-medium">Identity:</span>
            <span className="ml-1">{(data.identityDocuments || []).length}/3</span>
          </div>
        </div>
        {data.hasBeenHelperBefore === 'yes' && (
          <div className="mt-2 text-sm text-gray-600">
            <span className="font-medium">Experience Proof:</span>
            <span className="ml-1">{(data.experienceProof || []).length}/5</span>
          </div>
        )}
      </div>

      {/* Skip Notice */}
      <div className="text-center p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-700">
          <strong>Note:</strong> All photo uploads are optional, but they significantly improve your chances of finding the right job. 
          You can always add more photos later from your profile dashboard.
        </p>
      </div>
    </div>
  );
};

export default PhotosDocumentsStep;
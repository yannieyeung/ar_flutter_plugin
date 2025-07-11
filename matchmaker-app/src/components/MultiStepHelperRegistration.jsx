import React from 'react';
import MultiStepForm from './MultiStepForm';
import PersonalInfoStep from './helper-steps/PersonalInfoStep';
import PhotosDocumentsStep from './helper-steps/PhotosDocumentsStep';

// Placeholder components for other steps
const MedicalInfoStep = ({ data, onChange, errors }) => (
  <div className="space-y-6">
    <div className="text-center mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Medical History & Dietary Restrictions</h2>
      <p className="text-gray-600">Please share your health information to ensure safe job matching</p>
    </div>
    
    <div className="space-y-6">
      {/* Allergies */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Do you have any allergies?</label>
        <div className="flex space-x-4 mb-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="hasAllergies"
              value="yes"
              checked={data.hasAllergies === 'yes'}
              onChange={(e) => onChange({ ...data, hasAllergies: e.target.value })}
              className="mr-2"
            />
            Yes
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="hasAllergies"
              value="no"
              checked={data.hasAllergies === 'no'}
              onChange={(e) => onChange({ ...data, hasAllergies: e.target.value })}
              className="mr-2"
            />
            No
          </label>
        </div>
        {data.hasAllergies === 'yes' && (
          <textarea
            value={data.allergiesDetails || ''}
            onChange={(e) => onChange({ ...data, allergiesDetails: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Please describe your allergies..."
            rows="2"
          />
        )}
      </div>

      {/* Past Illness */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Do you have any past or existing illnesses?</label>
        <div className="flex space-x-4 mb-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="hasPastIllness"
              value="yes"
              checked={data.hasPastIllness === 'yes'}
              onChange={(e) => onChange({ ...data, hasPastIllness: e.target.value })}
              className="mr-2"
            />
            Yes
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="hasPastIllness"
              value="no"
              checked={data.hasPastIllness === 'no'}
              onChange={(e) => onChange({ ...data, hasPastIllness: e.target.value })}
              className="mr-2"
            />
            No
          </label>
        </div>
        {data.hasPastIllness === 'yes' && (
          <textarea
            value={data.illnessDetails || ''}
            onChange={(e) => onChange({ ...data, illnessDetails: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Please describe your medical history..."
            rows="2"
          />
        )}
      </div>

      {/* Food Preferences */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Food Handling Preferences</label>
        <div className="space-y-2">
          {['no_pork', 'no_beef', 'others'].map(pref => (
            <label key={pref} className="flex items-center">
              <input
                type="checkbox"
                checked={(data.foodHandlingPreferences || []).includes(pref)}
                onChange={(e) => {
                  const current = data.foodHandlingPreferences || [];
                  const newPrefs = e.target.checked
                    ? [...current, pref]
                    : current.filter(p => p !== pref);
                  onChange({ ...data, foodHandlingPreferences: newPrefs });
                }}
                className="mr-2"
              />
              {pref.replace('_', ' ').toUpperCase()}
            </label>
          ))}
        </div>
      </div>

      {/* Required Off Days */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">How many off days do you require per week?</label>
        <select
          value={data.requiredOffDays || ''}
          onChange={(e) => onChange({ ...data, requiredOffDays: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Number</option>
          {[0, 1, 2, 3, 4].map(num => (
            <option key={num} value={num}>{num} day{num !== 1 ? 's' : ''}</option>
          ))}
        </select>
      </div>
    </div>
  </div>
);

const ExperienceStep = ({ data, onChange, errors }) => (
  <div className="space-y-6">
    <div className="text-center mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Work Experience & Skills</h2>
      <p className="text-gray-600">Tell us about your previous experience and skills</p>
    </div>
    
    {data.hasBeenHelperBefore === 'yes' ? (
      <div className="space-y-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-blue-800">Great! Since you have helper experience, please share your skills:</p>
        </div>
        
        {/* Skills Checkboxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { key: 'careOfInfant', label: 'Care of Infants (0-12 months)' },
            { key: 'careOfChildren', label: 'Care of Children (1-12 years)' },
            { key: 'careOfDisabled', label: 'Care of Disabled Persons' },
            { key: 'careOfOldAge', label: 'Care of Elderly' },
            { key: 'generalHousework', label: 'General Housework' },
            { key: 'cooking', label: 'Cooking' }
          ].map(skill => (
            <label key={skill.key} className="flex items-center p-3 border rounded-lg hover:bg-gray-50">
              <input
                type="checkbox"
                checked={data.experience?.[skill.key] || false}
                onChange={(e) => onChange({ 
                  ...data, 
                  experience: { 
                    ...data.experience, 
                    [skill.key]: e.target.checked 
                  }
                })}
                className="mr-3"
              />
              {skill.label}
            </label>
          ))}
        </div>

        {/* Languages */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Languages Spoken</label>
          <input
            type="text"
            value={data.experience?.languagesSpoken || ''}
            onChange={(e) => onChange({ 
              ...data, 
              experience: { 
                ...data.experience, 
                languagesSpoken: e.target.value 
              }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., English, Mandarin, Cantonese, Tagalog"
          />
        </div>

        {/* Other Skills */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Other Skills</label>
          <textarea
            value={data.experience?.otherSkills || ''}
            onChange={(e) => onChange({ 
              ...data, 
              experience: { 
                ...data.experience, 
                otherSkills: e.target.value 
              }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
            placeholder="e.g., Pet care, gardening, tutoring, massage therapy"
          />
        </div>
      </div>
    ) : (
      <div className="text-center py-8">
        <div className="bg-green-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-green-800 mb-2">Welcome New Helpers! 🌟</h3>
          <p className="text-green-700">
            Don't worry about not having helper experience yet. Many employers are happy to train motivated candidates. 
            We'll focus on your other strengths and willingness to learn.
          </p>
        </div>
        
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">What skills or experience do you have that might be relevant?</label>
          <textarea
            value={data.relevantSkills || ''}
            onChange={(e) => onChange({ ...data, relevantSkills: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
            placeholder="e.g., Taking care of siblings, cooking for family, cleaning experience, caring for elderly relatives, etc."
          />
        </div>
      </div>
    )}
  </div>
);

const PreferencesStep = ({ data, onChange, errors }) => (
  <div className="space-y-6">
    <div className="text-center mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Job Preferences</h2>
      <p className="text-gray-600">What type of work are you interested in?</p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[
        { key: 'careOfInfant', label: 'Care for Infants (0-12 months)' },
        { key: 'careOfChildren', label: 'Care for Children (1-12 years)' },
        { key: 'careOfDisabled', label: 'Care for Disabled Persons' },
        { key: 'careOfOldAge', label: 'Care for Elderly' },
        { key: 'generalHousework', label: 'General Housework & Cleaning' },
        { key: 'cooking', label: 'Cooking & Meal Preparation' }
      ].map(pref => (
        <div key={pref.key} className="border rounded-lg p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">{pref.label}</label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name={`pref_${pref.key}`}
                value="yes"
                checked={data.preferences?.[pref.key] === 'yes'}
                onChange={(e) => onChange({ 
                  ...data, 
                  preferences: { 
                    ...data.preferences, 
                    [pref.key]: e.target.value 
                  }
                })}
                className="mr-2"
              />
              Yes
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name={`pref_${pref.key}`}
                value="no"
                checked={data.preferences?.[pref.key] === 'no'}
                onChange={(e) => onChange({ 
                  ...data, 
                  preferences: { 
                    ...data.preferences, 
                    [pref.key]: e.target.value 
                  }
                })}
                className="mr-2"
              />
              No
            </label>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const AvailabilityStep = ({ data, onChange, errors }) => (
  <div className="space-y-6">
    <div className="text-center mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Availability & Interview Preferences</h2>
      <p className="text-gray-600">When can you start working and how would you like to be interviewed?</p>
    </div>
    
    <div className="space-y-6">
      {/* Interview Availability */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">When are you available for interviews?</label>
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="interviewAvailability"
              value="immediate"
              checked={data.interview?.availability === 'immediate'}
              onChange={(e) => onChange({ 
                ...data, 
                interview: { 
                  ...data.interview, 
                  availability: e.target.value 
                }
              })}
              className="mr-2"
            />
            Immediately
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="interviewAvailability"
              value="after_date"
              checked={data.interview?.availability === 'after_date'}
              onChange={(e) => onChange({ 
                ...data, 
                interview: { 
                  ...data.interview, 
                  availability: e.target.value 
                }
              })}
              className="mr-2"
            />
            After a specific date
          </label>
        </div>
        {data.interview?.availability === 'after_date' && (
          <div className="mt-2">
            <input
              type="date"
              value={data.interview?.availabilityDate || ''}
              onChange={(e) => onChange({ 
                ...data, 
                interview: { 
                  ...data.interview, 
                  availabilityDate: e.target.value 
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
      </div>

      {/* Interview Method */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Interview Method</label>
        <select
          value={data.interview?.means || ''}
          onChange={(e) => onChange({ 
            ...data, 
            interview: { 
              ...data.interview, 
              means: e.target.value 
            }
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Interview Method</option>
          <option value="whatsapp_video_call">WhatsApp Video Call</option>
          <option value="voice_call">Voice Call</option>
          <option value="face_to_face">Face to Face</option>
          <option value="others">Others</option>
        </select>
      </div>

      {/* Work Readiness */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Do you have a valid passport?</label>
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="hasValidPassport"
              value="yes"
              checked={data.readiness?.hasValidPassport === 'yes'}
              onChange={(e) => onChange({ 
                ...data, 
                readiness: { 
                  ...data.readiness, 
                  hasValidPassport: e.target.value 
                }
              })}
              className="mr-2"
            />
            Yes
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="hasValidPassport"
              value="no"
              checked={data.readiness?.hasValidPassport === 'no'}
              onChange={(e) => onChange({ 
                ...data, 
                readiness: { 
                  ...data.readiness, 
                  hasValidPassport: e.target.value 
                }
              })}
              className="mr-2"
            />
            No
          </label>
        </div>
      </div>

      {/* Start Work */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">When can you start working?</label>
        <div className="flex space-x-4 mb-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="canStartWork"
              value="immediately"
              checked={data.readiness?.canStartWork === 'immediately'}
              onChange={(e) => onChange({ 
                ...data, 
                readiness: { 
                  ...data.readiness, 
                  canStartWork: e.target.value 
                }
              })}
              className="mr-2"
            />
            Immediately
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="canStartWork"
              value="after_date"
              checked={data.readiness?.canStartWork === 'after_date'}
              onChange={(e) => onChange({ 
                ...data, 
                readiness: { 
                  ...data.readiness, 
                  canStartWork: e.target.value 
                }
              })}
              className="mr-2"
            />
            After a specific date
          </label>
        </div>
        {data.readiness?.canStartWork === 'after_date' && (
          <div className="mt-2">
            <input
              type="date"
              value={data.readiness?.startDate || ''}
              onChange={(e) => onChange({ 
                ...data, 
                readiness: { 
                  ...data.readiness, 
                  startDate: e.target.value 
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
      </div>

      {/* Additional Remarks */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Additional Comments (Optional)</label>
        <textarea
          value={data.otherRemarks || ''}
          onChange={(e) => onChange({ ...data, otherRemarks: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="3"
          placeholder="Anything else you'd like potential employers to know about you..."
        />
      </div>
    </div>
  </div>
);

const MultiStepHelperRegistration = ({ onSubmit, isLoading }) => {
  const steps = [
    {
      title: 'Personal',
      component: PersonalInfoStep,
      validate: (data) => {
        const errors = {};
        if (!data.name) errors.name = 'Name is required';
        if (!data.dateOfBirth) errors.dateOfBirth = 'Date of birth is required';
        if (!data.nationality) errors.nationality = 'Nationality is required';
        if (!data.educationLevel) errors.educationLevel = 'Education level is required';
        if (!data.maritalStatus) errors.maritalStatus = 'Marital status is required';
        if (!data.hasBeenHelperBefore) errors.hasBeenHelperBefore = 'This field is required';
        return errors;
      }
    },
    {
      title: 'Medical',
      component: MedicalInfoStep,
      validate: (data) => ({}) // No required fields in medical step
    },
    {
      title: 'Experience',
      component: ExperienceStep,
      validate: (data) => ({}) // No required fields in experience step
    },
    {
      title: 'Preferences',
      component: PreferencesStep,
      validate: (data) => ({}) // No required fields in preferences step
    },
    {
      title: 'Availability',
      component: AvailabilityStep,
      validate: (data) => ({}) // No required fields in availability step
    },
    {
      title: 'Photos',
      component: PhotosDocumentsStep,
      validate: (data) => ({}) // Photos are optional
    }
  ];

  const handleSubmit = (formData) => {
    console.log('🎯 Multi-step form submitted:', formData);
    
    // Convert to the expected format and include ML optimization
    const optimizedData = {
      ...formData,
      // Add ML profile generation here
      mlProfile: generateMLProfile(formData)
    };
    
    onSubmit(optimizedData);
  };

  const generateMLProfile = (data) => {
    // Calculate age
    const age = data.dateOfBirth ? 
      new Date().getFullYear() - new Date(data.dateOfBirth).getFullYear() : 0;
    
    // Education score mapping
    const educationScores = {
      'primary_school': 0,
      'secondary_school': 1,
      'high_school': 2,
      'university': 3
    };

    return {
      age,
      heightCm: parseInt(data.height) || 0,
      weightKg: parseInt(data.weight) || 0,
      numberOfSiblings: parseInt(data.numberOfSiblings) || 0,
      numberOfChildren: parseInt(data.numberOfChildren) || 0,
      educationScore: educationScores[data.educationLevel] || 0,
      
      // Experience features
      hasHelperExperience: data.hasBeenHelperBefore === 'yes',
      
      // Skills vector
      skillsVector: {
        careOfInfant: data.experience?.careOfInfant || false,
        careOfChildren: data.experience?.careOfChildren || false,
        careOfDisabled: data.experience?.careOfDisabled || false,
        careOfOldAge: data.experience?.careOfOldAge || false,
        generalHousework: data.experience?.generalHousework || false,
        cooking: data.experience?.cooking || false
      },
      
      // Preferences vector
      preferencesVector: {
        careOfInfant: data.preferences?.careOfInfant === 'yes',
        careOfChildren: data.preferences?.careOfChildren === 'yes',
        careOfDisabled: data.preferences?.careOfDisabled === 'yes',
        careOfOldAge: data.preferences?.careOfOldAge === 'yes',
        generalHousework: data.preferences?.generalHousework === 'yes',
        cooking: data.preferences?.cooking === 'yes'
      },
      
      // Health profile
      healthProfile: {
        hasAllergies: data.hasAllergies === 'yes',
        hasMedicalIssues: data.hasPastIllness === 'yes',
        hasPhysicalDisabilities: data.hasPhysicalDisabilities === 'yes',
        requiredOffDays: parseInt(data.requiredOffDays) || 0
      },
      
      // Availability features
      immediatelyAvailable: data.readiness?.canStartWork === 'immediately',
      hasValidPassport: data.readiness?.hasValidPassport === 'yes',
      
      // Photo counts for profile completeness
      profileCompleteness: {
        hasProfilePicture: (data.profilePicture || []).length > 0,
        portfolioPhotosCount: (data.portfolioPhotos || []).length,
        certificatesCount: (data.certificates || []).length,
        proofDocumentsCount: (data.experienceProof || []).length + (data.identityDocuments || []).length
      }
    };
  };

  return (
    <MultiStepForm
      steps={steps}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      title="Helper Registration"
      allowSkip={true}
    />
  );
};

export default MultiStepHelperRegistration;
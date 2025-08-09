import React from 'react';
import MultiStepForm from './MultiStepForm';
import PersonalInfoStep from './helper-steps/PersonalInfoStep';
import PhotosDocumentsStep from './helper-steps/PhotosDocumentsStep';
import { 
  calculateExperienceYears, 
  getTotalExperienceYears, 
  getStructuredExperienceForML,
  validateExperienceData
} from '../lib/experience-utils';
import { clientFeatureComputationService } from '../lib/feature-computation-client';

// Enhanced Medical & Health Information Step
const MedicalInfoStep = ({ data, onChange, errors }) => (
  <div className="space-y-6">
    <div className="text-center mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Medical History & Health Information</h2>
      <p className="text-gray-600">Please share your health information to ensure safe job matching</p>
    </div>
    
    <div className="space-y-6">
      {/* Allergies */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Do you have any allergies? <span className="text-red-500">*</span>
        </label>
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
        {errors.hasAllergies && <p className="text-red-500 text-sm mt-1">{errors.hasAllergies}</p>}
        {data.hasAllergies === 'yes' && (
          <div className="mt-2">
            <textarea
              value={data.allergiesDetails || ''}
              onChange={(e) => onChange({ ...data, allergiesDetails: e.target.value })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.allergiesDetails ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Please describe your allergies (e.g., food allergies, environmental allergies, medications)..."
              rows="3"
            />
            {errors.allergiesDetails && <p className="text-red-500 text-sm mt-1">{errors.allergiesDetails}</p>}
          </div>
        )}
      </div>

      {/* Past Illness */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Do you have any past or existing medical conditions? <span className="text-red-500">*</span>
        </label>
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
        {errors.hasPastIllness && <p className="text-red-500 text-sm mt-1">{errors.hasPastIllness}</p>}
        {data.hasPastIllness === 'yes' && (
          <div className="mt-2">
            <textarea
              value={data.illnessDetails || ''}
              onChange={(e) => onChange({ ...data, illnessDetails: e.target.value })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.illnessDetails ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Please describe your medical history..."
              rows="3"
            />
            {errors.illnessDetails && <p className="text-red-500 text-sm mt-1">{errors.illnessDetails}</p>}
          </div>
        )}
      </div>

      {/* Physical Disabilities */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Do you have any physical disabilities or limitations? <span className="text-red-500">*</span>
        </label>
        <div className="flex space-x-4 mb-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="hasPhysicalDisabilities"
              value="yes"
              checked={data.hasPhysicalDisabilities === 'yes'}
              onChange={(e) => onChange({ ...data, hasPhysicalDisabilities: e.target.value })}
              className="mr-2"
            />
            Yes
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="hasPhysicalDisabilities"
              value="no"
              checked={data.hasPhysicalDisabilities === 'no'}
              onChange={(e) => onChange({ ...data, hasPhysicalDisabilities: e.target.value })}
              className="mr-2"
            />
            No
          </label>
        </div>
        {errors.hasPhysicalDisabilities && <p className="text-red-500 text-sm mt-1">{errors.hasPhysicalDisabilities}</p>}
        {data.hasPhysicalDisabilities === 'yes' && (
          <div className="mt-2">
            <textarea
              value={data.disabilitiesDetails || ''}
              onChange={(e) => onChange({ ...data, disabilitiesDetails: e.target.value })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.disabilitiesDetails ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Please describe any physical limitations that might affect your work..."
              rows="3"
            />
            {errors.disabilitiesDetails && <p className="text-red-500 text-sm mt-1">{errors.disabilitiesDetails}</p>}
          </div>
        )}
      </div>


    </div>
  </div>
);

// Enhanced Experience & Skills Step
const ExperienceStep = ({ data, onChange, errors }) => {
  const EXPERIENCE_LEVELS = ['beginner', 'intermediate', 'advanced', 'expert'];
  const PROFICIENCY_LEVELS = ['basic', 'intermediate', 'advanced', 'native'];
  const LANGUAGES = [
    'English', 'Mandarin', 'Cantonese', 'Malay', 'Tamil', 'Hindi',
    'Tagalog', 'Indonesian', 'Burmese', 'Sinhalese', 'Thai', 'Vietnamese',
    'Arabic', 'French', 'German', 'Spanish', 'Japanese', 'Korean', 'Other'
  ];
  const CUISINES = ['Chinese', 'Western', 'Malay', 'Indian', 'Japanese', 'Korean', 'Thai', 'Vietnamese', 'Indonesian', 'Filipino', 'Italian', 'Mediterranean'];

  // Wrapper functions to use the utility functions with component data
  const getTotalExperienceYearsWrapper = () => getTotalExperienceYears(data.experience);
  const getStructuredExperienceForMLWrapper = () => getStructuredExperienceForML(data.experience);

  const handleExperienceChange = async (type, field, value) => {
    const updatedData = {
      ...data,
      experience: {
        ...data.experience,
        [type]: {
          ...data.experience?.[type],
          [field]: value
        }
      }
    };

    // Auto-calculate and store structured ML data
    updatedData.experienceForML = getStructuredExperienceForML(updatedData.experience);
    
    // Trigger feature computation if helper has ID (during profile updates)
    if (data.uid && (field === 'startYear' || field === 'endYear' || field === 'experienceLevel')) {
      try {
        // Debounce feature computation to avoid excessive calls
        if (handleExperienceChange.timeoutId) {
          clearTimeout(handleExperienceChange.timeoutId);
        }
        
        handleExperienceChange.timeoutId = setTimeout(async () => {
          console.log('🔄 Updating helper features due to experience change...');
          
          // Use client-safe feature computation service
          await clientFeatureComputationService.updateFeatures(
            data.uid, 
            { experience: updatedData.experience, experienceForML: updatedData.experienceForML },
            updatedData
          );
        }, 2000); // 2 second debounce
      } catch (error) {
        console.warn('⚠️ Failed to update helper features:', error);
        // Don't block the UI update
      }
    }
    
    onChange(updatedData);
  };

  const handleLanguageChange = (index, field, value) => {
    const languages = data.experience?.languagesSpoken || [{ language: '', proficiency: 'basic', canTeach: false }];
    const newLanguages = languages.map((lang, i) => 
      i === index ? { ...lang, [field]: value } : lang
    );
    onChange({
      ...data,
      experience: {
        ...data.experience,
        languagesSpoken: newLanguages
      }
    });
  };

  const addLanguage = () => {
    const languages = data.experience?.languagesSpoken || [];
    onChange({
      ...data,
      experience: {
        ...data.experience,
        languagesSpoken: [...languages, { language: '', proficiency: 'basic', canTeach: false }]
      }
    });
  };

  const removeLanguage = (index) => {
    const languages = data.experience?.languagesSpoken || [];
    if (languages.length > 1) {
      onChange({
        ...data,
        experience: {
          ...data.experience,
          languagesSpoken: languages.filter((_, i) => i !== index)
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Work Experience & Skills <span className="text-red-500">*</span></h2>
        <p className="text-gray-600">Tell us about your experience and abilities - this helps us match you with the right employers</p>
        {errors.experience && <p className="text-red-500 text-sm mt-2">{errors.experience}</p>}
        {errors.languages && <p className="text-red-500 text-sm mt-1">{errors.languages}</p>}
        {errors.languagesSpoken && <p className="text-red-500 text-sm mt-1">{errors.languagesSpoken}</p>}
        {errors.relevantSkills && <p className="text-red-500 text-sm mt-1">{errors.relevantSkills}</p>}
      </div>
      
      {data.hasBeenHelperBefore === 'yes' ? (
        <div className="space-y-8">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-blue-800">Great! Let's capture your detailed experience to help match you with the right families.</p>
          </div>
          
          {/* Detailed Experience Sections */}
          {[
            {
              key: 'careOfInfant',
              title: 'Care of Infants (0-12 months)',
              tasks: ['feeding', 'diaper_changing', 'bathing', 'sleep_training', 'playtime', 'development_activities', 'safety_monitoring']
            },
            {
              key: 'careOfChildren',
              title: 'Care of Children (1-12 years)',
              tasks: ['homework_help', 'school_pickup_dropoff', 'meal_preparation', 'playtime', 'extracurricular_activities', 'bedtime_routine', 'tutoring']
            },
            {
              key: 'careOfDisabled',
              title: 'Care of Disabled Persons',
              tasks: ['mobility_assistance', 'personal_care', 'communication_support', 'therapy_assistance', 'medication_management', 'special_equipment_use']
            },
            {
              key: 'careOfOldAge',
              title: 'Care of Elderly',
              tasks: ['mobility_assistance', 'medication_management', 'personal_hygiene', 'companionship', 'meal_assistance', 'medical_appointments']
            },
            {
              key: 'generalHousework',
              title: 'General Housework & Cleaning',
              tasks: ['general_cleaning', 'deep_cleaning', 'laundry', 'ironing', 'organizing', 'grocery_shopping', 'home_maintenance']
            },
            {
              key: 'cooking',
              title: 'Cooking & Meal Preparation',
              tasks: ['meal_planning', 'grocery_shopping', 'food_preparation', 'special_diets', 'baking', 'food_safety']
            }
          ].map(category => (
            <div key={category.key} className="border rounded-lg p-6 bg-gray-50">
              <div className="mb-4">
                <label className="flex items-center text-lg font-medium text-gray-900 mb-2">
                  <input
                    type="checkbox"
                    checked={data.experience?.[category.key]?.hasExperience || false}
                    onChange={(e) => handleExperienceChange(category.key, 'hasExperience', e.target.checked)}
                    className="mr-3 scale-125"
                  />
                  {category.title}
                </label>
              </div>

              {data.experience?.[category.key]?.hasExperience && (
                <div className="ml-8 space-y-4 bg-white p-4 rounded-lg">
                  {/* Experience Level */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
                    <select
                      value={data.experience?.[category.key]?.experienceLevel || 'beginner'}
                      onChange={(e) => handleExperienceChange(category.key, 'experienceLevel', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {EXPERIENCE_LEVELS.map(level => (
                        <option key={level} value={level}>{level.charAt(0).toUpperCase() + level.slice(1)}</option>
                      ))}
                    </select>
                  </div>

                  {/* Years of Experience */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Started Year</label>
                      <input
                        type="number"
                        min="1990"
                        max={new Date().getFullYear()}
                        value={data.experience?.[category.key]?.startYear || ''}
                        onChange={(e) => handleExperienceChange(category.key, 'startYear', parseInt(e.target.value) || '')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={`e.g., ${new Date().getFullYear() - 5}`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Year 
                        <span className="text-xs text-gray-500 ml-1">(leave empty if current)</span>
                      </label>
                      <input
                        type="number"
                        min="1990"
                        max={new Date().getFullYear()}
                        value={data.experience?.[category.key]?.endYear || ''}
                        onChange={(e) => handleExperienceChange(category.key, 'endYear', parseInt(e.target.value) || '')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Current"
                      />
                    </div>
                  </div>
                  
                  {/* Calculate and Display Experience Duration */}
                  {data.experience?.[category.key]?.startYear && (
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Experience Duration:</strong> {
                          (() => {
                            const startYear = data.experience[category.key].startYear;
                            const endYear = data.experience[category.key].endYear || new Date().getFullYear();
                            const years = Math.max(0, endYear - startYear + 1);
                            return years === 1 ? '1 year' : `${years} years`;
                          })()
                        }
                        {!data.experience[category.key].endYear && ' (ongoing)'}
                      </p>
                    </div>
                  )}

                  {/* Specific Tasks */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Specific Tasks You Can Handle</label>
                    <div className="grid grid-cols-2 gap-2">
                      {category.tasks.map(task => (
                        <label key={task} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={(data.experience?.[category.key]?.specificTasks || []).includes(task)}
                            onChange={(e) => {
                              const current = data.experience?.[category.key]?.specificTasks || [];
                              const newTasks = e.target.checked
                                ? [...current, task]
                                : current.filter(t => t !== task);
                              handleExperienceChange(category.key, 'specificTasks', newTasks);
                            }}
                            className="mr-2"
                          />
                          <span className="text-sm">{task.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Cooking-specific fields */}
                  {category.key === 'cooking' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Cuisines You Can Cook</label>
                      <div className="grid grid-cols-3 gap-2">
                        {CUISINES.map(cuisine => (
                          <label key={cuisine} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={(data.experience?.[category.key]?.cuisines || []).includes(cuisine)}
                              onChange={(e) => {
                                const current = data.experience?.[category.key]?.cuisines || [];
                                const newCuisines = e.target.checked
                                  ? [...current, cuisine]
                                  : current.filter(c => c !== cuisine);
                                handleExperienceChange(category.key, 'cuisines', newCuisines);
                              }}
                              className="mr-2"
                            />
                            <span className="text-sm">{cuisine}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Experience Summary */}
          {getTotalExperienceYearsWrapper() > 0 && (
            <div className="border-2 border-green-200 rounded-lg p-6 bg-green-50">
              <h3 className="text-lg font-medium text-green-900 mb-4">📊 Your Experience Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Total Experience</h4>
                  <p className="text-2xl font-bold text-green-600">{getTotalExperienceYearsWrapper()} years</p>
                  <p className="text-sm text-gray-600">Maximum experience across all skills</p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Active Skills</h4>
                  <p className="text-2xl font-bold text-blue-600">{getStructuredExperienceForMLWrapper().activeSkills.length}</p>
                  <p className="text-sm text-gray-600">Skills with experience</p>
                </div>
              </div>
              
              {/* Skills Breakdown */}
              <div className="mt-4">
                <h4 className="font-medium text-gray-900 mb-3">Skills Experience Breakdown</h4>
                <div className="space-y-2">
                  {Object.entries(getStructuredExperienceForMLWrapper().skillsExperience)
                    .filter(([_, skill]) => skill.hasExperience)
                    .map(([category, skill]) => (
                      <div key={category} className="flex justify-between items-center bg-white p-3 rounded-lg">
                        <div>
                          <span className="font-medium capitalize">
                            {category.replace(/([A-Z])/g, ' $1').toLowerCase().replace(/^./, str => str.toUpperCase())}
                          </span>
                          <span className="text-sm text-gray-500 ml-2">
                            ({skill.experienceLevel})
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-green-600">{skill.yearsOfExperience} years</span>
                          {skill.isCurrent && <span className="text-xs text-blue-600 block">Currently active</span>}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* Languages Section */}
          <div className="border rounded-lg p-6 bg-gray-50">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Languages Spoken</h3>
            {(data.experience?.languagesSpoken || [{ language: '', proficiency: 'basic', canTeach: false }]).map((lang, index) => (
              <div key={index} className="bg-white p-4 rounded-lg mb-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                    <select
                      value={lang.language || ''}
                      onChange={(e) => handleLanguageChange(index, 'language', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Language</option>
                      {LANGUAGES.map(language => (
                        <option key={language} value={language}>{language}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Proficiency Level</label>
                    <select
                                                value={lang.proficiency || ''}
                      onChange={(e) => handleLanguageChange(index, 'proficiency', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {PROFICIENCY_LEVELS.map(level => (
                        <option key={level} value={level}>{level.charAt(0).toUpperCase() + level.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={lang.canTeach || false}
                        onChange={(e) => handleLanguageChange(index, 'canTeach', e.target.checked)}
                        className="mr-2"
                      />
                      <span className="text-sm">Can teach children</span>
                    </label>
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeLanguage(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addLanguage}
              className="text-blue-600 hover:text-blue-800"
            >
              + Add Another Language
            </button>
          </div>

          {/* Additional Skills */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Additional Skills & Certifications</label>
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
              rows="4"
              placeholder="e.g., First Aid certified, pet care experience, driving license, massage therapy, tutoring experience, etc."
            />
          </div>

        </div>
      ) : (
        <div className="text-center py-8">
          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-green-800 mb-2">Welcome New Helpers! 🌟</h3>
            <p className="text-green-700">
              Don't worry about not having helper experience yet. Many employers are happy to train motivated candidates. 
              Let's focus on your other strengths and willingness to learn.
            </p>
          </div>
          
          {/* Languages for New Helpers */}
          <div className="mt-6 text-left">
            <label className="block text-sm font-medium text-gray-700 mb-2">Languages You Can Speak <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={data.languagesSpoken || ''}
              onChange={(e) => onChange({ ...data, languagesSpoken: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., English, Mandarin, Cantonese, Tagalog"
            />
          </div>
          
          <div className="mt-6 text-left">
            <label className="block text-sm font-medium text-gray-700 mb-2">What skills or experience do you have that might be relevant? <span className="text-red-500">*</span></label>
            <textarea
              value={data.relevantSkills || ''}
              onChange={(e) => onChange({ ...data, relevantSkills: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              placeholder="e.g., Taking care of siblings, cooking for family, cleaning experience, caring for elderly relatives, retail work, customer service, etc."
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Enhanced Job Preferences Step  
const PreferencesStep = ({ data, onChange, errors }) => {
  const IMPORTANCE_LEVELS = ['low', 'medium', 'high', 'critical'];
  const HOUSE_TYPES = ['Studio Apartment', '1-2 Bedroom Apartment', '3+ Bedroom Apartment', '2-Storey House', '3+ Storey House', 'Condominium', 'Landed Property', 'HDB Flat'];
  const COUNTRIES = ['Singapore', 'Hong Kong', 'UAE', 'Saudi Arabia', 'Qatar', 'Kuwait', 'Taiwan', 'Malaysia', 'Others'];

  const handlePreferenceChange = (type, field, value) => {
    onChange({
      ...data,
      preferences: {
        ...data.preferences,
        [type]: {
          ...data.preferences?.[type],
          [field]: value
        }
      }
    });
  };

  const handleArrayPreference = (type, field, value, checked) => {
    const current = data.preferences?.[type]?.[field] || [];
    const newArray = checked
      ? [...current, value]
      : current.filter(item => item !== value);
    
    handlePreferenceChange(type, field, newArray);
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Job Preferences & Work Requirements <span className="text-red-500">*</span></h2>
        <p className="text-gray-600">Help us match you with the right families by sharing your preferences and work requirements</p>
        {errors.carePreferences && <p className="text-red-500 text-sm mt-2">{errors.carePreferences}</p>}
        {errors.houseworkPreference && <p className="text-red-500 text-sm mt-1">{errors.houseworkPreference}</p>}
        {errors.cookingPreference && <p className="text-red-500 text-sm mt-1">{errors.cookingPreference}</p>}
        {errors.liveInPreference && <p className="text-red-500 text-sm mt-1">{errors.liveInPreference}</p>}
        {errors.petPreference && <p className="text-red-500 text-sm mt-1">{errors.petPreference}</p>}
        {errors.preferredCountries && <p className="text-red-500 text-sm mt-1">{errors.preferredCountries}</p>}
      </div>
      
      {/* Care Preferences with Importance */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900">Care Work Preferences <span className="text-red-500">*</span></h3>
        {[
          { 
            key: 'careOfInfant', 
            label: 'Care for Infants (0-12 months)', 
            description: 'Feeding, diaper changing, bathing, sleep training',
            ageOptions: ['0-3 months', '3-6 months', '6-12 months']
          },
          { 
            key: 'careOfChildren', 
            label: 'Care for Children (1-12 years)', 
            description: 'School pickup, homework help, playtime, meal prep',
            ageOptions: ['1-3 years', '4-6 years', '7-9 years', '10-12 years']
          },
          { 
            key: 'careOfDisabled', 
            label: 'Care for Disabled Persons', 
            description: 'Mobility assistance, personal care, therapy support',
            types: ['Physical disabilities', 'Intellectual disabilities', 'Autism', 'Multiple disabilities']
          },
          { 
            key: 'careOfOldAge', 
            label: 'Care for Elderly', 
            description: 'Companionship, medication management, mobility assistance',
            specialties: ['Dementia care', 'Post-surgery care', 'Mobility assistance', 'Medication management']
          }
        ].map(care => (
          <div key={care.key} className="border rounded-lg p-6 bg-gray-50">
            <div className="mb-4">
              <label className="block text-lg font-medium text-gray-900 mb-2">{care.label}</label>
              <p className="text-sm text-gray-600 mb-3">{care.description}</p>
              
              {/* Willingness */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Willing to do this work?</label>
                  <div className="space-y-2">
                    {['yes', 'maybe', 'no'].map(option => (
                      <label key={option} className="flex items-center">
                        <input
                          type="radio"
                          name={`pref_${care.key}`}
                          value={option}
                          checked={data.preferences?.[care.key]?.willing === option}
                          onChange={(e) => handlePreferenceChange(care.key, 'willing', e.target.value)}
                          className="mr-2"
                        />
                        <span className="capitalize">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Importance Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Importance to you</label>
                  <select
                                              value={data.preferences?.[care.key]?.importance || ''}
                    onChange={(e) => handlePreferenceChange(care.key, 'importance', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {IMPORTANCE_LEVELS.map(level => (
                      <option key={level} value={level}>{level.charAt(0).toUpperCase() + level.slice(1)}</option>
                    ))}
                  </select>
                </div>

                {/* Maximum Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max number willing to care for</label>
                  <select
                    value={data.preferences?.[care.key]?.maxNumber || ''}
                    onChange={(e) => handlePreferenceChange(care.key, 'maxNumber', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">No preference</option>
                    {[1, 2, 3, 4, 5].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Age/Type Preferences */}
              {care.ageOptions && data.preferences?.[care.key]?.willing === 'yes' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Ages</label>
                  <div className="grid grid-cols-2 gap-2">
                    {care.ageOptions.map(age => (
                      <label key={age} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={(data.preferences?.[care.key]?.preferredAges || []).includes(age)}
                          onChange={(e) => handleArrayPreference(care.key, 'preferredAges', age, e.target.checked)}
                          className="mr-2"
                        />
                        <span className="text-sm">{age}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {care.types && data.preferences?.[care.key]?.willing === 'yes' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Types of Disabilities</label>
                  <div className="grid grid-cols-2 gap-2">
                    {care.types.map(type => (
                      <label key={type} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={(data.preferences?.[care.key]?.preferredTypes || []).includes(type)}
                          onChange={(e) => handleArrayPreference(care.key, 'preferredTypes', type, e.target.checked)}
                          className="mr-2"
                        />
                        <span className="text-sm">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {care.specialties && data.preferences?.[care.key]?.willing === 'yes' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Specialties</label>
                  <div className="grid grid-cols-2 gap-2">
                    {care.specialties.map(specialty => (
                      <label key={specialty} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={(data.preferences?.[care.key]?.specialties || []).includes(specialty)}
                          onChange={(e) => handleArrayPreference(care.key, 'specialties', specialty, e.target.checked)}
                          className="mr-2"
                        />
                        <span className="text-sm">{specialty}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Housework & Cooking Preferences */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900">Housework & Cooking Preferences <span className="text-red-500">*</span></h3>
        
        {/* General Housework */}
        <div className="border rounded-lg p-6 bg-gray-50">
          <label className="block text-lg font-medium text-gray-900 mb-2">General Housework & Cleaning</label>
          <p className="text-sm text-gray-600 mb-3">Cleaning, laundry, organizing, grocery shopping</p>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Willing to do housework?</label>
              <div className="space-y-2">
                {['yes', 'maybe', 'no'].map(option => (
                  <label key={option} className="flex items-center">
                    <input
                      type="radio"
                      name="pref_generalHousework"
                      value={option}
                      checked={data.preferences?.generalHousework?.willing === option}
                      onChange={(e) => handlePreferenceChange('generalHousework', 'willing', e.target.value)}
                      className="mr-2"
                    />
                    <span className="capitalize">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Importance to you</label>
              <select
                                          value={data.preferences?.generalHousework?.importance || ''}
                onChange={(e) => handlePreferenceChange('generalHousework', 'importance', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {IMPORTANCE_LEVELS.map(level => (
                  <option key={level} value={level}>{level.charAt(0).toUpperCase() + level.slice(1)}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preferred House Sizes</label>
              <div className="space-y-1">
                {HOUSE_TYPES.map(type => (
                  <label key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={(data.preferences?.generalHousework?.preferredHouseSizes || []).includes(type)}
                      onChange={(e) => handleArrayPreference('generalHousework', 'preferredHouseSizes', type, e.target.checked)}
                      className="mr-2 scale-75"
                    />
                    <span className="text-xs">{type}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Cooking */}
        <div className="border rounded-lg p-6 bg-gray-50">
          <label className="block text-lg font-medium text-gray-900 mb-2">Cooking & Meal Preparation</label>
          <p className="text-sm text-gray-600 mb-3">Meal planning, cooking, baking, special diets</p>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Willing to cook?</label>
              <div className="space-y-2">
                {['yes', 'maybe', 'no'].map(option => (
                  <label key={option} className="flex items-center">
                    <input
                      type="radio"
                      name="pref_cooking"
                      value={option}
                      checked={data.preferences?.cooking?.willing === option}
                      onChange={(e) => handlePreferenceChange('cooking', 'willing', e.target.value)}
                      className="mr-2"
                    />
                    <span className="capitalize">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Importance to you</label>
              <select
                                          value={data.preferences?.cooking?.importance || ''}
                onChange={(e) => handlePreferenceChange('cooking', 'importance', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {IMPORTANCE_LEVELS.map(level => (
                  <option key={level} value={level}>{level.charAt(0).toUpperCase() + level.slice(1)}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Cuisines</label>
              <div className="space-y-1">
                {['Chinese', 'Western', 'Malay', 'Indian', 'Japanese', 'Thai', 'Indonesian'].map(cuisine => (
                  <label key={cuisine} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={(data.preferences?.cooking?.preferredCuisines || []).includes(cuisine)}
                      onChange={(e) => handleArrayPreference('cooking', 'preferredCuisines', cuisine, e.target.checked)}
                      className="mr-2 scale-75"
                    />
                    <span className="text-xs">{cuisine}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Work Environment Preferences */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900">Work Environment Preferences <span className="text-red-500">*</span></h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Live-in Preference */}
          <div className="border rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Live-in Arrangement</label>
            <div className="space-y-2">
              {[
                { value: 'live_in_only', label: 'Live-in only' },
                { value: 'live_out_only', label: 'Live-out only' },
                { value: 'either', label: 'Either is fine' }
              ].map(option => (
                <label key={option.value} className="flex items-center">
                  <input
                    type="radio"
                    name="liveInPreference"
                    value={option.value}
                    checked={data.preferences?.workEnvironment?.liveInPreference === option.value}
                    onChange={(e) => onChange({ 
                      ...data, 
                      preferences: { 
                        ...data.preferences, 
                        workEnvironment: { 
                          ...data.preferences?.workEnvironment,
                          liveInPreference: e.target.value 
                        }
                      }
                    })}
                    className="mr-2"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </div>

          {/* Pet Friendly */}
          <div className="border rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Working with Pets</label>
            <div className="space-y-2">
              {[
                { value: 'love_pets', label: 'I love working with pets' },
                { value: 'comfortable', label: 'Comfortable with pets' },
                { value: 'no_pets', label: 'Prefer no pets' }
              ].map(option => (
                <label key={option.value} className="flex items-center">
                  <input
                    type="radio"
                    name="petFriendly"
                    value={option.value}
                    checked={data.preferences?.workEnvironment?.petFriendly === option.value}
                    onChange={(e) => onChange({ 
                      ...data, 
                      preferences: { 
                        ...data.preferences, 
                        workEnvironment: { 
                          ...data.preferences?.workEnvironment,
                          petFriendly: e.target.value 
                        }
                      }
                    })}
                    className="mr-2"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </div>
          {/* Required Off Days */}
          <div className="border rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Required Off Days <span className="text-red-500">*</span></label>
            <p className="text-xs text-gray-600 mb-3">How many off days do you require per week?</p>
            <select
              value={data.preferences?.workEnvironment?.requiredOffDays || ''}
              onChange={(e) => onChange({ 
                ...data, 
                preferences: { 
                  ...data.preferences, 
                  workEnvironment: { 
                    ...data.preferences?.workEnvironment,
                    requiredOffDays: e.target.value === '' ? '' : parseInt(e.target.value)
                  }
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Number</option>
              {[0, 1, 2, 3, 4].map(num => (
                <option key={num} value={num}>{num} day{num !== 1 ? 's' : ''} per week</option>
              ))}
            </select>
            {errors.requiredOffDays && <p className="text-red-500 text-sm mt-1">{errors.requiredOffDays}</p>}
          </div>
        </div>

        {/* Preferred Countries */}
        <div className="border rounded-lg p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Countries to Work In <span className="text-red-500">*</span></label>
          <div className="grid grid-cols-3 gap-2">
            {COUNTRIES.map(country => (
              <label key={country} className="flex items-center">
                <input
                  type="checkbox"
                  checked={(data.preferences?.location?.preferredCountries || []).includes(country)}
                  onChange={(e) => {
                    const current = data.preferences?.location?.preferredCountries || [];
                    const newCountries = e.target.checked
                      ? [...current, country]
                      : current.filter(c => c !== country);
                    onChange({ 
                      ...data, 
                      preferences: { 
                        ...data.preferences, 
                        location: { 
                          ...data.preferences?.location,
                          preferredCountries: newCountries 
                        }
                      }
                    });
                  }}
                  className="mr-2"
                />
                <span className="text-sm">{country}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Food Handling Preferences */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900">Food Handling & Work Preferences</h3>
        
        <div className="border rounded-lg p-6 bg-gray-50">
          <label className="block text-lg font-medium text-gray-900 mb-2">Food Handling Preferences</label>
          <p className="text-sm text-gray-600 mb-3">Select any dietary or religious restrictions that apply to you</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: 'no_pork', label: 'Cannot handle pork' },
              { value: 'no_beef', label: 'Cannot handle beef' },
              { value: 'no_alcohol', label: 'Cannot handle alcohol' },
              { value: 'vegetarian_only', label: 'Prefer vegetarian cooking only' },
              { value: 'halal_only', label: 'Halal food preparation only' },
              { value: 'kosher_familiar', label: 'Familiar with kosher requirements' }
            ].map(pref => (
              <label key={pref.value} className="flex items-center">
                <input
                  type="checkbox"
                  checked={(data.foodHandlingPreferences || []).includes(pref.value)}
                  onChange={(e) => {
                    const current = data.foodHandlingPreferences || [];
                    const newPrefs = e.target.checked
                      ? [...current, pref.value]
                      : current.filter(p => p !== pref.value);
                    onChange({ ...data, foodHandlingPreferences: newPrefs });
                  }}
                  className="mr-2"
                />
                <span className="text-sm">{pref.label}</span>
              </label>
            ))}
          </div>
        </div>



        {/* Other Remarks */}
        <div className="border rounded-lg p-6 bg-gray-50">
          <label className="block text-lg font-medium text-gray-900 mb-2">Additional Remarks (Optional)</label>
          <p className="text-sm text-gray-600 mb-3">Any other preferences, requirements, or information you'd like to share</p>
          <textarea
            value={data.otherMedicalRemarks || ''}
            onChange={(e) => onChange({ ...data, otherMedicalRemarks: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Any other preferences, work requirements, or information you'd like potential employers to know..."
            rows="3"
          />
        </div>
      </div>
    </div>
  );
};

// Enhanced Availability & Salary Expectations Step
const AvailabilityStep = ({ data, onChange, errors }) => (
  <div className="space-y-8">
    <div className="text-center mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Availability & Salary Expectations <span className="text-red-500">*</span></h2>
      <p className="text-gray-600">Let us know when you can start and your salary expectations</p>
      {errors.minimumSalary && <p className="text-red-500 text-sm mt-2">{errors.minimumSalary}</p>}
      {errors.preferredSalary && <p className="text-red-500 text-sm mt-1">{errors.preferredSalary}</p>}
      {errors.passportStatus && <p className="text-red-500 text-sm mt-1">{errors.passportStatus}</p>}
      {errors.startWork && <p className="text-red-500 text-sm mt-1">{errors.startWork}</p>}
      {errors.visaStatus && <p className="text-red-500 text-sm mt-1">{errors.visaStatus}</p>}
      {errors.interviewAvailability && <p className="text-red-500 text-sm mt-1">{errors.interviewAvailability}</p>}
      {errors.interviewMethod && <p className="text-red-500 text-sm mt-1">{errors.interviewMethod}</p>}
    </div>
    
    <div className="space-y-8">
      {/* Salary Expectations Section */}
      <div className="bg-green-50 p-6 rounded-lg border border-green-200">
        <h3 className="text-lg font-medium text-green-800 mb-4">💰 Salary Expectations</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Minimum Salary */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Monthly Salary Expected <span className="text-red-500">*</span></label>
            <div className="flex">
              <span className="inline-flex items-center px-3 py-2 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-l-md">
                SGD $
              </span>
              <input
                type="number"
                min="500"
                max="3000"
                step="50"
                value={data.expectations?.salary?.minimumAmount || ''}
                onChange={(e) => onChange({ 
                  ...data, 
                  expectations: { 
                    ...data.expectations, 
                    salary: { 
                      ...data.expectations?.salary,
                      minimumAmount: e.target.value 
                    }
                  }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="800"
              />
            </div>
          </div>

          {/* Preferred Salary */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Monthly Salary <span className="text-red-500">*</span></label>
            <div className="flex">
              <span className="inline-flex items-center px-3 py-2 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-l-md">
                SGD $
              </span>
              <input
                type="number"
                min="500"
                max="3000"
                step="50"
                value={data.expectations?.salary?.preferredAmount || ''}
                onChange={(e) => onChange({ 
                  ...data, 
                  expectations: { 
                    ...data.expectations, 
                    salary: { 
                      ...data.expectations?.salary,
                      preferredAmount: e.target.value 
                    }
                  }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="1000"
              />
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {/* Salary Negotiable */}
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={data.expectations?.salary?.negotiable || false}
              onChange={(e) => onChange({ 
                ...data, 
                expectations: { 
                  ...data.expectations, 
                  salary: { 
                    ...data.expectations?.salary,
                    negotiable: e.target.checked 
                  }
                }
              })}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">My salary is negotiable based on job requirements</span>
          </label>

          {/* Performance Bonus */}
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={data.expectations?.salary?.performanceBonusExpected || false}
              onChange={(e) => onChange({ 
                ...data, 
                expectations: { 
                  ...data.expectations, 
                  salary: { 
                    ...data.expectations?.salary,
                    performanceBonusExpected: e.target.checked 
                  }
                }
              })}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">I would like performance bonuses</span>
          </label>
        </div>

        <div className="mt-4 p-3 bg-green-100 rounded-lg">
          <p className="text-xs text-green-700">
            <strong>Tip:</strong> Being flexible with salary can increase your chances of finding the right match. 
            Consider the total package including benefits, working hours, and family environment.
          </p>
        </div>
      </div>

      {/* Work Readiness Section */}
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h3 className="text-lg font-medium text-blue-800 mb-4">🛂 Work Readiness</h3>
        
        <div className="space-y-4">
          {/* Valid Passport */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Do you have a valid passport? <span className="text-red-500">*</span></label>
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
                Yes, valid passport
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
                No, need to apply/renew
              </label>
            </div>
          </div>

          {/* Passport Expiry */}
          {data.readiness?.hasValidPassport === 'yes' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Passport Expiry Date</label>
              <input
                type="date"
                value={data.readiness?.passportExpiry || ''}
                onChange={(e) => onChange({ 
                  ...data, 
                  readiness: { 
                    ...data.readiness, 
                    passportExpiry: e.target.value 
                  }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Start Work */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">When can you start working? <span className="text-red-500">*</span></label>
            <div className="space-y-2">
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
                Immediately (ready to start within 1-2 weeks)
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="canStartWork"
                  value="within_month"
                  checked={data.readiness?.canStartWork === 'within_month'}
                  onChange={(e) => onChange({ 
                    ...data, 
                    readiness: { 
                      ...data.readiness, 
                      canStartWork: e.target.value 
                    }
                  })}
                  className="mr-2"
                />
                Within 1 month
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

          {/* Visa Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Visa/Work Permit Status <span className="text-red-500">*</span></label>
            <select
              value={data.readiness?.visaStatus || ''}
              onChange={(e) => onChange({ 
                ...data, 
                readiness: { 
                  ...data.readiness, 
                  visaStatus: e.target.value 
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Visa Status</option>
              <option value="first_time">First time applying (no previous work permit)</option>
              <option value="valid_permit">Currently have valid work permit</option>
              <option value="expired_permit">Previous work permit expired</option>
              <option value="transfer_ready">Ready for transfer from current employer</option>
              <option value="citizen_pr">Singapore Citizen/PR</option>
            </select>
          </div>
        </div>
      </div>

      {/* Interview Preferences Section */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">📞 Interview Preferences</h3>
        
        <div className="space-y-4">
          {/* Interview Availability */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">When are you available for interviews? <span className="text-red-500">*</span></label>
            <div className="space-y-2">
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
                Available anytime
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="interviewAvailability"
                  value="weekdays_only"
                  checked={data.interview?.availability === 'weekdays_only'}
                  onChange={(e) => onChange({ 
                    ...data, 
                    interview: { 
                      ...data.interview, 
                      availability: e.target.value 
                    }
                  })}
                  className="mr-2"
                />
                Weekdays only
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="interviewAvailability"
                  value="weekends_only"
                  checked={data.interview?.availability === 'weekends_only'}
                  onChange={(e) => onChange({ 
                    ...data, 
                    interview: { 
                      ...data.interview, 
                      availability: e.target.value 
                    }
                  })}
                  className="mr-2"
                />
                Weekends only
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Interview Method <span className="text-red-500">*</span></label>
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
              <option value="zoom_video_call">Zoom Video Call</option>
              <option value="voice_call">Voice Call</option>
              <option value="face_to_face">Face to Face Meeting</option>
              <option value="others">Others (specify in comments)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Additional Comments & Special Requests</label>
        <textarea
          value={data.otherRemarks || ''}
          onChange={(e) => onChange({ ...data, otherRemarks: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="4"
          placeholder="Anything else you'd like potential employers to know about you, your availability, salary expectations, or special requests..."
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
      validate: (data) => {
        const errors = {};
        
        // Required health questions
        if (!data.hasAllergies) {
          errors.hasAllergies = 'Please specify if you have any allergies';
        }
        
        if (!data.hasPastIllness) {
          errors.hasPastIllness = 'Please specify if you have any past or existing medical conditions';
        }
        
        if (!data.hasPhysicalDisabilities) {
          errors.hasPhysicalDisabilities = 'Please specify if you have any physical disabilities or limitations';
        }
        
        // Conditional validation for details when user answers "yes"
        if (data.hasAllergies === 'yes' && (!data.allergiesDetails || data.allergiesDetails.trim() === '')) {
          errors.allergiesDetails = 'Please provide details about your allergies';
        }
        
        if (data.hasPastIllness === 'yes' && (!data.illnessDetails || data.illnessDetails.trim() === '')) {
          errors.illnessDetails = 'Please provide details about your medical history';
        }
        
        if (data.hasPhysicalDisabilities === 'yes' && (!data.disabilitiesDetails || data.disabilitiesDetails.trim() === '')) {
          errors.disabilitiesDetails = 'Please provide details about your physical limitations';
        }
        
        return errors;
      }
    },
    {
      title: 'Experience',
      component: ExperienceStep,
      validate: (data) => {
        const errors = {};
        
        if (data.hasBeenHelperBefore === 'yes') {
          // For experienced helpers, require at least one experience area
          const experiences = ['careOfInfant', 'careOfChildren', 'careOfDisabled', 'careOfOldAge', 'generalHousework', 'cooking'];
          const hasAnyExperience = experiences.some(exp => data.experience?.[exp]?.hasExperience);
          
          if (!hasAnyExperience) {
            errors.experience = 'Please select at least one area of experience';
          }
          
          // Require at least one language
          if (!data.experience?.languagesSpoken || data.experience.languagesSpoken.length === 0 || 
              !data.experience.languagesSpoken[0]?.language) {
            errors.languages = 'Please specify at least one language you can speak';
          }
        } else {
          // For new helpers, require languages and relevant skills
          if (!data.languagesSpoken || data.languagesSpoken.trim() === '') {
            errors.languagesSpoken = 'Please specify the languages you can speak';
          }
          if (!data.relevantSkills || data.relevantSkills.trim() === '') {
            errors.relevantSkills = 'Please describe any relevant skills or experience you have';
          }
        }
        
        return errors;
      }
    },
    {
      title: 'Preferences',
      component: PreferencesStep,
      validate: (data) => {
        const errors = {};
        
        // Require at least one care preference to be specified
        const careTypes = ['careOfInfant', 'careOfChildren', 'careOfDisabled', 'careOfOldAge'];
        const hasAnyCarePreference = careTypes.some(care => 
          data.preferences?.[care]?.willing && data.preferences[care].willing !== ''
        );
        
        if (!hasAnyCarePreference) {
          errors.carePreferences = 'Please specify your willingness for at least one type of care work';
        }
        
        // Require housework and cooking preferences
        if (!data.preferences?.generalHousework?.willing) {
          errors.houseworkPreference = 'Please specify your willingness to do housework';
        }
        
        if (!data.preferences?.cooking?.willing) {
          errors.cookingPreference = 'Please specify your willingness to do cooking';
        }
        
        // Require work environment preferences
        if (!data.preferences?.workEnvironment?.liveInPreference) {
          errors.liveInPreference = 'Please specify your live-in arrangement preference';
        }
        
        if (!data.preferences?.workEnvironment?.petFriendly) {
          errors.petPreference = 'Please specify your preference about working with pets';
        }
        
        // Require required off days to be specified
        const requiredOffDaysValue = data.preferences?.workEnvironment?.requiredOffDays;
        if (requiredOffDaysValue === '' || requiredOffDaysValue === null || requiredOffDaysValue === undefined) {
          errors.requiredOffDays = 'Please specify how many off days you require per week';
        }
        
        // Require at least one preferred country
        if (!data.preferences?.location?.preferredCountries || 
            data.preferences.location.preferredCountries.length === 0) {
          errors.preferredCountries = 'Please select at least one country where you prefer to work';
        }
        
        return errors;
      }
    },
    {
      title: 'Availability',
      component: AvailabilityStep,
      validate: (data) => {
        const errors = {};
        
        // Salary expectations are required
        if (!data.expectations?.salary?.minimumAmount) {
          errors.minimumSalary = 'Please specify your minimum salary expectation';
        }
        
        if (!data.expectations?.salary?.preferredAmount) {
          errors.preferredSalary = 'Please specify your preferred salary';
        }
        
        // Work readiness requirements
        if (!data.readiness?.hasValidPassport) {
          errors.passportStatus = 'Please specify your passport status';
        }
        
        if (!data.readiness?.canStartWork) {
          errors.startWork = 'Please specify when you can start working';
        }
        
        if (!data.readiness?.visaStatus) {
          errors.visaStatus = 'Please specify your current visa/work permit status';
        }
        
        // Interview preferences
        if (!data.interview?.availability) {
          errors.interviewAvailability = 'Please specify your interview availability';
        }
        
        if (!data.interview?.means) {
          errors.interviewMethod = 'Please specify your preferred interview method';
        }
        
        return errors;
      }
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

    const importanceScores = {
      'low': 1,
      'medium': 2,
      'high': 3,
      'critical': 4
    };

    const experienceLevelScores = {
      'beginner': 1,
      'intermediate': 2,
      'advanced': 3,
      'expert': 4
    };

    const proficiencyScores = {
      'basic': 1,
      'intermediate': 2,
      'advanced': 3,
      'native': 4
    };

    const willingnessScores = {
      'no': 0,
      'maybe': 1,
      'yes': 2
    };

    return {
      // Demographics
      age,
      heightCm: parseInt(data.height) || 0,
      weightKg: parseInt(data.weight) || 0,
      numberOfSiblings: parseInt(data.numberOfSiblings) || 0,
      numberOfChildren: parseInt(data.numberOfChildren) || 0,
      educationScore: educationScores[data.educationLevel] || 0,
      
      // Experience features (enhanced from detailed form)
      hasHelperExperience: data.hasBeenHelperBefore === 'yes',
      
      // Detailed experience profile
      experienceProfile: {
        careOfInfant: {
          hasExperience: data.experience?.careOfInfant?.hasExperience || false,
          experienceLevel: experienceLevelScores[data.experience?.careOfInfant?.experienceLevel] || 0,
          yearsExperience: parseInt(data.experience?.careOfInfant?.yearsTo) || 0,
          tasksCount: (data.experience?.careOfInfant?.specificTasks || []).length,
          importance: importanceScores[data.preferences?.careOfInfant?.importance] || 2
        },
        careOfChildren: {
          hasExperience: data.experience?.careOfChildren?.hasExperience || false,
          experienceLevel: experienceLevelScores[data.experience?.careOfChildren?.experienceLevel] || 0,
          yearsExperience: parseInt(data.experience?.careOfChildren?.yearsTo) || 0,
          tasksCount: (data.experience?.careOfChildren?.specificTasks || []).length,
          importance: importanceScores[data.preferences?.careOfChildren?.importance] || 2
        },
        careOfDisabled: {
          hasExperience: data.experience?.careOfDisabled?.hasExperience || false,
          experienceLevel: experienceLevelScores[data.experience?.careOfDisabled?.experienceLevel] || 0,
          yearsExperience: parseInt(data.experience?.careOfDisabled?.yearsTo) || 0,
          tasksCount: (data.experience?.careOfDisabled?.specificTasks || []).length,
          typesHandled: (data.preferences?.careOfDisabled?.preferredTypes || []).length,
          importance: importanceScores[data.preferences?.careOfDisabled?.importance] || 2
        },
        careOfOldAge: {
          hasExperience: data.experience?.careOfOldAge?.hasExperience || false,
          experienceLevel: experienceLevelScores[data.experience?.careOfOldAge?.experienceLevel] || 0,
          yearsExperience: parseInt(data.experience?.careOfOldAge?.yearsTo) || 0,
          tasksCount: (data.experience?.careOfOldAge?.specificTasks || []).length,
          specialtiesCount: (data.preferences?.careOfOldAge?.specialties || []).length,
          importance: importanceScores[data.preferences?.careOfOldAge?.importance] || 2
        },
        generalHousework: {
          hasExperience: data.experience?.generalHousework?.hasExperience || false,
          experienceLevel: experienceLevelScores[data.experience?.generalHousework?.experienceLevel] || 0,
          yearsExperience: parseInt(data.experience?.generalHousework?.yearsTo) || 0,
          tasksCount: (data.experience?.generalHousework?.specificTasks || []).length,
          houseTypesCount: (data.preferences?.generalHousework?.preferredHouseSizes || []).length,
          importance: importanceScores[data.preferences?.generalHousework?.importance] || 2
        },
        cooking: {
          hasExperience: data.experience?.cooking?.hasExperience || false,
          experienceLevel: experienceLevelScores[data.experience?.cooking?.experienceLevel] || 0,
          yearsExperience: parseInt(data.experience?.cooking?.yearsTo) || 0,
          tasksCount: (data.experience?.cooking?.specificTasks || []).length,
          cuisinesCount: (data.experience?.cooking?.cuisines || []).length,
          preferredCuisinesCount: (data.preferences?.cooking?.preferredCuisines || []).length,
          importance: importanceScores[data.preferences?.cooking?.importance] || 2
        }
      },
      
      // Preference scores for matching
      preferencesProfile: {
        careOfInfant: {
          willing: willingnessScores[data.preferences?.careOfInfant?.willing] || 0,
          maxNumber: data.preferences?.careOfInfant?.maxNumber || 0,
          ageRangesCount: (data.preferences?.careOfInfant?.preferredAges || []).length,
          importance: importanceScores[data.preferences?.careOfInfant?.importance] || 2
        },
        careOfChildren: {
          willing: willingnessScores[data.preferences?.careOfChildren?.willing] || 0,
          maxNumber: data.preferences?.careOfChildren?.maxNumber || 0,
          ageRangesCount: (data.preferences?.careOfChildren?.preferredAges || []).length,
          importance: importanceScores[data.preferences?.careOfChildren?.importance] || 2
        },
        careOfDisabled: {
          willing: willingnessScores[data.preferences?.careOfDisabled?.willing] || 0,
          typesCount: (data.preferences?.careOfDisabled?.preferredTypes || []).length,
          importance: importanceScores[data.preferences?.careOfDisabled?.importance] || 2
        },
        careOfOldAge: {
          willing: willingnessScores[data.preferences?.careOfOldAge?.willing] || 0,
          specialtiesCount: (data.preferences?.careOfOldAge?.specialties || []).length,
          importance: importanceScores[data.preferences?.careOfOldAge?.importance] || 2
        },
        generalHousework: {
          willing: willingnessScores[data.preferences?.generalHousework?.willing] || 0,
          houseTypesCount: (data.preferences?.generalHousework?.preferredHouseSizes || []).length,
          importance: importanceScores[data.preferences?.generalHousework?.importance] || 2
        },
        cooking: {
          willing: willingnessScores[data.preferences?.cooking?.willing] || 0,
          cuisinesCount: (data.preferences?.cooking?.preferredCuisines || []).length,
          importance: importanceScores[data.preferences?.cooking?.importance] || 2
        }
      },
      
      // Language capabilities
      languageProfile: {
        languageCount: (data.experience?.languagesSpoken || []).length,
        averageProficiency: calculateAverageProficiency(data.experience?.languagesSpoken || []),
        canTeachChildren: (data.experience?.languagesSpoken || []).some(lang => lang.canTeach),
        hasEnglish: (data.experience?.languagesSpoken || []).some(lang => lang.language === 'English'),
        hasMandarin: (data.experience?.languagesSpoken || []).some(lang => lang.language === 'Mandarin'),
        languagesString: data.languagesSpoken || '' // For new helpers
      },
      
      // Work environment compatibility
      workEnvironmentProfile: {
        liveInPreference: data.preferences?.workEnvironment?.liveInPreference || '',
        liveInFlexible: data.preferences?.workEnvironment?.liveInPreference === 'either',
        petFriendly: data.preferences?.workEnvironment?.petFriendly || '',
        lovePets: data.preferences?.workEnvironment?.petFriendly === 'love_pets',
        countriesCount: (data.preferences?.location?.preferredCountries || []).length,
        willingToRelocate: data.preferences?.location?.preferredCountries?.length > 1
      },
      
      // Health profile
      healthProfile: {
        hasAllergies: data.hasAllergies === 'yes',
        hasMedicalIssues: data.hasPastIllness === 'yes',
        hasPhysicalDisabilities: data.hasPhysicalDisabilities === 'yes',
        foodRestrictions: (data.foodHandlingPreferences || []).length,
        healthScore: calculateHealthScore(data)
      },
      
      // Work preferences profile
      workPreferencesProfile: {
        requiredOffDays: parseInt(data.preferences?.workEnvironment?.requiredOffDays) || 0,
        liveInPreference: data.preferences?.workEnvironment?.liveInPreference || '',
        petFriendly: data.preferences?.workEnvironment?.petFriendly || '',
        workFlexibilityScore: calculateWorkFlexibilityScore(data.preferences?.workEnvironment)
      },
      
      // Salary expectations
      salaryProfile: {
        minimumSalary: parseFloat(data.expectations?.salary?.minimumAmount) || 0,
        preferredSalary: parseFloat(data.expectations?.salary?.preferredAmount) || 0,
        salaryNegotiable: data.expectations?.salary?.negotiable || false,
        wantsBonus: data.expectations?.salary?.performanceBonusExpected || false,
        salaryFlexibilityScore: calculateSalaryFlexibility(data.expectations?.salary)
      },
      
      // Availability features
      availabilityProfile: {
        immediatelyAvailable: data.readiness?.canStartWork === 'immediately',
        withinMonth: data.readiness?.canStartWork === 'within_month',
        hasValidPassport: data.readiness?.hasValidPassport === 'yes',
        visaStatus: data.readiness?.visaStatus || '',
        interviewFlexibility: calculateInterviewFlexibility(data.interview?.availability),
        workReady: data.readiness?.hasValidPassport === 'yes' && 
                   (data.readiness?.canStartWork === 'immediately' || data.readiness?.canStartWork === 'within_month')
      },
      
      // Profile completeness for ranking
      profileCompleteness: {
        basicInfo: calculateBasicInfoScore(data),
        experienceDetail: calculateExperienceDetailScore(data),
        preferencesDetail: calculatePreferencesDetailScore(data),
        hasProfilePicture: (data.profilePicture || []).length > 0,
        portfolioPhotosCount: (data.portfolioPhotos || []).length,
        certificatesCount: (data.certificates || []).length,
        proofDocumentsCount: (data.experienceProof || []).length + (data.identityDocuments || []).length,
        totalScore: calculateTotalCompletenessScore(data)
      }
    };
  };

  // Helper functions for ML profile calculation
  const calculateAverageProficiency = (languages) => {
    if (!languages || languages.length === 0) return 0;
    const scores = { 'basic': 1, 'intermediate': 2, 'advanced': 3, 'native': 4 };
    const total = languages.reduce((sum, lang) => sum + (scores[lang.proficiency] || 1), 0);
    return total / languages.length;
  };

  const calculateHealthScore = (data) => {
    let score = 10; // Start with perfect score
    if (data.hasAllergies === 'yes') score -= 2;
    if (data.hasPastIllness === 'yes') score -= 2;
    if (data.hasPhysicalDisabilities === 'yes') score -= 3;
    if ((data.foodHandlingPreferences || []).length > 2) score -= 1;
    return Math.max(0, score);
  };

  const calculateWorkFlexibilityScore = (workEnvironment) => {
    if (!workEnvironment) return 5;
    let score = 5; // Base score
    
    // Live-in arrangement flexibility
    if (workEnvironment.liveInPreference === 'either') score += 2;
    else if (workEnvironment.liveInPreference === 'live_out_only') score += 1;
    
    // Pet tolerance
    if (workEnvironment.petFriendly === 'love_pets') score += 2;
    else if (workEnvironment.petFriendly === 'comfortable') score += 1;
    
    // Off days requirement (fewer required days = more flexible)
    const offDays = parseInt(workEnvironment.requiredOffDays) || 0;
    if (offDays === 0) score += 2;
    else if (offDays === 1) score += 1;
    else if (offDays >= 3) score -= 1;
    
    return Math.min(10, Math.max(0, score));
  };

  const calculateSalaryFlexibility = (salary) => {
    if (!salary) return 5;
    let score = 0;
    if (salary.negotiable) score += 3;
    if (!salary.performanceBonusExpected) score += 1;
    if (!salary.minimumAmount || salary.minimumAmount < 900) score += 2;
    return Math.min(10, score);
  };

  const calculateInterviewFlexibility = (availability) => {
    const flexibilityScores = {
      'immediate': 4,
      'weekdays_only': 2,
      'weekends_only': 2,
      'after_date': 1
    };
    return flexibilityScores[availability] || 3;
  };

  const calculateBasicInfoScore = (data) => {
    let score = 0;
    if (data.name) score += 1;
    if (data.dateOfBirth) score += 1;
    if (data.nationality) score += 1;
    if (data.height) score += 1;
    if (data.weight) score += 1;
    if (data.educationLevel) score += 1;
    if (data.contactNumber) score += 1;
    return score;
  };

  const calculateExperienceDetailScore = (data) => {
    if (data.hasBeenHelperBefore !== 'yes') return 0;
    let score = 0;
    const experiences = ['careOfInfant', 'careOfChildren', 'careOfDisabled', 'careOfOldAge', 'generalHousework', 'cooking'];
    experiences.forEach(exp => {
      if (data.experience?.[exp]?.hasExperience) {
        score += 1;
        if (data.experience[exp].experienceLevel) score += 0.5;
        if ((data.experience[exp].specificTasks || []).length > 0) score += 0.5;
      }
    });
    return score;
  };

  const calculatePreferencesDetailScore = (data) => {
    let score = 0;
    const preferences = ['careOfInfant', 'careOfChildren', 'careOfDisabled', 'careOfOldAge', 'generalHousework', 'cooking'];
    preferences.forEach(pref => {
      if (data.preferences?.[pref]?.willing) {
        score += 1;
        if (data.preferences[pref].importance) score += 0.5;
      }
    });
    return score;
  };

  const calculateTotalCompletenessScore = (data) => {
    return calculateBasicInfoScore(data) + calculateExperienceDetailScore(data) + calculatePreferencesDetailScore(data);
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
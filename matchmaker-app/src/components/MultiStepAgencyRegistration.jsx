import React from 'react';
import MultiStepForm from './MultiStepForm';
import AgencyBasicInfoStep from './agency-steps/AgencyBasicInfoStep';
import AgencyLicenseStep from './agency-steps/AgencyLicenseStep';
import AgencyServicesStep from './agency-steps/AgencyServicesStep';
import AgencyFeesStep from './agency-steps/AgencyFeesStep';
import AgencyPhotosStep from './agency-steps/AgencyPhotosStep';

const MultiStepAgencyRegistration = ({ onSubmit, isLoading }) => {
  const steps = [
    {
      title: 'Basic Info',
      component: AgencyBasicInfoStep,
      validate: (data) => {
        const errors = {};
        if (!data.businessName) errors.businessName = 'Business name is required';
        if (!data.uenNumber) errors.uenNumber = 'UEN number is required';
        if (!data.contactNumber) errors.contactNumber = 'Contact number is required';
        if (!data.email) errors.email = 'Email is required';
        if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
          errors.email = 'Please enter a valid email address';
        }
        if (!data.businessAddress) errors.businessAddress = 'Business address is required';
        return errors;
      }
    },
    {
      title: 'Licenses',
      component: AgencyLicenseStep,
      validate: (data) => {
        const errors = {};
        if (!data.eaLicenseNumber) errors.eaLicenseNumber = 'EA License number is required';
        return errors;
      }
    },
    {
      title: 'Services',
      component: AgencyServicesStep,
      validate: (data) => {
        const errors = {};
        if (!data.servicesProvided || data.servicesProvided.length === 0) {
          errors.servicesProvided = 'Please select at least one service type';
        }
        if (!data.countriesOfHelpers || data.countriesOfHelpers.length === 0) {
          errors.countriesOfHelpers = 'Please select at least one country';
        }
        return errors;
      }
    },
    {
      title: 'Fees & Policies',
      component: AgencyFeesStep,
      validate: (data) => {
        const errors = {};
        if (!data.agencyFee || !data.agencyFee.currency || !data.agencyFee.minAmount || !data.agencyFee.maxAmount) {
          errors.agencyFee = 'Please specify your agency fee range';
        }
        if (data.agencyFee?.minAmount && data.agencyFee?.maxAmount && 
            parseFloat(data.agencyFee.minAmount) > parseFloat(data.agencyFee.maxAmount)) {
          errors.agencyFee = 'Minimum fee cannot be higher than maximum fee';
        }
        if (!data.providesReplacement) errors.providesReplacement = 'Please specify if you provide replacement helpers';
        return errors;
      }
    },
    {
      title: 'Photos',
      component: AgencyPhotosStep,
      validate: (data) => ({}) // Photos are optional
    }
  ];

  const handleSubmit = (formData) => {
    console.log('🏢 Agency registration submitted:', formData);
    
    // Enhance data with computed fields
    const enhancedData = {
      ...formData,
      registrationCompletedAt: new Date().toISOString(),
      profileCompleteness: calculateProfileCompleteness(formData),
      agencyProfile: generateAgencyProfile(formData)
    };
    
    onSubmit(enhancedData);
  };

  const calculateProfileCompleteness = (data) => {
    let completeness = 0;
    const totalFields = 12;
    
    // Basic info (6 fields)
    if (data.businessName) completeness += 1;
    if (data.uenNumber) completeness += 1;
    if (data.eaLicenseNumber) completeness += 1;
    if (data.contactNumber) completeness += 1;
    if (data.email) completeness += 1;
    if (data.businessAddress) completeness += 1;
    
    // Services (2 fields)
    if (data.servicesProvided && data.servicesProvided.length > 0) completeness += 1;
    if (data.countriesOfHelpers && data.countriesOfHelpers.length > 0) completeness += 1;
    
    // Fees (2 fields)
    if (data.agencyFee && data.agencyFee.currency && data.agencyFee.minAmount) completeness += 1;
    if (data.providesReplacement) completeness += 1;
    
    // Photos (2 fields)
    if (data.profilePhoto && data.profilePhoto.length > 0) completeness += 1;
    if (data.businessPhotos && data.businessPhotos.length > 0) completeness += 1;
    
    return Math.round((completeness / totalFields) * 100);
  };

  const generateAgencyProfile = (data) => {
    return {
      // Basic metrics
      hasValidLicense: !!(data.eaLicenseNumber),
      servicesCount: (data.servicesProvided || []).length,
      countriesSupported: (data.countriesOfHelpers || []).length,
      
      // Service capabilities
      offersAgencyHire: (data.servicesProvided || []).includes('Agency Hire'),
      offersDirectHire: (data.servicesProvided || []).includes('Direct Hire'),
      providesReplacement: data.providesReplacement === 'yes',
      replacementCount: data.providesReplacement === 'yes' ? parseInt(data.replacementCount) || 0 : 0,
      
      // Fee structure
      feeStructure: {
        currency: data.agencyFee?.currency || 'SGD',
        minFee: parseFloat(data.agencyFee?.minAmount) || 0,
        maxFee: parseFloat(data.agencyFee?.maxAmount) || 0,
        averageFee: data.agencyFee?.minAmount && data.agencyFee?.maxAmount 
          ? (parseFloat(data.agencyFee.minAmount) + parseFloat(data.agencyFee.maxAmount)) / 2 
          : 0
      },
      
      // Geographic reach
      regionalFocus: {
        southeastAsia: (data.countriesOfHelpers || []).some(country => 
          ['Indonesia', 'Philippines', 'Myanmar', 'Thailand', 'Malaysia', 'Cambodia'].includes(country)),
        eastAsia: (data.countriesOfHelpers || []).some(country => 
          ['Hong Kong', 'Macau', 'South Korea', 'Taiwan'].includes(country)),
        southAsia: (data.countriesOfHelpers || []).some(country => 
          ['Sri Lanka', 'India', 'Bangladesh'].includes(country))
      },
      
      // Profile completeness metrics
      hasPhotos: (data.profilePhoto || []).length > 0 || (data.businessPhotos || []).length > 0,
      photoCount: (data.profilePhoto || []).length + (data.businessPhotos || []).length,
      
      // Contact preferences
      contactMethods: {
        phone: !!(data.contactNumber),
        email: !!(data.email),
        hasMultipleContacts: !!(data.contactNumber && data.email)
      }
    };
  };

  return (
    <MultiStepForm
      steps={steps}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      title="Agency Registration"
      allowSkip={false}
    />
  );
};

export default MultiStepAgencyRegistration;
import React, { useState } from 'react';

const MultiStepForm = ({ 
  steps, 
  onSubmit, 
  onStepChange,
  isLoading = false,
  title = "Multi-Step Form",
  allowSkip = false
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [stepErrors, setStepErrors] = useState({});

  const updateFormData = (stepData) => {
    setFormData(prev => ({
      ...prev,
      [`step_${currentStep}`]: stepData
    }));
  };

  const validateCurrentStep = () => {
    const currentStepComponent = steps[currentStep];
    if (currentStepComponent.validate) {
      const errors = currentStepComponent.validate(formData[`step_${currentStep}`] || {});
      setStepErrors(prev => ({
        ...prev,
        [currentStep]: errors
      }));
      return Object.keys(errors).length === 0;
    }
    return true;
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      if (currentStep < steps.length - 1) {
        const newStep = currentStep + 1;
        setCurrentStep(newStep);
        if (onStepChange) onStepChange(newStep);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      if (onStepChange) onStepChange(newStep);
    }
  };

  const goToStep = (stepIndex) => {
    if (stepIndex >= 0 && stepIndex < steps.length) {
      setCurrentStep(stepIndex);
      if (onStepChange) onStepChange(stepIndex);
    }
  };

  const handleSubmit = () => {
    if (validateCurrentStep()) {
      // Combine all step data
      const allData = {};
      Object.keys(formData).forEach(key => {
        Object.assign(allData, formData[key]);
      });
      onSubmit(allData);
    }
  };

  const getCurrentStepComponent = () => {
    const step = steps[currentStep];
    const StepComponent = step.component;
    
    return (
      <StepComponent
        data={formData[`step_${currentStep}`] || {}}
        onChange={updateFormData}
        errors={stepErrors[currentStep] || {}}
        onNext={nextStep}
        onPrev={prevStep}
        isFirst={currentStep === 0}
        isLast={currentStep === steps.length - 1}
        allowSkip={allowSkip}
      />
    );
  };

  const getProgressPercentage = () => {
    return ((currentStep + 1) / steps.length) * 100;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{title}</h1>
        
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm font-medium text-gray-700">
              {Math.round(getProgressPercentage())}% Complete
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>
          
          {/* Step Indicators */}
          <div className="flex justify-between">
            {steps.map((step, index) => (
              <div 
                key={index}
                className="flex flex-col items-center cursor-pointer"
                onClick={() => goToStep(index)}
              >
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${index <= currentStep 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-300 text-gray-600'
                  }
                  ${index === currentStep ? 'ring-2 ring-blue-300' : ''}
                  transition-all duration-200
                `}>
                  {index < currentStep ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                <span className={`
                  mt-2 text-xs text-center max-w-16
                  ${index <= currentStep ? 'text-blue-600 font-medium' : 'text-gray-500'}
                `}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Current Step Content */}
      <div className="min-h-96">
        {getCurrentStepComponent()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={prevStep}
          disabled={currentStep === 0}
          className={`
            px-6 py-2 rounded-lg font-medium transition-colors
            ${currentStep === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }
          `}
        >
          Previous
        </button>

        <div className="flex space-x-3">
          {allowSkip && currentStep < steps.length - 1 && (
            <button
              type="button"
              onClick={nextStep}
              className="px-6 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Skip
            </button>
          )}
          
          {currentStep < steps.length - 1 ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-8 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {isLoading ? 'Submitting...' : 'Complete Registration'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MultiStepForm;
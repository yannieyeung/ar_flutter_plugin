import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const MultiStepForm = ({ 
  steps, 
  onSubmit, 
  onStepChange,
  isLoading = false,
  title = "Multi-Step Form",
  allowSkip = false
}) => {
  const { signOut, user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [stepErrors, setStepErrors] = useState({});
  const [stepCompletionStatus, setStepCompletionStatus] = useState({});

  const updateFormData = (newData) => {
    // Get current step data
    const currentStepData = formData[`step_${currentStep}`] || {};
    
    // Get all previous step data for context
    const allPreviousData = {};
    for (let i = 0; i < currentStep; i++) {
      Object.assign(allPreviousData, formData[`step_${i}`] || {});
    }
    
    // Find what changed by comparing newData with combined previous + current
    const combinedPreviousAndCurrent = { ...allPreviousData, ...currentStepData };
    const changedFields = {};
    
    Object.keys(newData).forEach(key => {
      if (newData[key] !== combinedPreviousAndCurrent[key]) {
        changedFields[key] = newData[key];
      }
    });
    
    // Only update the current step with the changed fields
    setFormData(prev => ({
      ...prev,
      [`step_${currentStep}`]: {
        ...currentStepData,
        ...changedFields
      }
    }));
  };

  const validateCurrentStep = () => {
    const currentStepComponent = steps[currentStep];
    if (currentStepComponent.validate) {
      // Combine all previous step data for validation context
      const allPreviousData = {};
      for (let i = 0; i <= currentStep; i++) {
        Object.assign(allPreviousData, formData[`step_${i}`] || {});
      }
      
      const errors = currentStepComponent.validate(allPreviousData);
      setStepErrors(prev => ({
        ...prev,
        [currentStep]: errors
      }));
      
      const isComplete = Object.keys(errors).length === 0;
      
      // Update completion status for this step
      setStepCompletionStatus(prev => ({
        ...prev,
        [currentStep]: isComplete
      }));
      
      return isComplete;
    }
    
    // If no validation function, consider it complete
    setStepCompletionStatus(prev => ({
      ...prev,
      [currentStep]: true
    }));
    
    return true;
  };

  const validateStep = (stepIndex) => {
    const stepComponent = steps[stepIndex];
    if (stepComponent.validate) {
      // Combine all data up to this step for validation context
      const allPreviousData = {};
      for (let i = 0; i <= stepIndex; i++) {
        Object.assign(allPreviousData, formData[`step_${i}`] || {});
      }
      
      const errors = stepComponent.validate(allPreviousData);
      const isComplete = Object.keys(errors).length === 0;
      
      setStepCompletionStatus(prev => ({
        ...prev,
        [stepIndex]: isComplete
      }));
      
      return isComplete;
    }
    
    setStepCompletionStatus(prev => ({
      ...prev,
      [stepIndex]: true
    }));
    
    return true;
  };

  const validateAllSteps = () => {
    let allValid = true;
    for (let i = 0; i < steps.length; i++) {
      const isValid = validateStep(i);
      if (!isValid) allValid = false;
    }
    return allValid;
  };

  const nextStep = () => {
    // Validate current step but don't block navigation
    validateCurrentStep();
    
    if (currentStep < steps.length - 1) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      if (onStepChange) onStepChange(newStep);
    }
  };

  const prevStep = () => {
    // Validate current step before leaving
    validateCurrentStep();
    
    if (currentStep > 0) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      if (onStepChange) onStepChange(newStep);
    }
  };

  const goToStep = (stepIndex) => {
    if (stepIndex >= 0 && stepIndex < steps.length) {
      // Validate current step before leaving
      validateCurrentStep();
      
      setCurrentStep(stepIndex);
      if (onStepChange) onStepChange(stepIndex);
    }
  };

  const handleSubmit = () => {
    // Validate current step first
    validateCurrentStep();
    
    // Then validate all steps
    if (validateAllSteps()) {
      // Combine all step data
      const allData = {};
      Object.keys(formData).forEach(key => {
        Object.assign(allData, formData[key]);
      });
      onSubmit(allData);
    } else {
      // Show error message about incomplete steps
      alert('Please complete all required fields before submitting. Check the steps marked with warning indicators.');
    }
  };

  const getIncompleteSteps = () => {
    const incomplete = [];
    for (let i = 0; i < steps.length; i++) {
      if (stepCompletionStatus[i] === false) {
        incomplete.push(i);
      }
    }
    return incomplete;
  };

  const getCurrentStepComponent = () => {
    const step = steps[currentStep];
    const StepComponent = step.component;
    
    // Combine all previous step data for context
    const allPreviousData = {};
    for (let i = 0; i <= currentStep; i++) {
      Object.assign(allPreviousData, formData[`step_${i}`] || {});
    }
    
    return (
      <StepComponent
        data={allPreviousData}
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
    // Count how many steps are actually completed (validation passed)
    const completedSteps = Object.values(stepCompletionStatus).filter(status => status === true).length;
    return (completedSteps / steps.length) * 100;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <div className="flex items-center space-x-4">
            {user && (
              <div className="text-sm text-gray-600">
                Signed in as: <span className="font-medium">{user.email || user.phoneNumber}</span>
              </div>
            )}
            <button
              onClick={signOut}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
        
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
            {steps.map((step, index) => {
              const isCompleted = stepCompletionStatus[index] === true;
              const isIncomplete = stepCompletionStatus[index] === false;
              const isCurrent = index === currentStep;
              const isVisited = stepCompletionStatus.hasOwnProperty(index);
              
              return (
                <div 
                  key={index}
                  className="flex flex-col items-center cursor-pointer relative"
                  onClick={() => goToStep(index)}
                >
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium relative
                    ${isCompleted 
                      ? 'bg-green-600 text-white' 
                      : isCurrent
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }
                    ${isCurrent ? 'ring-2 ring-blue-300' : ''}
                    transition-all duration-200
                  `}>
                    {isCompleted ? (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      index + 1
                    )}
                    
                    {/* Red badge exclamation mark for incomplete steps */}
                    {isIncomplete && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">!</span>
                      </div>
                    )}
                  </div>
                  
                  <span className={`
                    mt-2 text-xs text-center max-w-16
                    ${isCompleted 
                      ? 'text-green-600 font-medium' 
                      : isCurrent 
                        ? 'text-blue-600 font-medium' 
                        : 'text-gray-500'
                    }
                  `}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Current Step Content */}
      <div className="min-h-96">
        {getCurrentStepComponent()}
      </div>

      {/* Incomplete Steps Warning (only show on last step) */}
      {currentStep === steps.length - 1 && getIncompleteSteps().length > 0 && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start">
            <svg className="h-5 w-5 text-yellow-400 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-yellow-800">
                Please complete all required fields
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>The following steps have incomplete required fields:</p>
                <ul className="list-disc list-inside mt-1">
                  {getIncompleteSteps().map(stepIndex => (
                    <li key={stepIndex}>
                      <button
                        onClick={() => goToStep(stepIndex)}
                        className="text-yellow-800 underline hover:text-yellow-900"
                      >
                        {steps[stepIndex].title}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

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
              disabled={isLoading || getIncompleteSteps().length > 0}
              className={`
                px-8 py-2 rounded-lg font-medium transition-colors
                ${getIncompleteSteps().length > 0
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
                }
                ${isLoading ? 'opacity-50' : ''}
              `}
            >
              {isLoading ? 'Submitting...' : getIncompleteSteps().length > 0 ? 'Complete Required Fields' : 'Complete Registration'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MultiStepForm;
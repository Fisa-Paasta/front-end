import { createContext, useContext, useState } from 'react';

const SurveyContext = createContext();

export function SurveyProvider({ children }) {

  const defaultFramework = {
    backend: { name: '', version: '' },
    frontend: { name: '', version: '' },
    cicd: { name: '', version: '' },
    etc: ''
  };
  
  const initialFormData = {
    env: '',
    cpu: '',
    ram: '',
    disk: '',
    sec: '',
    k8s: {
      node: '',
      rs: '',
      namespace: ''
    },
    db: {
      db_type: '',
      db_version: '',
      db_size: ''
    },
    framework: defaultFramework
  };

  const [formData, setFormData] = useState(initialFormData);

  const updateFormData = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const [currentStep, setCurrentStep] = useState(0);
  const TOTAL_STEPS = 6;

  const goToNextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, TOTAL_STEPS - 1));
  };

  const goToPrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  return (
    <SurveyContext.Provider value={{
      formData,
      updateFormData,
      currentStep,
      setCurrentStep,
      goToNextStep,
      goToPrevStep
    }}>
      {children}
    </SurveyContext.Provider>
  );
}

export const useSurvey = () => useContext(SurveyContext);

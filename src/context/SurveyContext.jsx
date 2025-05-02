// src/context/SurveyContext.jsx
import { createContext, useContext, useState } from 'react';

const SurveyContext = createContext();

export function SurveyProvider({ children }) {
  const defaultK8s = {
    type: '',
    version: '',
    runtime: '',
    runtimeVersion: '',
    cni: '',
    node: '',
    rs: '',
    namespace: ''
  };
  
  const defaultOS = {
    name: '',
    version: ''
  };
  
  const defaultCICD = {
    tool: '',
    version: ''
  };
  
  const initialFormData = {
    env: '',
    k8s: defaultK8s,
    resources: {
      cpu: '',
      ram: '',
      disk: ''
    },
    os: defaultOS,
    // 다중 항목을 배열로 관리
    frontendItems: [{ id: Date.now(), framework: '', version: '' }],
    backendItems: [{ id: Date.now() + 1, language: '', framework: '', version: '' }],
    webServerItems: [{ id: Date.now() + 2, server: '', version: '' }],
    dbItems: [{ id: Date.now() + 3, type: '', name: '', version: '', size: '' }],
    cicd: defaultCICD
  };

  const [formData, setFormData] = useState(initialFormData);

  const updateFormData = (key, value) => {
    // 기존 값과 새 값이 다를 경우에만 상태 변경
    setFormData(prev => {
      if (prev[key] === value) return prev; // 값이 변경되지 않았다면 상태를 업데이트하지 않음
      return { ...prev, [key]: value };
    });
  };
  
  const [currentStep, setCurrentStep] = useState(0);
  const TOTAL_STEPS = 9;

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
      goToPrevStep,
      TOTAL_STEPS
    }}>
      {children}
    </SurveyContext.Provider>
  );
}

export const useSurvey = () => useContext(SurveyContext);
// src/context/SurveyContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

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
  
  const defaultVM = {
    provider: '',
    type: '',
    count: ''
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
    vm: defaultVM,
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
  const [currentStep, setCurrentStep] = useState(0);
  
  // 환경에 따라 스텝 구성을 달리함
  const [steps, setSteps] = useState([
    { id: 0, title: '환경 선택' }
  ]);
  
  // 환경 선택에 따라 스텝 구성 변경
  useEffect(() => {
    if (formData.env === 'iaas') {
      setSteps([
        { id: 0, title: '환경 선택' },
        { id: 1, title: 'VM' },
        { id: 2, title: '자원 선택' },
        { id: 3, title: 'OS' },
        { id: 4, title: '프론트엔드' },
        { id: 5, title: '백엔드' },
        { id: 6, title: '웹 서버/WAS' },
        { id: 7, title: 'DB' },
        { id: 8, title: 'CI/CD' }
      ]);
    } else if (formData.env === 'paas') {
      setSteps([
        { id: 0, title: '환경 선택' },
        { id: 1, title: 'k8s' },
        { id: 2, title: '자원 선택' },
        { id: 3, title: 'OS' },
        { id: 4, title: '프론트엔드' },
        { id: 5, title: '백엔드' },
        { id: 6, title: '웹 서버/WAS' },
        { id: 7, title: 'DB' },
        { id: 8, title: 'CI/CD' }
      ]);
    } else {
      // 환경 선택 전 또는 기타 환경
      setSteps([{ id: 0, title: '환경 선택' }]);
    }
  }, [formData.env]);

  const updateFormData = (key, value) => {
    // 기존 값과 새 값이 다를 경우에만 상태 변경
    setFormData(prev => {
      if (prev[key] === value) return prev; // 값이 변경되지 않았다면 상태를 업데이트하지 않음
      return { ...prev, [key]: value };
    });
  };
  
  const goToNextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
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
      steps
    }}>
      {children}
    </SurveyContext.Provider>
  );
}

export const useSurvey = () => useContext(SurveyContext);
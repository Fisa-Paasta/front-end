import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  SurveyContextType,
  FormDataType,
  K8sConfig,
  VMConfig,
  OSConfig,
  CICDConfig
} from '@/types/survey';

const SurveyContext = createContext<SurveyContextType | undefined>(undefined);

export function SurveyProvider({ children }: { children: ReactNode }) {
  // ✅ 타입 명시된 기본값들
  const defaultK8s: K8sConfig = {
    type: '', version: '', runtime: '', runtimeVersion: '',
    cni: '', node: '', rs: '', namespace: ''
  };

  const defaultVM: VMConfig = {
    provider: '', type: '', count: ''
  };

  const defaultOS: OSConfig = {
    name: '', version: ''
  };

  const defaultCICD: CICDConfig = {
    tool: '', version: ''
  };

  const initialFormData: FormDataType = {
    env: '', // 타입 상 EnvType | '' 이기 때문에 '' 유지 가능
    k8s: defaultK8s,
    vm: defaultVM,
    resources: { cpu: '', ram: '', disk: '' },
    os: defaultOS,
    frontendItems: [{ id: Date.now(), framework: '', version: '' }],
    backendItems: [{
      id: Date.now() + 1,
      language: '', languageVersion: '',
      framework: '', frameworkVersion: ''
    }],
    webServerItems: [{ id: Date.now() + 2, server: '', version: '' }],
    dbItems: [{ id: Date.now() + 3, type: '', name: '', version: '', size: '' }],
    cicd: defaultCICD
  };

  const [formData, setFormData] = useState<FormDataType>(initialFormData);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [steps, setSteps] = useState<{ id: number; title: string }[]>([{ id: 0, title: '환경 선택' }]);

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
      setSteps([{ id: 0, title: '환경 선택' }]);
    }
  }, [formData.env]);

  // ✅ 타입 안전한 updateFormData
  const updateFormData = <K extends keyof FormDataType>(key: K, value: FormDataType[K]) => {
    setFormData(prev => {
      if (prev[key] === value) return prev;
      return { ...prev, [key]: value };
    });
  };

  const goToNextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  const goToPrevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));
  const TOTAL_STEPS = steps.length;

  return (
    <SurveyContext.Provider value={{
      formData,
      updateFormData,
      currentStep,
      setCurrentStep,
      goToNextStep,
      goToPrevStep,
      steps,
      TOTAL_STEPS
    }}>
      {children}
    </SurveyContext.Provider>
  );
}

export const useSurvey = (): SurveyContextType => {
  const context = useContext(SurveyContext);
  if (!context) throw new Error('useSurvey must be used within a SurveyProvider');
  return context;
};

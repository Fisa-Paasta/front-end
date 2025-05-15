// src/types/survey.ts

export interface EnvConfig {
  env: string;
}

export interface K8sConfig {
  type: string;
  version: string;
  node: string;
}

export interface ResourceConfig {
  cpu: string;
  ram: string;
  disk: string;
}

export interface OSConfig {
  name: string;
  version: string;
}

export interface FrontendItem {
  id: number;
  framework: string;
  version: string;
}

export interface BackendItem {
  id: number;
  language: string;
  languageVersion: string;
  framework: string;
  frameworkVersion: string;
}

export interface WebServerItem {
  id: number;
  server: string;
  version: string;
}

export interface DBItem {
  id: number;
  type: string;
  name: string;
  version: string;
  size: string;
}

export interface CICDConfig {
  tool: string;
  version: string;
}

export interface FormDataType {
  env?: string;
  k8s?: K8sConfig;
  vm?: any;
  resources?: ResourceConfig;
  os?: OSConfig;
  frontendItems?: FrontendItem[];
  backendItems?: BackendItem[];
  webServerItems?: WebServerItem[];
  dbItems?: DBItem[];
  cicd?: CICDConfig;
}

export interface SurveyContextType {
  currentStep: number;
  goToNextStep: () => void;
  goToPrevStep: () => void;
  formData: FormDataType;
  setCurrentStep: (step: number) => void;
  updateFormData: (key: keyof FormDataType, value: any) => void;
  steps: { id: number; title: string }[];
  TOTAL_STEPS: number;
}

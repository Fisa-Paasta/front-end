// src/types/survey.ts

// ───── 1. Step1 - Env ─────
export type EnvType = 'iaas' | 'paas' | '';
export interface EnvConfig {
  env: EnvType;
}

// ───── 2. Step2 - VM ─────
export type VMProvider = 'aws_ec2' | 'azure_vm' | 'gcp_compute' | 'vmware' | '';
export interface VMConfig {
  provider: VMProvider | '';
  type: string;
  count: string;
}

// ───── 3. Step3 - K8s ─────
export interface K8sConfig {
  type: 'kubernetes' | 'amazon_eks' | 'google_gke' | 'azure_aks' | '';
  version: string;
  runtime: 'docker' | 'containerd' | '';
  runtimeVersion: string;
  cni: 'Calico' | 'Flannel' | 'Cilium' | '';
  node: string;
  rs: string;
  namespace: string;
}

// ───── 4. Step4 - Resources ─────
export interface ResourceConfig {
  cpu: string;
  ram: string;
  disk: string;
}

// ───── 5. Step5 - OS ─────
export type OSName = 'ubuntu' | 'rhel' | 'suse' | 'debian' | 'amazon_linux' | '';
export interface OSConfig {
  name: OSName | '';
  version: string;
}

// ───── 6. Step6 - Frontend ─────
export type FrontendFramework = 'react' | 'vue' | 'angular' | 'nextjs' | '';
export interface FrontendItem {
  id: number;
  framework: FrontendFramework | '';
  version: string;
}

// ───── 7. Step7 - Backend ─────
export type BackendLanguage = 'java' | 'nodejs' | 'python' | 'go' | 'ruby' | '';
export type BackendFramework =
  | 'spring_boot'
  | 'express'
  | 'nestjs'
  | 'django'
  | 'flask'
  | 'fiber'
  | 'rails'
  | 'gin'
  | 'echo';

export interface BackendItem {
  id: number;
  language: BackendLanguage | '';
  languageVersion: string;
  framework: BackendFramework | '';
  frameworkVersion: string;
}

// ───── 8. Step8 - WebServer ─────
export type WebServerType = 'nginx' | 'apache' | 'tomcat' | '';
export interface WebServerItem {
  id: number;
  server: WebServerType | '';
  version: string;
}

// ───── 9. Step9 - DB ─────
export type DBType = 'relational' | 'nosql' | '';
export type DBName =
  | 'mysql' | 'postgresql' | 'mariadb' | 'oracle'
  | 'mongodb' | 'redis' | 'elasticsearch' | 'cassandra';

export interface DBItem {
  id: number;
  type: DBType | '';
  name: DBName | '';
  version: string;
  size: string;
}

// ───── 10. Step10 - CICD ─────
export type CICDTool = 'jenkins' | 'argocd' | '';
export interface CICDConfig {
  tool: CICDTool | '';
  version: string;
}

// ───── 전체 Form 상태 ─────
export interface FormDataType {
  env?: EnvType;
  vm?: VMConfig;
  k8s?: K8sConfig;
  resources?: ResourceConfig;
  os?: OSConfig;
  frontendItems?: FrontendItem[];
  backendItems?: BackendItem[];
  webServerItems?: WebServerItem[];
  dbItems?: DBItem[];
  cicd?: CICDConfig;
}

// ───── Context 타입 ─────
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

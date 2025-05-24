// ───── 1. 공통 타입 ─────
export type EnvType = 'iaas' | 'paas' | '';

export interface ResourcesConfig {
  cpu: string;
  ram: string;
  disk: string;
}

export interface OSConfig {
  name: string;
  version: string;
}

export type CICDTool = 'jenkins' | 'argocd' | '';
export interface CICDConfig {
  tool: CICDTool;
  version: string;
}

// ───── 2. Step2 - VM (IaaS에서만 사용) ─────
export interface VMConfig {
  hostname: string;
  username: string;
  password: string;
  environment: 'on-premise' | 'aws';
  ec2Type: string;
  ebsType: string;
}

// ───── 2. Step2 - K8s (PaaS에서만 사용) ─────
export type OrchestrationType = 'kubernetes' | 'amazon_eks' | 'google_gke' | 'azure_aks' | '';
export interface K8sConfig {
  type: OrchestrationType;
  version: string;
  node: string;         // Worker Node 수
  namespace: string;    // Namespace Prefix
}

// ───── 3. Step5 - Frontend ─────
export interface FrontendItem {
  id: number;
  framework: string;
  version: string;
}

// ───── 4. Step6 - Backend ─────
export type BackendLanguage = 'java' | 'nodejs' | 'python' | 'go' | 'ruby' | '';
export type BackendFramework =
  | 'spring_boot' | 'express' | 'nestjs' | 'django' | 'flask'
  | 'fiber' | 'rails' | 'gin' | 'echo' | '';

export interface BackendItem {
  id: number;
  language: BackendLanguage;
  languageVersion: string;
  framework: BackendFramework;
  frameworkVersion: string;
}

// ───── 5. Step7 - Web Server ─────
export type WebServerType = 'nginx' | 'apache' | 'tomcat' | '';
export interface WebServerItem {
  id: number;
  server: WebServerType;
  version: string;
}

// ───── 6. Step8 - DB ─────
export type DBType = 'relational' | 'nosql' | '';
export type DBName =
  | 'mysql' | 'postgresql' | 'mariadb' | 'oracle'
  | 'mongodb' | 'redis' | 'elasticsearch' | 'cassandra';

export interface DBItem {
  id: number;
  type: DBType;
  name: DBName | '';
  version: string;
  size: string;
}

// ───── 7. Form 전체 ─────
export interface FormDataType {
  env: EnvType;
  vm: VMConfig;
  k8s: K8sConfig;
  resources: ResourcesConfig;
  os: OSConfig;
  frontendItems: FrontendItem[];
  frontendDomain: string;
  backendItems: BackendItem[];
  apiDomain: string;
  apiPaths: string[];
  webServerItems: WebServerItem[];
  dbItems: DBItem[];
  cicd: CICDConfig;
}

// ───── 8. Survey Context ─────
export interface SurveyContextType {
  formData: FormDataType;
  updateFormData: <K extends keyof FormDataType>(key: K, value: FormDataType[K]) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  goToNextStep: () => void;
  goToPrevStep: () => void;
  steps: { id: number; title: string }[];
  TOTAL_STEPS: number;
}

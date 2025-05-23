import { useSurvey } from '@/context/SurveyContext';
import Step1_Env from './FormStep/Step1_Env';
import Step2_K8s from './FormStep/Step2_K8s';
import Step2_VM from './FormStep/Step2_VM';
import Step3_Resources from './FormStep/Step3_Resources';
import Step4_OS from './FormStep/Step4_OS';
import Step5_Frontend from './FormStep/Step5_Frontend';
import Step6_Backend from './FormStep/Step6_Backend';
import Step7_WebServer from './FormStep/Step7_WebServer';
import Step8_DB from './FormStep/Step8_DB';
import Step9_CICD from './FormStep/Step9_CICD';

export default function FormStep() {
  const { currentStep, formData, goToNextStep, goToPrevStep } = useSurvey();

  const isCurrentStepValid = () => {
    switch (currentStep) {
      case 0:
        return !!formData.env;

      case 1:
        if (formData.env === 'iaas') {
          return !!formData.vm?.hostname && !!formData.vm?.username && !!formData.vm?.password;
        } else {
          if (!formData.k8s?.type || !formData.k8s?.node) return false;
          const nodeNum = parseInt(formData.k8s.node, 10);
          const ns = formData.k8s.namespace || '';
          const nsValid = ns === '' || /^[a-zA-Z][-a-zA-Z0-9]*$/.test(ns);
          return !isNaN(nodeNum) && nodeNum > 0 && nsValid;
        }

      case 2:
        if (!formData.resources) return false;
        const cpu = parseInt(formData.resources.cpu, 10);
        const ram = parseInt(formData.resources.ram, 10);
        const disk = parseInt(formData.resources.disk, 10);
        return [cpu, ram, disk].every((v) => !isNaN(v) && v > 0);

      case 3:
        return !!formData.os?.name && !!formData.os?.version;

      case 4:
        if (!formData.frontendItems || formData.frontendItems.length === 0) return false;
        const frontendValid = formData.frontendItems.some((item: { framework: string; version: string }) => {
          return !!item.framework && !!item.version;
        });
        return frontendValid;

      case 5:
        if (!formData.backendItems || formData.backendItems.length === 0) return false;
        const backendValid = formData.backendItems.some((item: {
          language: string;
          languageVersion: string;
          framework: string;
          frameworkVersion: string;
        }) => {
          return (
            !!item.language &&
            !!item.languageVersion &&
            !!item.framework &&
            !!item.frameworkVersion
          );
        });

        if (formData.env === 'paas') {
          if (!formData.apiDomain || !/^[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(formData.apiDomain)) return false;
          if (!formData.apiPaths || formData.apiPaths.length === 0) return false;
          const pathsValid = formData.apiPaths.every((path: string) =>
            /^\/[a-zA-Z0-9/_-]*$/.test(path.trim())
          );
          return backendValid && pathsValid;
        }

        return backendValid;

      case 6:
        if (!formData.webServerItems || formData.webServerItems.length === 0) return false;
        return formData.webServerItems.some((item: { server: string; version: string }) => {
          return !!item.server && !!item.version;
        });

      case 7:
        if (!formData.dbItems || formData.dbItems.length === 0) return false;
        return formData.dbItems.some((item: {
          type: string;
          name: string;
          version: string;
          size: string;
        }) => {
          if (!item.type || !item.name || !item.version) return false;
          const size = parseInt(item.size, 10);
          return !isNaN(size) && size > 0;
        });

      case 8:
        return !!formData.cicd?.tool && !!formData.cicd?.version;

      default:
        return true;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <Step1_Env />;
      case 1:
        return formData.env === 'iaas' ? <Step2_VM /> : <Step2_K8s />;
      case 2:
        return <Step3_Resources />;
      case 3:
        return <Step4_OS />;
      case 4:
        return <Step5_Frontend />;
      case 5:
        return <Step6_Backend />;
      case 6:
        return <Step7_WebServer />;
      case 7:
        return <Step8_DB />;
      case 8:
        return <Step9_CICD />;
      default:
        return null;
    }
  };

  return (
    <div>
      {renderStep()}

      <div className="flex justify-between mt-6">
        <button
          onClick={goToPrevStep}
          disabled={currentStep === 0}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md"
        >
          ← 이전
        </button>

        {currentStep < 8 && (
          <button
            onClick={goToNextStep}
            disabled={!isCurrentStepValid()}
            className={`px-4 py-2 rounded-md ${isCurrentStepValid() ? 'bg-purple-600 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
          >
            다음 →
          </button>
        )}
      </div>
    </div>
  );
}

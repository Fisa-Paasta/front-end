// src/components/FormStep.jsx
import { useSurvey } from '@/context/SurveyContext';
import { useState } from 'react';
import Step1_Env from './FormStep/Step1_Env';
import Step2_K8s from './FormStep/Step2_K8s';
import Step3_Resources from './FormStep/Step3_Resources';
import Step4_OS from './FormStep/Step4_OS';
import Step5_Frontend from './FormStep/Step5_Frontend';
import Step6_Backend from './FormStep/Step6_Backend';
import Step7_WebServer from './FormStep/Step7_WebServer';
import Step8_DB from './FormStep/Step8_DB';
import Step9_CICD from './FormStep/Step9_CICD';
import ConfirmModal from './ConfirmModal';

const steps = [
  Step1_Env,
  Step2_K8s,
  Step3_Resources,
  Step4_OS,
  Step5_Frontend,
  Step6_Backend,
  Step7_WebServer,
  Step8_DB,
  Step9_CICD
];

export default function FormStep() {
  const {
    currentStep,
    goToNextStep,
    goToPrevStep,
    formData,
    TOTAL_STEPS
  } = useSurvey();

  const [showModal, setShowModal] = useState(false);
  const StepComponent = steps[currentStep];

  const handleNext = () => {
    if (isCurrentStepValid()) {
      if (currentStep === TOTAL_STEPS - 1) {
        setShowModal(true);
      } else {
        goToNextStep();
      }
    }
  };

  const isCurrentStepValid = () => {
    switch (currentStep) {
      case 0:
        return !!formData.env;
      case 1:
        return (
          !!formData.k8s?.type &&
          !!formData.k8s?.version &&
          !!formData.k8s?.node
        );
      case 2:
        return (
          !!formData.resources?.cpu &&
          !!formData.resources?.ram &&
          !!formData.resources?.disk
        );
      case 3:
        return (
          !!formData.os?.name &&
          !!formData.os?.version
        );
      case 4:
        return formData.frontendItems && formData.frontendItems.some(item =>
          !!item.framework && !!item.version
        );
      case 5:
        return formData.backendItems && formData.backendItems.some(item =>
          !!item.language && !!item.languageVersion && !!item.framework && !!item.frameworkVersion
        );
      case 6:
        return formData.webServerItems && formData.webServerItems.some(item =>
          !!item.server && !!item.version
        );
      case 7:
        return formData.dbItems && formData.dbItems.some(item =>
          !!item.type && !!item.name && !!item.version && item.size !== ''
        );
      case 8:
        return !!formData.cicd?.tool && !!formData.cicd?.version;
      default:
        return true;
    }
  };

  const isAllStepsValid = () => {
    return (
      !!formData.env &&
      !!formData.k8s?.type && 
      !!formData.resources?.cpu &&
      !!formData.os?.name &&
      formData.frontendItems?.some(item => !!item.framework && !!item.version) &&
      formData.backendItems?.some(item => !!item.language && !!item.languageVersion) &&
      formData.webServerItems?.some(item => !!item.server && !!item.version) &&
      formData.dbItems?.some(item => !!item.type && !!item.name && !!item.version && item.size !== '') &&
      !!formData.cicd?.tool && !!formData.cicd?.version
    );
  };

  return (
    <div>
      <StepComponent />

      <div className="flex justify-between items-center mt-8 px-4">
        <button 
          className={`
            px-6 py-2.5 rounded-lg font-medium transition-all duration-200
            ${currentStep === 0 
              ? 'opacity-0 cursor-default' 
              : 'bg-white dark:bg-panel-dark text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-opacity-80 shadow-sm border border-border-light dark:border-border-dark'
            }
          `}
          onClick={goToPrevStep}
          disabled={currentStep === 0}
        >
          ← 이전
        </button>
        <button
          className={`
            px-6 py-2.5 rounded-lg font-medium transition-all duration-200
            ${!isCurrentStepValid()
              ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
              : 'bg-primary hover:bg-primary-hover text-white shadow-sm'
            }
          `}
          onClick={handleNext}
          disabled={!isCurrentStepValid()}
        >
          {currentStep === TOTAL_STEPS - 1 ? '확인 ✓' : '다음 →'}
        </button>
      </div>

      {showModal && (
        <ConfirmModal 
          onClose={() => setShowModal(false)} 
          onSubmit={() => {
            alert('제출이 완료되었습니다!');
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}

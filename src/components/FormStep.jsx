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
    // 유효성 검사 통과 시에만 다음 단계로 이동
    if (isCurrentStepValid()) {
      if (currentStep === TOTAL_STEPS - 1) {
        setShowModal(true);
      } else {
        goToNextStep();
      }
    }
  };

  // 유효성 검사 로직 업데이트
  const isCurrentStepValid = () => {
    switch (currentStep) {
      case 0: // Environment
        return !!formData.env;
      case 1: // K8s
        return (
          !!formData.k8s?.type &&
          !!formData.k8s?.version &&
          !!formData.k8s?.node
        );
      case 2: // Resources
        return (
          !!formData.resources?.cpu &&
          !!formData.resources?.ram &&
          !!formData.resources?.disk
        );
      case 3: // OS
        return (
          !!formData.os?.name &&
          !!formData.os?.version
        );
      case 4: // Frontend
        return formData.frontendItems && formData.frontendItems.some(item =>
          !!item.framework && !!item.version
        );
      case 5: // Backend
        // Updated for new backend structure with language version
        return formData.backendItems && formData.backendItems.some(item =>
          !!item.language && !!item.languageVersion && !!item.framework && !!item.frameworkVersion
        );
      case 6: // Web Server
        return formData.webServerItems && formData.webServerItems.some(item =>
          !!item.server && !!item.version
        );
      case 7: // DB
        return formData.dbItems && formData.dbItems.some(item =>
          !!item.type && !!item.name && !!item.version && item.size !== ''
        );
      
      case 8: // CI/CD
        return !!formData.cicd?.tool && !!formData.cicd?.version;
      default:
        return true; // 기본적으로 진행 허용
    }
  };
  
  // 확인 버튼 활성화 여부 업데이트
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

      <div className="nav-buttons">
        <button 
          className="prev-button"
          onClick={goToPrevStep} 
          disabled={currentStep === 0}
          style={{visibility: currentStep === 0 ? 'hidden' : 'visible'}}
        >
          이전
        </button>
        <button
          className="next-button"
          onClick={handleNext}
          disabled={!isCurrentStepValid()}
        >
          {currentStep === TOTAL_STEPS - 1 ? '확인' : '다음'}
        </button>
      </div>

      {showModal && (
        <ConfirmModal 
          onClose={() => setShowModal(false)} 
          onSubmit={() => {
            alert('제출이 완료되었습니다!');
            setShowModal(false);
            // 폼 초기화 또는 다른 작업을 추가할 수 있습니다
          }}
        />
      )}
    </div>
  );
}
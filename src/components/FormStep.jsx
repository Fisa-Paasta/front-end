import { useSurvey } from '@/context/SurveyContext';
import { useState } from 'react';
import Step1 from './FormStep/Step1_Env';
import Step2 from './FormStep/Step2_Resource';
import Step3 from './FormStep/Step3_Security';
import Step4 from './FormStep/Step4_K8s';
import Step5 from './FormStep/Step5_DB';
import Step6 from './FormStep/Step6_Framework';
import ConfirmModal from './ConfirmModal';

const steps = [Step1, Step2, Step3, Step4, Step5, Step6];

export default function FormStep() {
  const {
    currentStep,
    goToNextStep,
    goToPrevStep,
    formData
  } = useSurvey();

  const [showModal, setShowModal] = useState(false);
  const StepComponent = steps[currentStep];

  const handleNext = () => {
    if (currentStep === steps.length - 1) {
      setShowModal(true);
    } else {
      goToNextStep();
    }
  };

  const isCurrentStepValid = () => {
    switch (currentStep) {
      case 0:
        return !!formData.env;
      case 1:
        return !!formData.cpu && !!formData.ram && !!formData.disk;
      case 2:
        return !!formData.sec;
      case 3:
        return !!formData.k8s?.node && !!formData.k8s?.rs && !!formData.k8s?.namespace;
      case 4:
        return !!formData.db?.db_type && !!formData.db?.db_version && !!formData.db?.db_size;
      case 5:
        return (
          !!formData.framework?.backend?.name &&
          !!formData.framework?.backend?.version &&
          !!formData.framework?.frontend?.name &&
          !!formData.framework?.frontend?.version &&
          !!formData.framework?.cicd?.name &&
          !!formData.framework?.cicd?.version
        );
      default:
        return false;
    }
  };

  const isAllStepsValid = () => {
    return (
      !!formData.env &&
      !!formData.cpu && !!formData.ram && !!formData.disk &&
      !!formData.sec &&
      !!formData.k8s?.node && !!formData.k8s?.rs && !!formData.k8s?.namespace &&
      !!formData.db?.db_type && !!formData.db?.db_version && !!formData.db?.db_size &&
      !!formData.framework?.backend?.name && !!formData.framework?.backend?.version &&
      !!formData.framework?.frontend?.name && !!formData.framework?.frontend?.version &&
      !!formData.framework?.cicd?.name && !!formData.framework?.cicd?.version
    );
  };

  return (
    <div>
      <StepComponent />

      <div className="formbold-form-btn-wrapper">
        <button onClick={goToPrevStep} disabled={currentStep === 0}>
          이전
        </button>
        <button
          onClick={handleNext}
          disabled={currentStep === steps.length - 1 ? !isAllStepsValid() : !isCurrentStepValid()}
          className={currentStep === steps.length - 1 ? 'confirm-button' : ''}
        >
          {currentStep === steps.length - 1 ? '확인' : '다음'}
        </button>
      </div>

      {showModal && (
        <ConfirmModal formData={formData} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}

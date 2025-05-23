import { useSurvey } from '@/context/SurveyContext';
import { useState } from 'react';
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
import ConfirmModal from './ConfirmModal';
import InformationModal from './InformationModal';
import { useSubmitted } from '@/context/SubmittedContext';
import { SurveyContextType } from '@/types/survey';

export default function FormStep() {
  const {
    currentStep,
    goToNextStep,
    goToPrevStep,
    formData,
    TOTAL_STEPS
  }: SurveyContextType = useSurvey();

  const { addSubmittedCard } = useSubmitted();

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

  const stepsByEnv = {
    iaas: [Step1_Env, Step2_VM, Step3_Resources, Step4_OS, Step5_Frontend, Step6_Backend, Step7_WebServer, Step8_DB, Step9_CICD],
    paas: [Step1_Env, Step2_K8s, Step3_Resources, Step4_OS, Step5_Frontend, Step6_Backend, Step7_WebServer, Step8_DB, Step9_CICD]
  };

  const StepComponent = formData.env === 'iaas'
    ? stepsByEnv.iaas[currentStep]
    : stepsByEnv.paas[currentStep] || Step1_Env;

  const handleNext = () => {
    if (!isCurrentStepValid()) return;
    if (currentStep === TOTAL_STEPS - 1) {
      setShowInfoModal(true); // 최종 단계면 정보 모달 먼저 띄움
    } else {
      goToNextStep();
    }
  };

  const handleConfirmSubmit = ({ title, description }: { title: string; description: string }) => {
    const newCard = {
      title,
      desc: description?.trim() || '—',
      date: new Date().toISOString().split('T')[0],
      starred: false,
      status: '접수중' as const,
      historyList: []
    };

    addSubmittedCard(newCard);
    setShowConfirmModal(false);
  };

  const isCurrentStepValid = (): boolean => {
    switch (currentStep) {
      case 0:
        return !!formData.env;

      case 1:
        if (formData.env === 'iaas') {
          return !!formData.vm.hostname && !!formData.vm.username && !!formData.vm.password;
        } else {
          const typeValid = !!formData.k8s?.type;
          const nodeValid = !isNaN(parseInt(formData.k8s?.node, 10)) && parseInt(formData.k8s?.node, 10) > 0;
          const namespaceValid = !formData.k8s?.namespace || /^[a-zA-Z][-a-zA-Z0-9]*$/.test(formData.k8s.namespace);
          return typeValid && nodeValid && namespaceValid;
        }

      case 2:
        const cpu = parseInt(formData.resources.cpu, 10);
        const ram = parseInt(formData.resources.ram, 10);
        const disk = parseInt(formData.resources.disk, 10);
        return !isNaN(cpu) && cpu > 0 && !isNaN(ram) && ram > 0 && !isNaN(disk) && disk > 0;

      case 3:
        return !!formData.os?.name && !!formData.os?.version;

      case 4:
        return formData.frontendItems?.some(item =>
          !!item.framework && !!item.version
        );

      case 5:
        const backendValid = formData.backendItems?.some(item =>
          !!item.language && !!item.languageVersion && !!item.framework && !!item.frameworkVersion
        );
        if (formData.env === 'paas') {
          const domainValid = !!formData.apiDomain && /^[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(formData.apiDomain);
          const pathsValid = formData.apiPaths?.length > 0 &&
            formData.apiPaths.every((path) => /^\/[a-zA-Z0-9/_-]+$/.test(path.trim()));
          return backendValid && domainValid && pathsValid;
        }
        return backendValid;

      case 6:
        return true; // 웹서버는 선택 안 해도 통과

      case 7:
        return formData.dbItems?.some(item => {
          const size = parseInt(item.size, 10);
          return !!item.type && !!item.name && !!item.version && !isNaN(size) && size > 0;
        });

      case 8:
        return !!formData.cicd?.tool && !!formData.cicd?.version;

      default:
        return true;
    }
  };

  return (
    <>
      <StepComponent />

      <div className="flex justify-between items-center mt-8 px-4">
        <button
          onClick={goToPrevStep}
          disabled={currentStep === 0}
          className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 ${currentStep === 0
              ? 'opacity-0 cursor-default'
              : 'bg-white dark:bg-panel-dark text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-opacity-80 shadow-sm border border-border-light dark:border-border-dark'
            }`}
        >
          ← 이전
        </button>

        <button
          onClick={handleNext}
          disabled={!isCurrentStepValid()}
          className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 ${!isCurrentStepValid()
              ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
              : 'bg-primary hover:bg-primary-hover text-white shadow-sm'
            }`}
        >
          {currentStep === TOTAL_STEPS - 1 ? '확인 ✓' : '다음 →'}
        </button>
      </div>

      {showInfoModal && (
        <InformationModal
          onClose={() => setShowInfoModal(false)}
          onSubmit={() => {
            setShowInfoModal(false);
            setShowConfirmModal(true);
          }}
        />
      )}

      {showConfirmModal && (
        <ConfirmModal
          onBack={() => {
            setShowConfirmModal(false);
            setShowInfoModal(true); // "이전" 버튼 누르면 정보 모달로 되돌아감
          }}
          onClose={() => setShowConfirmModal(false)} // X 버튼 등 닫기용
          onSubmit={handleConfirmSubmit}
        />
      )}
    </>
  );
}

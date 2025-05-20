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
import { useSubmitted } from '@/context/SubmittedContext';
import { SurveyContextType } from '@/types/survey';

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
  }: SurveyContextType = useSurvey();

  const { addSubmittedCard } = useSubmitted();
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
    setShowModal(false);
  };

  const isCurrentStepValid = () => {
    switch (currentStep) {
      case 0:
        return !!formData.env;
        
      case 1: // K8s 단계
        if (!formData.k8s?.type || !formData.k8s?.version) {
          return false;
        }
        
        // 노드 수, 레플리카 수 검사 - 양수여야 함
        const nodeCount = parseInt(formData.k8s.node, 10);
        const rsCount = parseInt(formData.k8s.rs, 10);
        
        if (isNaN(nodeCount) || nodeCount <= 0 || isNaN(rsCount) || rsCount <= 0) {
          return false;
        }
        
        // 네임스페이스 검사 - 영문자와 하이픈만 허용
        if (formData.k8s.namespace && !/^[a-zA-Z][-a-zA-Z0-9]*$/.test(formData.k8s.namespace)) {
          return false;
        }
        
        return true;
        
      case 2: // 자원 검사
        if (!formData.resources) return false;
        
        const cpu = parseInt(formData.resources.cpu, 10);
        const ram = parseInt(formData.resources.ram, 10);
        const disk = parseInt(formData.resources.disk, 10);
        
        return !isNaN(cpu) && cpu > 0 && 
               !isNaN(ram) && ram > 0 && 
               !isNaN(disk) && disk > 0;
               
      case 3:
        return !!formData.os?.name && !!formData.os?.version;
        
      case 4:
        return (
          formData.frontendItems &&
          formData.frontendItems.some((item: { framework: string; version: string }) => 
            !!item.framework && !!item.version
          )
        );
        
      case 5:
        return (
          formData.backendItems &&
          formData.backendItems.some(item =>
            !!item.language &&
            !!item.languageVersion &&
            !!item.framework &&
            !!item.frameworkVersion
          )
        );
        
      case 6:
        return (
          formData.webServerItems &&
          formData.webServerItems.some((item: { server: string; version: string }) => 
            !!item.server && !!item.version
          )
        );
        
      case 7: // DB 검사
        if (!formData.dbItems || !formData.dbItems.length) return false;
        
        return formData.dbItems.some((item: { 
          type: string; 
          name: string; 
          version: string; 
          size: string 
        }) => {
          if (!item.type || !item.name || !item.version) return false;
          
          // size 값 검사
          const size = parseInt(item.size, 10);
          return !isNaN(size) && size > 0;
        });
        
      case 8:
        return !!formData.cicd?.tool && !!formData.cicd?.version;
        
      default:
        return true;
    }
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
          onSubmit={handleConfirmSubmit}
        />
      )}
    </div>
  );
}
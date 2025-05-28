import { useSurvey } from '@/context/SurveyContext';
import { useState } from 'react';
import Step1_Env from './FormStep/Step1_Env';
import Step2_K8s from './FormStep/Step2_K8s';
import Step2_VM from './FormStep/Step2_VM';
import Step3_Resources from './FormStep/Step3_Resources';
import Step3_VMResources from './FormStep/Step3_VMResources';
import Step4_OS from './FormStep/Step4_OS';
import Step5_Frontend from './FormStep/Step5_Frontend';
import Step6_Backend from './FormStep/Step6_Backend';
import Step7_WebServer from './FormStep/Step7_WebServer';
import Step8_DB from './FormStep/Step8_DB';
import ConfirmModal from './ConfirmModal';
import InformationModal from './InformationModal';
import { useSubmitted } from '@/context/SubmittedContext';
import { SurveyContextType } from '@/types/survey';
import { useNavigate } from 'react-router-dom';

export default function FormStep() {
  const {
    currentStep,
    goToNextStep,
    goToPrevStep,
    formData,
    TOTAL_STEPS
  }: SurveyContextType = useSurvey();

  const { addSubmittedCard } = useSubmitted();
  const navigate = useNavigate();

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // ✅ 로딩 상태

  const stepsByEnv = {
    iaas: [Step1_Env, Step2_VM, Step3_VMResources, Step4_OS, Step5_Frontend, Step6_Backend, Step7_WebServer, Step8_DB],
    paas: [Step1_Env, Step2_K8s, Step3_Resources, Step4_OS, Step5_Frontend, Step6_Backend, Step7_WebServer, Step8_DB]
  };

  const StepComponent = formData.env === 'iaas'
    ? stepsByEnv.iaas[currentStep]
    : stepsByEnv.paas[currentStep] || Step1_Env;

  const handleNext = () => {
    if (!isCurrentStepValid()) return;
    if (currentStep === TOTAL_STEPS - 1) {
      setShowInfoModal(true);
    } else {
      goToNextStep();
    }
  };

  // ✅ 중복 제거: Context만 사용
  const handleConfirmSubmit = async ({ title, description }: { title: string; description: string }) => {
    if (isSubmitting) return; // 중복 제출 방지
    
    setIsSubmitting(true);
    
    try {
      const userId = localStorage.getItem('userId')!;
      const newCard = {
        title,
        desc: description?.trim() || '—',
        date: new Date().toISOString().split('T')[0],
        starred: false,
        status: '접수중' as const,
        historyList: [],
        formDataSnapshot: { ...formData, userId },
      };

      // ✅ Context의 addSubmittedCard만 호출 (서버 저장 포함)
      await addSubmittedCard(newCard);
      
      alert('✅ 신청서가 성공적으로 제출되었습니다!');
      setShowConfirmModal(false);
      navigate('/home');
      
    } catch (err) {
      console.error('❌ 신청서 제출 실패:', err);
      alert('❌ 신청서 제출 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isCurrentStepValid = (): boolean => {
    switch (currentStep) {
      case 0:
        return !!formData.env;

      case 1:
        if (formData.env === 'iaas') {
          const hostnameValid = /^[a-zA-Z][-a-zA-Z0-9]*$/.test(formData.vm.hostname || '');
          const usernameValid = /^[a-zA-Z][-a-zA-Z0-9]*$/.test(formData.vm.username || '');
          return hostnameValid && usernameValid;
        }

        if (formData.env === 'paas') {
          const typeValid = !!formData.k8s?.type;
          const namespace = formData.k8s?.namespace;
          const namespaceValid = !!namespace && /^[a-zA-Z][-a-zA-Z0-9]*$/.test(namespace);
          return typeValid && namespaceValid;
        }

        return false;

      case 2:
        if (formData.env === 'iaas') {
          if (formData.vm.environment === 'on-premise') {
            const cpu = parseInt(formData.resources.cpu, 10);
            const ram = parseInt(formData.resources.ram, 10);
            const disk = parseInt(formData.resources.disk, 10);
            return !isNaN(cpu) && cpu > 0 && !isNaN(ram) && ram > 0 && !isNaN(disk) && disk > 0;
          } else {
            const ebsSize = parseInt(formData.vm.ebsSize || '', 10);
            return (
              !!formData.vm.ec2Type &&
              !!formData.vm.ebsType &&
              !isNaN(ebsSize) && ebsSize > 0
            );
          }
        }

        if (formData.env === 'paas') {
          const node = parseInt(formData.k8s?.node ?? '', 10);

          if (formData.k8s?.type === 'amazon_eks') {
            const ebsSize = parseInt(formData.vm.ebsSize || '', 10);
            return (
              !isNaN(node) && node > 0 &&
              !!formData.vm.ec2Type &&
              !!formData.vm.ebsType &&
              !isNaN(ebsSize) && ebsSize > 0
            );
          }

          const cpu = parseInt(formData.resources.cpu, 10);
          const ram = parseInt(formData.resources.ram, 10);
          const disk = parseInt(formData.resources.disk, 10);

          return (
            !isNaN(node) && node > 0 &&
            !isNaN(cpu) && cpu > 0 &&
            !isNaN(ram) && ram > 0 &&
            !isNaN(disk) && disk > 0
          );
        }

        return false;

      case 3:
        return !!formData.os?.name && !!formData.os?.version;

      case 4:
        return formData.frontendItems?.every(item => {
          const fw = item.framework?.trim();
          const version = item.version?.trim();
          if (!fw) return true;
          return !!version;
        });

      case 5: {
        const backendValid = formData.backendItems?.every(item => {
          const langOk = !item.language || (item.language && item.languageVersion);
          const fwOk = !item.framework || (item.framework && item.frameworkVersion);
          return langOk && fwOk;
        });

        if (formData.env === 'paas') {
          const hasFramework = formData.backendItems?.some(item => !!item.framework);
          const domainValid = !hasFramework || (
            !!formData.apiDomain &&
            /^[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(formData.apiDomain)
          );
          const pathsValid = !hasFramework || (
            formData.apiPaths?.length > 0 &&
            formData.apiPaths.every(path => /^\/[a-zA-Z0-9/_-]+$/.test(path.trim()))
          );
          return backendValid && domainValid && pathsValid;
        }

        return backendValid;
      }

      case 6:
        return formData.webServerItems?.every(item => {
          const isEmpty = !item.server && !item.version;
          if (isEmpty) return true;
          return !!item.server && !!item.version;
        });

      case 7:
        return formData.dbItems?.every(item => {
          const isEmpty = !item.type && !item.name && !item.version && !item.size;
          if (isEmpty) return true;
          return !!item.type && !!item.name && !!item.version && !!item.size;
        });

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
          disabled={!isCurrentStepValid() || isSubmitting}
          className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 ${!isCurrentStepValid() || isSubmitting
            ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
            : 'bg-primary hover:bg-primary-hover text-white shadow-sm'
            }`}
        >
          {isSubmitting ? '제출 중...' : (currentStep === TOTAL_STEPS - 1 ? '확인 ✓' : '다음 →')}
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
            setShowInfoModal(true);
          }}
          onClose={() => setShowConfirmModal(false)}
          onSubmit={handleConfirmSubmit}
        />
      )}
    </>
  );
}
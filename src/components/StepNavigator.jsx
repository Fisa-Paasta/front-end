import { useSurvey } from '@/context/SurveyContext';
import '@/styles/StepProgress.css'; // CSS 따로 분리 가능

export default function StepNavigator() {
  const { currentStep } = useSurvey();
  const steps = ['환경 선택', '자원 선택', '보안 등급', 'k8s', 'DB', 'Framework'];

  return (
    <div className="step-progress-container">
      {steps.map((label, idx) => (
        <div
          key={idx}
          className={`step-item 
            ${idx < currentStep ? 'completed' : ''} 
            ${idx === currentStep ? 'active' : ''}`}
        >
          <div className="step-circle">{idx + 1}</div>
          <div className="step-label">{label}</div>
          {idx !== steps.length - 1 && <div className="step-line" />}
        </div>
      ))}
    </div>
  );
}

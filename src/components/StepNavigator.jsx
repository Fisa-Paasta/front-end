// src/components/StepNavigator.jsx
import { useSurvey } from '@/context/SurveyContext';
import '@/styles/StepProgress.css';

export default function StepNavigator() {
  const { currentStep, TOTAL_STEPS } = useSurvey();
  const steps = [
    '환경 선택',     // Step 1
    'k8s',          // Step 2
    '자원 선택',     // Step 3
    'OS',           // Step 4
    '프론트엔드',    // Step 5
    '백엔드',        // Step 6
    '웹 서버/WAS',   // Step 7
    'DB',           // Step 8
    'CI/CD'         // Step 9
  ];

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
          {idx !== TOTAL_STEPS - 1 && <div className="step-line" />}
        </div>
      ))}
    </div>
  );
}
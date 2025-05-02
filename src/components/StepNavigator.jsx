// src/components/StepNavigator.jsx
import { useSurvey } from '@/context/SurveyContext';
import '@/styles/StepProgress.css';

export default function StepNavigator() {
  const { currentStep, steps } = useSurvey();

  return (
    <div className="step-progress-container">
      {steps.map((step, idx) => (
        <div
          key={idx}
          className={`step-item 
            ${idx < currentStep ? 'completed' : ''} 
            ${idx === currentStep ? 'active' : ''}`}
        >
          <div className="step-circle">{idx + 1}</div>
          <div className="step-label">{step.title}</div>
          {idx !== steps.length - 1 && <div className="step-line" />}
        </div>
      ))}
    </div>
  );
}
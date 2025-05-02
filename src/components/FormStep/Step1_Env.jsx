// src/components/FormStep/Step1_Env.jsx
import { useSurvey } from '@/context/SurveyContext';

export default function Step1_Env() {
  const { formData, updateFormData, setCurrentStep } = useSurvey();

  // 환경 변경 시, 현재 스텝 유지 (첫 단계)
  const handleEnvChange = (value) => {
    updateFormData('env', value);
    setCurrentStep(0);
  };

  return (
    <div className="formbold-form-step">
      <label className="formbold-form-label">1. 환경 선택</label>
      <select
        name="env"
        className="formbold-form-input"
        value={formData.env || ''}
        onChange={(e) => handleEnvChange(e.target.value)}
      >
        <option value="">선택</option>
        <option value="iaas">IaaS</option>
        <option value="paas">PaaS</option>
      </select>
    </div>
  );
}
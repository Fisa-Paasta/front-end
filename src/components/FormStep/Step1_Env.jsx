import { useSurvey } from '@/context/SurveyContext';

export default function Step1_Env() {
  const { formData, updateFormData } = useSurvey();

  return (
    <div className="formbold-form-step">
      <label className="formbold-form-label">1. IaaS / PaaS</label>
      <select
        name="service_type"
        className="formbold-form-input"
        value={formData.env || ''}
        onChange={(e) => updateFormData('env', e.target.value)}
      >
        <option value="">선택</option>
        <option value="iaas">IaaS</option>
        <option value="paas">PaaS</option>
      </select>
    </div>
  );
}

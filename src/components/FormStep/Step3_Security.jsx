// Step3_Security.jsx
import { useSurvey } from '@/context/SurveyContext';

export default function Step3_Security() {
  const { formData, updateFormData } = useSurvey();

  return (
    <div className="formbold-form-step">
      <label className="formbold-form-label">3. 보안 등급</label>
      <select
        name="security_level"
        className="formbold-form-input"
        value={formData.sec || ''}
        onChange={(e) => updateFormData('sec', e.target.value)}
      >
        <option value="">선택</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
    </div>
  );
}
// src/components/FormStep/Step3_Resources.jsx
import { useSurvey } from '@/context/SurveyContext';

export default function Step3_Resources() {
  const { formData, updateFormData } = useSurvey();

  const handleChange = (field, value) => {
    updateFormData('resources', {
      ...formData.resources,
      [field]: value
    });
  };

  return (
    <div className="formbold-form-step">
      <label className="formbold-form-label">3. System Resources</label>

      <div className="form-group">
        <label className="input-label">CPU (cores)</label>
        <input
          type="number"
          name="cpu"
          className="formbold-form-input"
          placeholder="CPU 코어 수"
          value={formData.resources?.cpu || ''}
          onChange={(e) => handleChange('cpu', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="input-label">RAM (GB)</label>
        <input
          type="number"
          name="ram"
          className="formbold-form-input"
          placeholder="RAM 용량"
          value={formData.resources?.ram || ''}
          onChange={(e) => handleChange('ram', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="input-label">DISK (GB)</label>
        <input
          type="number"
          name="disk"
          className="formbold-form-input"
          placeholder="디스크 용량"
          value={formData.resources?.disk || ''}
          onChange={(e) => handleChange('disk', e.target.value)}
        />
      </div>
    </div>
  );
}
import { useSurvey } from '@/context/SurveyContext';

export default function Step2_Resource() {
  const { formData, updateFormData } = useSurvey();

  return (
    <div className="formbold-form-step">
      <label className="formbold-form-label">2. System Resources</label>

      <div className="formbold-input-with-unit">
        <input
          type="number"
          name="cpu"
          className="formbold-form-input"
          placeholder="CPU"
          value={formData.cpu || ''}
          onChange={(e) => updateFormData('cpu', e.target.value)}
        />
        <span className="unit">cores</span>
      </div>

      <div className="formbold-input-with-unit">
        <input
          type="number"
          name="ram"
          className="formbold-form-input"
          placeholder="RAM"
          value={formData.ram || ''}
          onChange={(e) => updateFormData('ram', e.target.value)}
        />
        <span className="unit">GB</span>
      </div>

      <div className="formbold-input-with-unit">
        <input
          type="number"
          name="disk"
          className="formbold-form-input"
          placeholder="DISK"
          value={formData.disk || ''}
          onChange={(e) => updateFormData('disk', e.target.value)}
        />
        <span className="unit">GB</span>
      </div>
    </div>
  );
}

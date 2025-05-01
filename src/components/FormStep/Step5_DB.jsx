// src/components/FormStep/Step5_DB.jsx
import { useSurvey } from '@/context/SurveyContext';

export default function Step5_DB() {
  const { formData, updateFormData } = useSurvey();

  return (
    <div className="formbold-form-step">
      <label className="formbold-form-label">5. DB 설정</label>
      <input
  type="text"
  name="db_type"
  className="formbold-form-input"
  placeholder="DB Type (e.g. MySQL, MongoDB)"
  value={formData.db?.db_type || ''}
  onChange={(e) =>
    updateFormData('db', { ...formData.db, db_type: e.target.value })
  }
/>

<input
  type="text"
  name="db_version"
  className="formbold-form-input"
  placeholder="DB Version"
  value={formData.db?.db_version || ''}
  onChange={(e) =>
    updateFormData('db', { ...formData.db, db_version: e.target.value })
  }
/>

<input
  type="number"
  name="db_size"
  className="formbold-form-input"
  placeholder="DB Size (GB)"
  value={formData.db?.db_size || ''}
  onChange={(e) =>
    updateFormData('db', { ...formData.db, db_size: e.target.value })
  }
/>

    </div>
  );
}

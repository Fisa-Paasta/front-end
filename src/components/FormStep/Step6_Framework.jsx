import { useSurvey } from '@/context/SurveyContext';
import { useState } from 'react';

const options = {
  backend: {
    'Spring Boot': ['2.7', '3.0', '3.1'],
    'Express': ['4.x', '5.x'],
    'Django': ['3.2', '4.0']
  },
  frontend: {
    'React': ['17', '18'],
    'Vue': ['2', '3']
  },
  cicd: {
    'GitHub Actions': ['v1', 'v2'],
    'Jenkins': ['2.x', '3.x']
  }
};

export default function Step6_Framework() {
  const { formData, updateFormData } = useSurvey();

  const [local, setLocal] = useState(() => {
    const initial = formData.framework || {};
    return {
      backend: initial.backend || { name: '', version: '' },
      frontend: initial.frontend || { name: '', version: '' },
      cicd: initial.cicd || { name: '', version: '' },
      etc: initial.etc || ''
    };
  });

  const handleChange = (type, field, value) => {
    const newValue = { ...local[type], [field]: value };

    // 버전 선택 전에 프레임워크가 바뀌면 버전 초기화
    if (field === 'name') {
      newValue.version = '';
    }

    const newState = { ...local, [type]: newValue };
    setLocal(newState);
    updateFormData('framework', newState);
  };

  return (
    <div className="formbold-form-step">
      <label className="formbold-form-label">6. Framework 선택</label>

      {['backend', 'frontend', 'cicd'].map(type => (
        <div key={type} style={{ marginBottom: '20px' }}>
          <h4>{type.toUpperCase()}</h4>

          <div style={{ display: 'flex', gap: '10px' }}>
            <select
              className="formbold-form-input"
              value={local[type].name}
              onChange={(e) => handleChange(type, 'name', e.target.value)}
            >
              <option value="">프레임워크 선택</option>
              {Object.keys(options[type]).map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>

            <select
              className="formbold-form-input"
              value={local[type].version}
              onChange={(e) => handleChange(type, 'version', e.target.value)}
              disabled={!local[type].name}
            >
              <option value="">버전 선택</option>
              {(options[type][local[type].name] || []).map(v => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>
        </div>
      ))}

      <label style={{ marginTop: '10px' }}>기타:</label>
      <input
        type="text"
        className="formbold-form-input"
        placeholder="기타 직접 입력"
        value={local.etc}
        onChange={(e) => {
          const newState = { ...local, etc: e.target.value };
          setLocal(newState);
          updateFormData('framework', newState);
        }}
      />
    </div>
  );
}

// src/components/FormStep/Step9_CICD.jsx
import { useSurvey } from '@/context/SurveyContext';
import { useState, useEffect } from 'react';

export default function Step9_CICD() {
  const { formData, updateFormData } = useSurvey();
  
  // Updated CI/CD options
  const cicdOptions = {
    "jenkins": ["2.504.1", "2.492.3 (LTS)", "2.479.3 (LTS)"],
    "argocd": ["2.14.11", "2.13.7", "2.12.12"]
  };
  
  const toolDisplayNames = {
    "jenkins": "Jenkins",
    "argocd": "ArgoCD"
  };

  // Create local state
  const [localCICD, setLocalCICD] = useState(() => {
    return formData.cicd || {
      tool: '',
      version: ''
    };
  });

  // Update parent form when local state changes
  useEffect(() => {
    updateFormData('cicd', localCICD);
  }, [localCICD, updateFormData]);

  const handleChange = (field, value) => {
    const newData = { ...localCICD, [field]: value };
    
    // Reset version when tool changes
    if (field === 'tool') {
      newData.version = '';
    }
    
    setLocalCICD(newData);
  };

  return (
    <div className="formbold-form-step">
      <label className="formbold-form-label">9. CI/CD</label>
      
      <div className="form-section">
        <h4>CI/CD 도구</h4>
        <div className="form-row">
          <select
            className="formbold-form-input"
            value={localCICD.tool || ''}
            onChange={(e) => handleChange('tool', e.target.value)}
          >
            <option value="">도구 선택</option>
            {Object.keys(cicdOptions).map(tool => (
              <option key={tool} value={tool}>{toolDisplayNames[tool]}</option>
            ))}
          </select>

          <select
            className="formbold-form-input"
            value={localCICD.version || ''}
            onChange={(e) => handleChange('version', e.target.value)}
            disabled={!localCICD.tool}
          >
            <option value="">버전 선택</option>
            {cicdOptions[localCICD.tool]?.map(version => (
              <option key={version} value={version}>{version}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

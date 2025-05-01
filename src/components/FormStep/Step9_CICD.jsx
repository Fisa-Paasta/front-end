// src/components/FormStep/Step9_CICD.jsx
import { useSurvey } from '@/context/SurveyContext';
import { useState, useEffect } from 'react';

export default function Step9_CICD() {
  const { formData, updateFormData } = useSurvey();
  
  const cicdOptions = {
    "jenkins": ["2.414.x (가장 널리 사용되는 CI/CD 도구)"],
    "gitlab_ci": ["최신 버전"],
    "github_actions": ["최신 버전"],
    "argocd": ["2.8.x (쿠버네티스 GitOps)"],
    "tekton": ["0.53.x (클라우드 네이티브 CI/CD)"],
    "circleci": ["최신 버전"]
  };
  
  const toolDisplayNames = {
    "jenkins": "Jenkins",
    "gitlab_ci": "GitLab CI/CD",
    "github_actions": "GitHub Actions",
    "argocd": "ArgoCD",
    "tekton": "Tekton",
    "circleci": "CircleCI"
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
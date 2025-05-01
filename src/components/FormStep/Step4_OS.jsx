// src/components/FormStep/Step4_OS.jsx
import { useSurvey } from '@/context/SurveyContext';
import { useState, useEffect } from 'react';

export default function Step4_OS() {
  const { formData, updateFormData } = useSurvey();
  
  const osOptions = {
    "ubuntu": ["20.04 LTS", "22.04 LTS (클라우드 환경에서 가장 인기)"],
    "rhel": ["8.x", "9.x (기업 환경에서 인기)"],
    "amazon_linux": ["2", "2023 (AWS 환경에 최적화)"],
    "centos": ["Stream 8", "Stream 9 (RHEL 호환 무료 버전)"],
    "debian": ["11 (Bullseye)", "12 (Bookworm) (안정성 우수)"]
  };

  // Create local state
  const [localOS, setLocalOS] = useState(() => {
    return formData.os || {
      name: '',
      version: ''
    };
  });

  // Update parent form when local state changes
  useEffect(() => {
    updateFormData('os', localOS);
  }, [localOS, updateFormData]);

  const handleChange = (field, value) => {
    const newData = { ...localOS, [field]: value };
    
    // Reset version when OS changes
    if (field === 'name') {
      newData.version = '';
    }
    
    setLocalOS(newData);
  };

  return (
    <div className="formbold-form-step">
      <label className="formbold-form-label">4. OS</label>
      
      <div className="form-section">
        <h4>서버 OS 버전</h4>
        <div className="form-row">
          <select
            className="formbold-form-input"
            value={localOS.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
          >
            <option value="">OS 선택</option>
            <option value="ubuntu">Ubuntu</option>
            <option value="rhel">Red Hat Enterprise Linux (RHEL)</option>
            <option value="amazon_linux">Amazon Linux</option>
            <option value="centos">CentOS</option>
            <option value="debian">Debian</option>
          </select>

          <select
            className="formbold-form-input"
            value={localOS.version || ''}
            onChange={(e) => handleChange('version', e.target.value)}
            disabled={!localOS.name}
          >
            <option value="">버전 선택</option>
            {osOptions[localOS.name]?.map(version => (
              <option key={version} value={version}>{version}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
// src/components/FormStep/Step2_VM.jsx
import { useSurvey } from '@/context/SurveyContext';
import { useState, useEffect } from 'react';

export default function Step2_VM() {
  const { formData, updateFormData } = useSurvey();
  
  const vmOptions = {
    "aws_ec2": ["t2.micro", "t3.small", "m5.large"],
    "azure_vm": ["B1s", "B2s", "D2s v3"],
    "gcp_compute": ["e2-micro", "e2-small", "n1-standard-1"],
    "vmware": ["Standard", "Advanced", "Enterprise"]
  };
  
  const vmProviders = [
    { value: "aws_ec2", label: "AWS EC2" },
    { value: "azure_vm", label: "Azure VM" },
    { value: "gcp_compute", label: "Google Cloud Compute" },
    { value: "vmware", label: "VMware" }
  ];

  // Create local state
  const [localVM, setLocalVM] = useState(() => {
    return formData.vm || {
      provider: '',
      type: '',
      count: '1'
    };
  });

  // Update parent form when local state changes
  useEffect(() => {
    updateFormData('vm', localVM);
  }, [localVM, updateFormData]);

  const handleChange = (field, value) => {
    const newData = { ...localVM, [field]: value };
    
    // Reset type when provider changes
    if (field === 'provider') {
      newData.type = '';
    }
    
    setLocalVM(newData);
  };

  return (
    <div className="formbold-form-step">
      <label className="formbold-form-label">2. 가상 머신 설정</label>
      
      <div className="form-section">
        <h4>VM 제공자</h4>
        <div className="form-row">
          <select
            className="formbold-form-input"
            value={localVM.provider || ''}
            onChange={(e) => handleChange('provider', e.target.value)}
          >
            <option value="">제공자 선택</option>
            {vmProviders.map(provider => (
              <option key={provider.value} value={provider.value}>
                {provider.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {localVM.provider && (
        <div className="form-section">
          <h4>VM 타입</h4>
          <div className="form-row">
            <select
              className="formbold-form-input"
              value={localVM.type || ''}
              onChange={(e) => handleChange('type', e.target.value)}
            >
              <option value="">VM 타입 선택</option>
              {vmOptions[localVM.provider]?.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
      )}
      
      <div className="form-section">
        <h4>VM 인스턴스 수</h4>
        <input
          type="number"
          name="count"
          className="formbold-form-input"
          placeholder="VM 인스턴스 수"
          value={localVM.count || ''}
          onChange={(e) => handleChange('count', e.target.value)}
          min="1"
        />
      </div>
    </div>
  );
}
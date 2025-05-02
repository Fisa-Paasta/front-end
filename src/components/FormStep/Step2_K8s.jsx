// src/components/FormStep/Step2_K8s.jsx
import { useSurvey } from '@/context/SurveyContext';
import { useState, useEffect } from 'react';

export default function Step2_K8s() {
  const { formData, updateFormData } = useSurvey();
  const [showAdditionalOptions, setShowAdditionalOptions] = useState(false);

  // K8s options - Updated with current versions
  const orchestrationOptions = {
    "": [],
    "kubernetes": ["1.32.2", "1.31.6", "1.30.10"],
    "amazon_eks": ["1.32.2 - eks.4", "1.31.6 - eks.20", "1.30.10 - eks.28"],
    "google_gke": ["Latest Google GKE"],
    "azure_aks": ["Latest Azure AKS"]
  };
  
  const runtimeOptions = {
    "docker": ["28.1.1", "27.5.1", "26.1.4"],
    "containerd": ["1.6 (LTS)", "1.7 (LTS)", "2.0 (Active)"]
  };
  
  const cniOptions = ["Calico", "Flannel", "Cilium"];

  // Create local state to manage form data
  const [localK8s, setLocalK8s] = useState(() => {
    return formData.k8s || {
      type: '',
      version: '',
      runtime: '',
      runtimeVersion: '',
      cni: '',
      node: '',
      rs: '',
      namespace: ''
    };
  });

  // Update parent form data when local state changes
  useEffect(() => {
    updateFormData('k8s', localK8s);
  }, [localK8s, updateFormData]);

  // Handle form changes
  const handleChange = (field, value) => {
    const newData = { ...localK8s, [field]: value };
    
    // Reset dependent fields when parent changes
    if (field === 'type') {
      newData.version = '';
      setShowAdditionalOptions(value === 'kubernetes');
    }
    
    if (field === 'runtime') {
      newData.runtimeVersion = '';
    }
    
    setLocalK8s(newData);
  };

  return (
    <div className="formbold-form-step">
      <label className="formbold-form-label">2. k8s Settings</label>
      
      <div className="form-section">
        <h4>컨테이너 오케스트레이션</h4>
        <div className="form-row">
          <select
            className="formbold-form-input"
            value={localK8s.type || ''}
            onChange={(e) => handleChange('type', e.target.value)}
          >
            <option value="">오케스트레이션 선택</option>
            <option value="kubernetes">Kubernetes</option>
            <option value="amazon_eks">Amazon EKS</option>
            <option value="google_gke">Google GKE</option>
            <option value="azure_aks">Azure AKS</option>
          </select>

          <select
            className="formbold-form-input"
            value={localK8s.version || ''}
            onChange={(e) => handleChange('version', e.target.value)}
            disabled={!localK8s.type}
          >
            <option value="">버전 선택</option>
            {orchestrationOptions[localK8s.type]?.map(version => (
              <option key={version} value={version}>{version}</option>
            ))}
          </select>
        </div>
      </div>

      {showAdditionalOptions && (
        <>
          <div className="form-section">
            <h4>컨테이너 런타임</h4>
            <div className="form-row">
              <select
                className="formbold-form-input"
                value={localK8s.runtime || ''}
                onChange={(e) => handleChange('runtime', e.target.value)}
              >
                <option value="">런타임 선택</option>
                {Object.keys(runtimeOptions).map(runtime => (
                  <option key={runtime} value={runtime}>{runtime}</option>
                ))}
              </select>

              <select
                className="formbold-form-input"
                value={localK8s.runtimeVersion || ''}
                onChange={(e) => handleChange('runtimeVersion', e.target.value)}
                disabled={!localK8s.runtime}
              >
                <option value="">버전 선택</option>
                {runtimeOptions[localK8s.runtime]?.map(version => (
                  <option key={version} value={version}>{version}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-section">
            <h4>CNI</h4>
            <select
              className="formbold-form-input"
              value={localK8s.cni || ''}
              onChange={(e) => handleChange('cni', e.target.value)}
            >
              <option value="">CNI 선택</option>
              {cniOptions.map(cni => (
                <option key={cni} value={cni}>{cni}</option>
              ))}
            </select>
          </div>
        </>
      )}

      <div className="form-section">
        <h4>클러스터 설정</h4>
        <input
          type="number"
          name="node"
          className="formbold-form-input"
          placeholder="Node"
          value={localK8s.node || ''}
          onChange={(e) => handleChange('node', e.target.value)}
        />
        <input
          type="number"
          name="rs"
          className="formbold-form-input"
          placeholder="ReplicaSet (RS)"
          value={localK8s.rs || ''}
          onChange={(e) => handleChange('rs', e.target.value)}
        />
        <input
          type="text"
          name="namespace"
          className="formbold-form-input"
          placeholder="Namespace"
          value={localK8s.namespace || ''}
          onChange={(e) => handleChange('namespace', e.target.value)}
        />
      </div>
    </div>
  );
}
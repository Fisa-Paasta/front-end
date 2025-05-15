import { useSurvey } from '@/context/SurveyContext';
import { useState, useEffect } from 'react';

export default function Step2_K8s() {
  const { formData, updateFormData } = useSurvey();
  const [showAdditionalOptions, setShowAdditionalOptions] = useState(false);

  const orchestrationOptions = {
    '': [],
    kubernetes: ['1.32.2', '1.31.6', '1.30.10'],
    amazon_eks: ['1.32.2 - eks.4', '1.31.6 - eks.20', '1.30.10 - eks.28'],
    google_gke: ['Latest Google GKE'],
    azure_aks: ['Latest Azure AKS']
  };

  const runtimeOptions = {
    docker: ['28.1.1', '27.5.1', '26.1.4'],
    containerd: ['1.6 (LTS)', '1.7 (LTS)', '2.0 (Active)']
  };

  const cniOptions = ['Calico', 'Flannel', 'Cilium'];

  const [localK8s, setLocalK8s] = useState(() => formData.k8s || {
    type: '', version: '', runtime: '', runtimeVersion: '',
    cni: '', node: '', rs: '', namespace: ''
  });

  useEffect(() => {
    updateFormData('k8s', localK8s);
  }, [localK8s]);

  const handleChange = (field, value) => {
    const updated = { ...localK8s, [field]: value };
    if (field === 'type') {
      updated.version = '';
      setShowAdditionalOptions(value === 'kubernetes');
    }
    if (field === 'runtime') updated.runtimeVersion = '';
    setLocalK8s(updated);
  };

  return (
    <div className="space-y-4">
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-sm space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium">컨테이너 오케스트레이션</label>
          <select
            className="w-full px-3 py-2 border rounded-md bg-white dark:bg-input-dark dark:text-white"
            value={localK8s.type}
            onChange={(e) => handleChange('type', e.target.value)}
          >
            <option value="">선택</option>
            <option value="kubernetes">Kubernetes</option>
            <option value="amazon_eks">Amazon EKS</option>
            <option value="google_gke">Google GKE</option>
            <option value="azure_aks">Azure AKS</option>
          </select>
        </div>

        {localK8s.type && (
          <div>
            <label className="block mb-1 text-sm font-medium">버전</label>
            <select
              className="w-full px-3 py-2 border rounded-md bg-white dark:bg-input-dark dark:text-white"
              value={localK8s.version}
              onChange={(e) => handleChange('version', e.target.value)}
            >
              <option value="">버전 선택</option>
              {orchestrationOptions[localK8s.type]?.map(v => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>
        )}

        {showAdditionalOptions && (
          <>
            <div>
              <label className="block mb-1 text-sm font-medium">런타임</label>
              <select
                className="w-full px-3 py-2 border rounded-md bg-white dark:bg-input-dark dark:text-white"
                value={localK8s.runtime}
                onChange={(e) => handleChange('runtime', e.target.value)}
              >
                <option value="">선택</option>
                {Object.keys(runtimeOptions).map(runtime => (
                  <option key={runtime} value={runtime}>{runtime}</option>
                ))}
              </select>
            </div>

            {localK8s.runtime && (
              <div>
                <label className="block mb-1 text-sm font-medium">런타임 버전</label>
                <select
                  className="w-full px-3 py-2 border rounded-md bg-white dark:bg-input-dark dark:text-white"
                  value={localK8s.runtimeVersion}
                  onChange={(e) => handleChange('runtimeVersion', e.target.value)}
                >
                  <option value="">선택</option>
                  {runtimeOptions[localK8s.runtime]?.map(v => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block mb-1 text-sm font-medium">CNI</label>
              <select
                className="w-full px-3 py-2 border rounded-md bg-white dark:bg-input-dark dark:text-white"
                value={localK8s.cni}
                onChange={(e) => handleChange('cni', e.target.value)}
              >
                <option value="">선택</option>
                {cniOptions.map(cni => (
                  <option key={cni} value={cni}>{cni}</option>
                ))}
              </select>
            </div>
          </>
        )}

        <div>
          <label className="block mb-1 text-sm font-medium">Node 수</label>
          <input
            type="number"
            className="w-full px-3 py-2 border rounded-md bg-white dark:bg-input-dark dark:text-white"
            value={localK8s.node}
            onChange={(e) => handleChange('node', e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">ReplicaSet 수</label>
          <input
            type="number"
            className="w-full px-3 py-2 border rounded-md bg-white dark:bg-input-dark dark:text-white"
            value={localK8s.rs}
            onChange={(e) => handleChange('rs', e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Namespace</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-md bg-white dark:bg-input-dark dark:text-white"
            value={localK8s.namespace}
            onChange={(e) => handleChange('namespace', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

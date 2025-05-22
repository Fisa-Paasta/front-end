import { useSurvey } from '@/context/SurveyContext';
import { useState, useEffect } from 'react';
import { K8sConfig } from '@/types/survey';

export default function Step2_K8s() {
  const { formData, updateFormData } = useSurvey();

  const [errors, setErrors] = useState({
    type: false,
    node: false,
    namespace: false
  });

  const orchestrationOptions: { value: K8sConfig['type'], label: string }[] = [
    { value: 'kubernetes', label: 'Kubernetes' },
    { value: 'amazon_eks', label: 'Amazon EKS' },
    { value: 'google_gke', label: 'Google GKE' },
    { value: 'azure_aks', label: 'Azure AKS' }
  ];

  const [localK8s, setLocalK8s] = useState<K8sConfig>({
    type: formData.k8s?.type || '',
    version: '', // ❌ 버전은 사용하지 않음
    node: formData.k8s?.node || '',
    namespace: formData.k8s?.namespace || ''
  });

  useEffect(() => {
    updateFormData('k8s', localK8s);
  }, [localK8s]);

  const handleChange = (field: keyof K8sConfig, value: string) => {
  if (field === 'node') {
    const numValue = parseInt(value, 10);
    if (isNaN(numValue) || numValue <= 0) {
      value = '';
      setErrors(prev => ({ ...prev, [field]: true }));
    } else {
      setErrors(prev => ({ ...prev, [field]: false }));
    }
  } else if (field === 'namespace') {
    if (value && !/^[a-zA-Z][-a-zA-Z0-9]*$/.test(value)) {
      setErrors(prev => ({ ...prev, [field]: true }));
    } else {
      setErrors(prev => ({ ...prev, [field]: false }));
    }
  } else {
    setErrors(prev => ({ ...prev, [field]: !value }));
  }

  setLocalK8s(prev => ({ ...prev, [field]: value }));
};

  return (
    <div className="space-y-4">
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-sm space-y-4">

        {/* 오케스트레이션 선택 */}
        <div>
          <label className="block mb-1 text-sm font-medium">컨테이너 오케스트레이션</label>
          <select
            value={localK8s.type}
            onChange={(e) => handleChange('type', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-input-dark dark:text-white ${errors.type ? 'border-red-500' : ''}`}
          >
            <option value="">선택</option>
            {orchestrationOptions.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          {errors.type && <p className="text-red-500 text-xs mt-1">오케스트레이션을 선택하세요.</p>}
        </div>

        {/* Worker Node 수 */}
        <div>
          <label className="block mb-1 text-sm font-medium">Worker Node 수</label>
          <input
            type="number"
            min="1"
            value={localK8s.node}
            onChange={(e) => handleChange('node', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-input-dark dark:text-white ${errors.node ? 'border-red-500' : ''}`}
          />
          {errors.node && <p className="text-red-500 text-xs mt-1">1 이상의 숫자를 입력하세요.</p>}
        </div>

        {/* Namespace Prefix */}
        <div>
          <label className="block mb-1 text-sm font-medium">Namespace Prefix</label>
          <input
            type="text"
            value={localK8s.namespace}
            onChange={(e) => handleChange('namespace', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-input-dark dark:text-white ${errors.namespace ? 'border-red-500' : ''}`}
            placeholder="예: team-alpha"
          />
          {errors.namespace && (
            <p className="text-red-500 text-xs mt-1">
              영문자로 시작하고, 영문자/숫자/하이픈만 사용할 수 있습니다.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

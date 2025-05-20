import { useSurvey } from '@/context/SurveyContext';
import { useState, useEffect } from 'react';
import { K8sConfig } from '@/types/survey';

export default function Step2_K8s() {
  const { formData, updateFormData } = useSurvey();
  const [showAdditionalOptions, setShowAdditionalOptions] = useState(false);
  
  // 유효성 검사 상태 추가
  const [errors, setErrors] = useState({
    type: false,
    version: false,
    node: false,
    rs: false,
    namespace: false
  });

  type OrchestrationType = 'kubernetes' | 'amazon_eks' | 'google_gke' | 'azure_aks' | '';
  type RuntimeType = 'docker' | 'containerd';
  type K8sConfigField = keyof K8sConfig;

  const orchestrationOptions: Record<OrchestrationType, string[]> = {
    '': [],
    kubernetes: ['1.32.2', '1.31.6', '1.30.10'],
    amazon_eks: ['1.32.2 - eks.4', '1.31.6 - eks.20', '1.30.10 - eks.28'],
    google_gke: ['Latest Google GKE'],
    azure_aks: ['Latest Azure AKS']
  };

  const runtimeOptions: Record<RuntimeType, string[]> = {
    docker: ['28.1.1', '27.5.1', '26.1.4'],
    containerd: ['1.6 (LTS)', '1.7 (LTS)', '2.0 (Active)']
  };

  const cniOptions = ['Calico', 'Flannel', 'Cilium'];

  const [localK8s, setLocalK8s] = useState<K8sConfig>(() => ({
    type: formData.k8s?.type || '',
    version: formData.k8s?.version || '',
    runtime: formData.k8s?.runtime || '',
    runtimeVersion: formData.k8s?.runtimeVersion || '',
    cni: formData.k8s?.cni || '',
    node: formData.k8s?.node || '',
    rs: formData.k8s?.rs || '',
    namespace: formData.k8s?.namespace || ''
  }));

  useEffect(() => {
    updateFormData('k8s', localK8s);
  }, [localK8s]);

  const validateField = (field: K8sConfigField, value: string): boolean => {
    switch (field) {
      case 'node':
      case 'rs':
        const numValue = parseInt(value, 10);
        return !isNaN(numValue) && numValue > 0;
      
      case 'namespace':
        if (!value) return true; // 네임스페이스는 선택사항
        return /^[a-zA-Z][-a-zA-Z0-9]*$/.test(value);
      
      case 'type':
      case 'version':
        return !!value; // 필수 필드
      
      default:
        return true; // 다른 필드는 기본적으로 유효함
    }
  };

  const handleChange = (field: K8sConfigField, value: string) => {
    // 숫자 필드에 대한 특별 처리
    if (field === 'node' || field === 'rs') {
      const numValue = parseInt(value, 10);
      // 숫자가 0 이하이거나 NaN인 경우 빈 문자열로 설정
      if (isNaN(numValue) || numValue <= 0) {
        value = '';
        setErrors(prev => ({...prev, [field]: true}));
      } else {
        setErrors(prev => ({...prev, [field]: false}));
      }
    } else if (field === 'namespace') {
      // 네임스페이스 유효성 검사
      if (value && !/^[a-zA-Z][-a-zA-Z0-9]*$/.test(value)) {
        setErrors(prev => ({...prev, [field]: true}));
      } else {
        setErrors(prev => ({...prev, [field]: false}));
      }
    } else {
      // 그 외 필드들의 유효성 검사
      const isValid = validateField(field, value);
      setErrors(prev => ({...prev, [field]: !isValid}));
    }

    const updated: K8sConfig = { ...localK8s, [field]: value };

    if (field === 'type') {
      updated.version = '';
      setShowAdditionalOptions(value === 'kubernetes');
    }

    if (field === 'runtime') {
      updated.runtimeVersion = '';
    }

    setLocalK8s(updated);
  };

  return (
    <div className="space-y-4">
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-sm space-y-4">
        {/* 오케스트레이션 */}
        <div>
          <label className="block mb-1 text-sm font-medium">컨테이너 오케스트레이션</label>
          <select
            value={localK8s.type}
            onChange={(e) => handleChange('type', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-input-dark dark:text-white ${
              errors.type ? 'border-red-500' : ''
            }`}
          >
            <option value="">선택</option>
            <option value="kubernetes">Kubernetes</option>
            <option value="amazon_eks">Amazon EKS</option>
            <option value="google_gke">Google GKE</option>
            <option value="azure_aks">Azure AKS</option>
          </select>
          {errors.type && (
            <p className="text-red-500 text-xs mt-1">오케스트레이션 타입을 선택해주세요.</p>
          )}
        </div>

        {/* 버전 */}
        {localK8s.type && (
          <div>
            <label className="block mb-1 text-sm font-medium">버전</label>
            <select
              value={localK8s.version}
              onChange={(e) => handleChange('version', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-input-dark dark:text-white ${
                errors.version ? 'border-red-500' : ''
              }`}
            >
              <option value="">버전 선택</option>
              {orchestrationOptions[localK8s.type as OrchestrationType].map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
            {errors.version && (
              <p className="text-red-500 text-xs mt-1">버전을 선택해주세요.</p>
            )}
          </div>
        )}

        {showAdditionalOptions && (
          <>
            {/* 런타임 */}
            <div>
              <label className="block mb-1 text-sm font-medium">런타임</label>
              <select
                value={localK8s.runtime}
                onChange={(e) => handleChange('runtime', e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-white dark:bg-input-dark dark:text-white"
              >
                <option value="">선택</option>
                {Object.keys(runtimeOptions).map((runtime) => (
                  <option key={runtime} value={runtime}>{runtime}</option>
                ))}
              </select>
            </div>

            {/* 런타임 버전 */}
            {localK8s.runtime && (
              <div>
                <label className="block mb-1 text-sm font-medium">런타임 버전</label>
                <select
                  value={localK8s.runtimeVersion}
                  onChange={(e) => handleChange('runtimeVersion', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md bg-white dark:bg-input-dark dark:text-white"
                >
                  <option value="">선택</option>
                  {runtimeOptions[localK8s.runtime as RuntimeType]?.map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>
            )}

            {/* CNI */}
            <div>
              <label className="block mb-1 text-sm font-medium">CNI</label>
              <select
                value={localK8s.cni}
                onChange={(e) => handleChange('cni', e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-white dark:bg-input-dark dark:text-white"
              >
                <option value="">선택</option>
                {cniOptions.map((cni) => (
                  <option key={cni} value={cni}>{cni}</option>
                ))}
              </select>
            </div>
          </>
        )}

        {/* Node 수 */}
        <div>
          <label className="block mb-1 text-sm font-medium">Node 수</label>
          <input
            type="number"
            value={localK8s.node}
            onChange={(e) => handleChange('node', e.target.value)}
            min="1"
            className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-input-dark dark:text-white ${
              errors.node ? 'border-red-500' : ''
            }`}
          />
          {errors.node && (
            <p className="text-red-500 text-xs mt-1">노드 수는 1 이상의 양수여야 합니다.</p>
          )}
        </div>

        {/* ReplicaSet 수 */}
        <div>
          <label className="block mb-1 text-sm font-medium">ReplicaSet 수</label>
          <input
            type="number"
            value={localK8s.rs}
            onChange={(e) => handleChange('rs', e.target.value)}
            min="1"
            className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-input-dark dark:text-white ${
              errors.rs ? 'border-red-500' : ''
            }`}
          />
          {errors.rs && (
            <p className="text-red-500 text-xs mt-1">레플리카셋 수는 1 이상의 양수여야 합니다.</p>
          )}
        </div>

        {/* Namespace */}
        <div>
          <label className="block mb-1 text-sm font-medium">Namespace</label>
          <input
            type="text"
            value={localK8s.namespace}
            onChange={(e) => handleChange('namespace', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-input-dark dark:text-white ${
              errors.namespace ? 'border-red-500' : ''
            }`}
          />
          {errors.namespace && (
            <p className="text-red-500 text-xs mt-1">네임스페이스는 영문자로 시작하고 영문자, 숫자, 하이픈(-)만 포함해야 합니다.</p>
          )}
        </div>
      </div>
    </div>
  );
}
import { useSurvey } from '@/context/SurveyContext';
import { useState, useEffect } from 'react';
import { ResourcesConfig, VMConfig, K8sConfig } from '@/types/survey';

export default function Step3_Resources() {
  const { formData, updateFormData } = useSurvey();
  const isEKS = formData.k8s?.type === 'amazon_eks';

  const [localResources, setLocalResources] = useState<ResourcesConfig>(formData.resources);
  const [localVM, setLocalVM] = useState<VMConfig>(formData.vm);
  const [localK8s, setLocalK8s] = useState<K8sConfig>(formData.k8s);
  const [errors, setErrors] = useState<{ node: boolean }>({ node: false });

  useEffect(() => {
    updateFormData('resources', localResources);
  }, [localResources]);

  useEffect(() => {
    updateFormData('vm', localVM);
  }, [localVM]);

  useEffect(() => {
    updateFormData('k8s', localK8s);
  }, [localK8s]);

  const handleResourceChange = (field: keyof ResourcesConfig, value: string) => {
    setLocalResources(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleVmChange = (field: 'ec2Type' | 'ebsType', value: string) => {
    setLocalVM(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNodeChange = (value: string) => {
    const num = parseInt(value, 10);
    if (isNaN(num) || num <= 0) {
      setErrors(prev => ({ ...prev, node: true }));
      setLocalK8s(prev => ({ ...prev, node: '' }));
    } else {
      setErrors(prev => ({ ...prev, node: false }));
      setLocalK8s(prev => ({ ...prev, node: value }));
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-sm space-y-4">

        {/* 공통: Worker Node 수 */}
        <div>
          <label className="block mb-1 text-sm font-medium">Worker Node 수</label>
          <input
            type="number"
            min="1"
            value={localK8s.node || ''}
            onChange={(e) => handleNodeChange(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-input-dark dark:text-white ${errors.node ? 'border-red-500' : ''}`}
            placeholder="예: 3"
          />
          {errors.node && (
            <p className="text-red-500 text-xs mt-1">1 이상의 숫자를 입력하세요.</p>
          )}
        </div>

        {isEKS ? (
          <>
            <div>
              <label className="block mb-1 text-sm font-medium">EC2 인스턴스 타입</label>
              <select
                value={localVM.ec2Type || ''}
                onChange={(e) => handleVmChange('ec2Type', e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-white dark:bg-input-dark dark:text-white"
              >
                <option value="">선택하세요</option>
                <option value="t3.medium">t2.small (1vCPU X 2GiB)</option>
                <option value="t3.medium">t3.medium (2vCPU X 4GiB)</option>
                <option value="t3.large">t3.large (2vCPU X 8GiB)</option>
                <option value="m5.large">t4g.xlarge (4vCPU X 16GiB)</option>
                <option value="m5.large">m5.large (2vCPU X 8GiB)</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">EBS 볼륨 타입</label>
              <select
                value={localVM.ebsType || ''}
                onChange={(e) => handleVmChange('ebsType', e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-white dark:bg-input-dark dark:text-white"
              >
                <option value="">선택하세요</option>
                <option value="gp3">gp3 (SSD)</option>
                <option value="gp2">gp2 (SSD)</option>
                <option value="io1">io1 (IOPS SSD)</option>
                <option value="io2">io2 (IOPS SSD)</option>
                <option value="st1">st1 (HDD)</option>
                <option value="sc1">sc1 (HDD)</option>
              </select>
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block mb-1 text-sm font-medium">CPU (cores)</label>
              <input
                type="number"
                value={localResources.cpu}
                onChange={(e) => handleResourceChange('cpu', e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-white dark:bg-input-dark dark:text-white"
                placeholder="예: 4"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">RAM (GB)</label>
              <input
                type="number"
                value={localResources.ram}
                onChange={(e) => handleResourceChange('ram', e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-white dark:bg-input-dark dark:text-white"
                placeholder="예: 16"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">DISK (GB)</label>
              <input
                type="number"
                value={localResources.disk}
                onChange={(e) => handleResourceChange('disk', e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-white dark:bg-input-dark dark:text-white"
                placeholder="예: 100"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

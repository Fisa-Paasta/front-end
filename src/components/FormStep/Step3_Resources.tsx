import { useSurvey } from '@/context/SurveyContext';
import { useState, useEffect } from 'react';

export default function Step3_Resources() {
  const { formData, updateFormData } = useSurvey();
  const initialK8s = formData.k8s ?? {};
  const initialRes = formData.resources ?? {};
  const initialVM = formData.vm ?? {};

  const [localResources, setLocalResources] = useState({
    cpu: initialRes.cpu ?? '',
    ram: initialRes.ram ?? '',
    disk: initialRes.disk ?? ''
  });

  const [localVM, setLocalVM] = useState({
    ec2Type: initialVM.ec2Type ?? '',
    ebsType: initialVM.ebsType ?? '',
    ebsSize: initialVM.ebsSize ?? ''
  });

  // ✅ 유효성 검사 상태 추가
  const [errors, setErrors] = useState({
    node: false,
    cpu: false,
    ram: false,
    disk: false,
    ebsSize: false
  });

  useEffect(() => {
    updateFormData('resources', {
      ...formData.resources,
      ...localResources
    });
  }, [localResources, formData.resources, updateFormData]);

  useEffect(() => {
    updateFormData('vm', {
      ...formData.vm,
      ...localVM
    });
  }, [localVM, formData.vm, updateFormData]);

  const handleResourceChange = (field: 'cpu' | 'ram' | 'disk', value: string) => {
    // ✅ 리소스 유효성 검사
    const numValue = parseInt(value, 10);
    const isValid = value === '' || (!isNaN(numValue) && numValue > 0);
    setErrors(prev => ({ ...prev, [field]: !isValid }));
    
    setLocalResources(prev => ({ ...prev, [field]: value }));
  };

  const handleVmChange = (field: 'ec2Type' | 'ebsType' | 'ebsSize', value: string) => {
    // ✅ EBS 크기 유효성 검사
    if (field === 'ebsSize') {
      const numValue = parseInt(value, 10);
      const isValid = value === '' || (!isNaN(numValue) && numValue > 0);
      setErrors(prev => ({ ...prev, ebsSize: !isValid }));
    }
    
    setLocalVM(prev => ({ ...prev, [field]: value }));
  };

  const handleNodeChange = (value: string) => {
    // ✅ 워커 노드 수 유효성 검사
    const numValue = parseInt(value, 10);
    const isValid = value === '' || (!isNaN(numValue) && numValue > 0);
    setErrors(prev => ({ ...prev, node: !isValid }));
    
    updateFormData('k8s', { ...formData.k8s, node: value });
  };

  const isEksEnvironment = initialK8s.type === 'amazon_eks';

  return (
    <div className="space-y-4">
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-sm space-y-4">
        <div>
          <label htmlFor="worker-nodes-input" className="block mb-1 text-sm font-medium">Worker Node 수</label>
          <input
            id="worker-nodes-input"
            type="number"
            min="1"
            value={formData.k8s?.node ?? ''}
            onChange={(e) => handleNodeChange(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-input-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.node ? 'border-red-500' : ''
            }`}
            placeholder="예: 3"
            aria-describedby={errors.node ? 'node-error' : undefined}
          />
          {errors.node && (
            <p id="node-error" className="text-red-500 text-xs mt-1" role="alert">
              Worker Node 수는 1 이상의 양수를 입력해주세요.
            </p>
          )}
        </div>
        
        {isEksEnvironment ? (
          <>
            <div>
              <label htmlFor="ec2-instance-select" className="block mb-1 text-sm font-medium">EC2 인스턴스 타입</label>
              <select
                id="ec2-instance-select"
                value={localVM.ec2Type}
                onChange={(e) => handleVmChange('ec2Type', e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-white dark:bg-input-dark dark:text-white"
              >
                <option value="">선택하세요</option>
                <option value="t2.small">t2.small (1vCPU X 2GiB)</option>
                <option value="t3.medium">t3.medium (2vCPU X 4GiB)</option>
                <option value="t3.large">t3.large (2vCPU X 8GiB)</option>
                <option value="t4g.xlarge">t4g.xlarge (4vCPU X 16GiB)</option>
                <option value="m5.large">m5.large (2vCPU X 8GiB)</option>
              </select>
            </div>

            <div>
              <label htmlFor="ebs-volume-select" className="block mb-1 text-sm font-medium">EBS 볼륨 타입</label>
              <select
                id="ebs-volume-select"
                value={localVM.ebsType}
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

            <div>
              <label htmlFor="ebs-size-input" className="block mb-1 text-sm font-medium">EBS 볼륨 크기 (GB)</label>
              <input
                id="ebs-size-input"
                type="number"
                min="1"
                value={localVM.ebsSize}
                onChange={(e) => handleVmChange('ebsSize', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-input-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.ebsSize ? 'border-red-500' : ''
                }`}
                placeholder="예: 50"
                aria-describedby={errors.ebsSize ? 'ebs-size-error' : undefined}
              />
              {errors.ebsSize && (
                <p id="ebs-size-error" className="text-red-500 text-xs mt-1" role="alert">
                  EBS 볼륨 크기는 1 이상의 양수를 입력해주세요.
                </p>
              )}
            </div>
          </>
        ) : (
          <>
            <div>
              <label htmlFor="cpu-cores-input" className="block mb-1 text-sm font-medium">CPU (cores)</label>
              <input
                id="cpu-cores-input"
                type="number"
                min="1"
                value={localResources.cpu}
                onChange={(e) => handleResourceChange('cpu', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-input-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.cpu ? 'border-red-500' : ''
                }`}
                placeholder="예: 4"
                aria-describedby={errors.cpu ? 'cpu-error' : undefined}
              />
              {errors.cpu && (
                <p id="cpu-error" className="text-red-500 text-xs mt-1" role="alert">
                  CPU는 1 이상의 양수를 입력해주세요.
                </p>
              )}
            </div>

            <div>
              <label htmlFor="ram-gb-input" className="block mb-1 text-sm font-medium">RAM (GB)</label>
              <input
                id="ram-gb-input"
                type="number"
                min="1"
                value={localResources.ram}
                onChange={(e) => handleResourceChange('ram', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-input-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.ram ? 'border-red-500' : ''
                }`}
                placeholder="예: 16"
                aria-describedby={errors.ram ? 'ram-error' : undefined}
              />
              {errors.ram && (
                <p id="ram-error" className="text-red-500 text-xs mt-1" role="alert">
                  RAM은 1 이상의 양수를 입력해주세요.
                </p>
              )}
            </div>

            <div>
              <label htmlFor="disk-gb-input" className="block mb-1 text-sm font-medium">DISK (GB)</label>
              <input
                id="disk-gb-input"
                type="number"
                min="1"
                value={localResources.disk}
                onChange={(e) => handleResourceChange('disk', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-input-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.disk ? 'border-red-500' : ''
                }`}
                placeholder="예: 100"
                aria-describedby={errors.disk ? 'disk-error' : undefined}
              />
              {errors.disk && (
                <p id="disk-error" className="text-red-500 text-xs mt-1" role="alert">
                  DISK는 1 이상의 양수를 입력해주세요.
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
import { useSurvey } from '@/context/SurveyContext';
import { useState, useEffect } from 'react';

export default function Step3_VMResources() {
  const { formData, updateFormData } = useSurvey();
  const initialVM = formData.vm || {};
  const initialRes = formData.resources || {};

  const [localVM, setLocalVM] = useState({
    environment: initialVM.environment || 'on-premise',
    ec2Type: initialVM.ec2Type || '',
    ebsType: initialVM.ebsType || '',
    ebsSize: initialVM.ebsSize || ''
  });

  const [localResources, setLocalResources] = useState({
    cpu: initialRes.cpu || '',
    ram: initialRes.ram || '',
    disk: initialRes.disk || ''
  });

  useEffect(() => {
    updateFormData('vm', {
      ...formData.vm,
      ...localVM
    });
  }, [localVM]);

  useEffect(() => {
    updateFormData('resources', {
      ...formData.resources,
      ...localResources
    });
  }, [localResources]);

  const handleVmChange = (field: 'environment' | 'ec2Type' | 'ebsType' | 'ebsSize', value: string) => {
    setLocalVM(prev => ({ ...prev, [field]: value }));
  };

  const handleResourceChange = (field: 'cpu' | 'ram' | 'disk', value: string) => {
    setLocalResources(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-4">
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-sm space-y-4">
        <div>
          <label htmlFor="environment-select" className="block mb-1 text-sm font-medium">환경</label>
          <select
            id="environment-select"
            value={localVM.environment}
            onChange={(e) => handleVmChange('environment', e.target.value)}
            className="w-full px-3 py-2 border rounded-md bg-white dark:bg-input-dark dark:text-white"
          >
            <option value="on-premise">On-premise</option>
            <option value="aws">AWS</option>
          </select>
        </div>

        {localVM.environment === 'on-premise' && (
          <>
            <div>
              <label htmlFor="cpu-cores-input" className="block mb-1 text-sm font-medium">CPU (cores)</label>
              <input
                id="cpu-cores-input"
                type="number"
                value={localResources.cpu}
                onChange={(e) => handleResourceChange('cpu', e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-white dark:bg-input-dark dark:text-white"
                placeholder="예: 4"
              />
            </div>

            <div>
              <label htmlFor="ram-gb-input" className="block mb-1 text-sm font-medium">RAM (GB)</label>
              <input
                id="ram-gb-input"
                type="number"
                value={localResources.ram}
                onChange={(e) => handleResourceChange('ram', e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-white dark:bg-input-dark dark:text-white"
                placeholder="예: 16"
              />
            </div>

            <div>
              <label htmlFor="disk-gb-input" className="block mb-1 text-sm font-medium">DISK (GB)</label>
              <input
                id="disk-gb-input"
                type="number"
                value={localResources.disk}
                onChange={(e) => handleResourceChange('disk', e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-white dark:bg-input-dark dark:text-white"
                placeholder="예: 100"
              />
            </div>
          </>
        )}

        {localVM.environment === 'aws' && (
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
                value={localVM.ebsSize || ''}
                onChange={(e) => handleVmChange('ebsSize', e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-white dark:bg-input-dark dark:text-white"
                placeholder="예: 50"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
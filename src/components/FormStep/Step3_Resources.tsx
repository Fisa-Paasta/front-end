import { useSurvey } from '@/context/SurveyContext';
import { useState, useEffect } from 'react';

export default function Step3_Resources() {
  const { formData, updateFormData } = useSurvey();
  const initialK8s = formData.k8s || {};
  const initialRes = formData.resources || {};
  const initialVM = formData.vm || {};

  const [localResources, setLocalResources] = useState({
    cpu: initialRes.cpu || '',
    ram: initialRes.ram || '',
    disk: initialRes.disk || ''
  });

  const [localVM, setLocalVM] = useState({
    ec2Type: initialVM.ec2Type || '',
    ebsType: initialVM.ebsType || '',
    ebsSize: initialVM.ebsSize || ''
  });

  useEffect(() => {
    updateFormData('resources', {
      ...formData.resources,
      ...localResources
    });
  }, [localResources]);

  useEffect(() => {
    updateFormData('vm', {
      ...formData.vm,
      ...localVM
    });
  }, [localVM]);

  const handleResourceChange = (field: 'cpu' | 'ram' | 'disk', value: string) => {
    setLocalResources(prev => ({ ...prev, [field]: value }));
  };

  const handleVmChange = (field: 'ec2Type' | 'ebsType' | 'ebsSize', value: string) => {
    setLocalVM(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-4">
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-sm space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium">Worker Node 수</label>
          <input
            type="number"
            min="1"
            value={formData.k8s?.node || ''}
            onChange={(e) => updateFormData('k8s', { ...formData.k8s, node: e.target.value })}
            className="w-full px-3 py-2 border rounded-md bg-white dark:bg-input-dark dark:text-white"
            placeholder="예: 3"
          />
        </div>
        {initialK8s.type === 'amazon_eks' ? (
          <>
            <div>
              <label className="block mb-1 text-sm font-medium">EC2 인스턴스 타입</label>
              <select
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
              <label className="block mb-1 text-sm font-medium">EBS 볼륨 타입</label>
              <select
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
              <label className="block mb-1 text-sm font-medium">EBS 볼륨 크기 (GB)</label>
              <input
                type="number"
                min="1"
                value={localVM.ebsSize || ''}
                onChange={(e) => handleVmChange('ebsSize', e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-white dark:bg-input-dark dark:text-white"
                placeholder="예: 50"
              />
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

import { useSurvey } from '@/context/SurveyContext';
import { useState, useEffect } from 'react';

export default function Step2_VM() {
  const { formData, updateFormData } = useSurvey();

  const vmOptions = {
    aws_ec2: ['t2.micro', 't3.small', 'm5.large'],
    azure_vm: ['B1s', 'B2s', 'D2s v3'],
    gcp_compute: ['e2-micro', 'e2-small', 'n1-standard-1'],
    vmware: ['Standard', 'Advanced', 'Enterprise']
  };

  const vmProviders = [
    { value: 'aws_ec2', label: 'AWS EC2' },
    { value: 'azure_vm', label: 'Azure VM' },
    { value: 'gcp_compute', label: 'Google Cloud Compute' },
    { value: 'vmware', label: 'VMware' }
  ];

  const [localVM, setLocalVM] = useState(() => formData.vm || { provider: '', type: '', count: '1' });

  useEffect(() => {
    updateFormData('vm', localVM);
  }, [localVM]);

  const handleChange = (field, value) => {
    const updated = { ...localVM, [field]: value };
    if (field === 'provider') updated.type = '';
    setLocalVM(updated);
  };

  return (
    <div className="space-y-4">
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-sm space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium">VM 제공자</label>
          <select
            className="w-full px-3 py-2 border rounded-md bg-white dark:bg-input-dark dark:text-white"
            value={localVM.provider}
            onChange={(e) => handleChange('provider', e.target.value)}
          >
            <option value="">제공자 선택</option>
            {vmProviders.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        {localVM.provider && (
          <div>
            <label className="block mb-1 text-sm font-medium">VM 타입</label>
            <select
              className="w-full px-3 py-2 border rounded-md bg-white dark:bg-input-dark dark:text-white"
              value={localVM.type}
              onChange={(e) => handleChange('type', e.target.value)}
            >
              <option value="">타입 선택</option>
              {vmOptions[localVM.provider]?.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block mb-1 text-sm font-medium">VM 인스턴스 수</label>
          <input
            type="number"
            className="w-full px-3 py-2 border rounded-md bg-white dark:bg-input-dark dark:text-white"
            placeholder="예: 3"
            value={localVM.count}
            onChange={(e) => handleChange('count', e.target.value)}
            min="1"
          />
        </div>
      </div>
    </div>
  );
}

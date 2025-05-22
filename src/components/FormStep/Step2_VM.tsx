import { useSurvey } from '@/context/SurveyContext';
import { useState, useEffect } from 'react';
import { VMConfig } from '@/types/survey';

export default function Step2_VM() {
  const { formData, updateFormData } = useSurvey();

  const [localVM, setLocalVM] = useState<VMConfig>({
    hostname: formData.vm?.hostname || '',
    username: formData.vm?.username || '',
    password: formData.vm?.password || ''
  });

  useEffect(() => {
    updateFormData('vm', localVM);
  }, [localVM]);

  const handleChange = (field: keyof VMConfig, value: string) => {
    setLocalVM((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-4">
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-sm space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium">호스트네임</label>
          <input
            type="text"
            value={localVM.hostname}
            onChange={(e) => handleChange('hostname', e.target.value)}
            className="w-full px-3 py-2 border rounded-md bg-white dark:bg-input-dark dark:text-white"
            placeholder="예: my-vm-host"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">사용자 이름</label>
          <input
            type="text"
            value={localVM.username}
            onChange={(e) => handleChange('username', e.target.value)}
            className="w-full px-3 py-2 border rounded-md bg-white dark:bg-input-dark dark:text-white"
            placeholder="예: ubuntu"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">비밀번호</label>
          <input
            type="password"
            value={localVM.password}
            onChange={(e) => handleChange('password', e.target.value)}
            className="w-full px-3 py-2 border rounded-md bg-white dark:bg-input-dark dark:text-white"
            placeholder="비밀번호 입력"
          />
        </div>
      </div>
    </div>
  );
}

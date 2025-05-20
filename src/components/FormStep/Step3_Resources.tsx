import { useSurvey } from '@/context/SurveyContext';
import { ResourceConfig } from '@/types/survey';
import { useState } from 'react';

export default function Step3_Resources() {
  const { formData, updateFormData } = useSurvey();
  
  // 유효성 검사 상태 추가
  const [errors, setErrors] = useState({
    cpu: false,
    ram: false,
    disk: false
  });

  const handleChange = (field: keyof ResourceConfig, value: string) => {
    const parsedValue = parseInt(value, 10);
    const isValid = !isNaN(parsedValue) && parsedValue > 0;
    
    // 유효성 상태 업데이트
    setErrors(prev => ({
      ...prev,
      [field]: !isValid
    }));
    
    // 항상 데이터는 업데이트하되, 유효하지 않은 경우 FormStep에서 처리
    updateFormData('resources', {
      ...formData.resources,
      [field]: parsedValue
    });
  };

  return (
    <div className="space-y-4">
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-sm space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium">CPU (cores)</label>
          <input
            type="number"
            name="cpu"
            className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-input-dark dark:text-white ${
              errors.cpu ? 'border-red-500' : ''
            }`}
            placeholder="CPU 코어 수"
            value={formData.resources?.cpu ?? ''}
            onChange={(e) => handleChange('cpu', e.target.value)}
            min="1"
          />
          {errors.cpu && (
            <p className="text-red-500 text-xs mt-1">CPU 코어 수는 1 이상의 양수여야 합니다.</p>
          )}
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">RAM (GB)</label>
          <input
            type="number"
            name="ram"
            className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-input-dark dark:text-white ${
              errors.ram ? 'border-red-500' : ''
            }`}
            placeholder="RAM 용량"
            value={formData.resources?.ram ?? ''}
            onChange={(e) => handleChange('ram', e.target.value)}
            min="1"
          />
          {errors.ram && (
            <p className="text-red-500 text-xs mt-1">RAM 용량은 1 이상의 양수여야 합니다.</p>
          )}
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">DISK (GB)</label>
          <input
            type="number"
            name="disk"
            className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-input-dark dark:text-white ${
              errors.disk ? 'border-red-500' : ''
            }`}
            placeholder="디스크 용량"
            value={formData.resources?.disk ?? ''}
            onChange={(e) => handleChange('disk', e.target.value)}
            min="1"
          />
          {errors.disk && (
            <p className="text-red-500 text-xs mt-1">디스크 용량은 1 이상의 양수여야 합니다.</p>
          )}
        </div>
      </div>
    </div>
  );
}
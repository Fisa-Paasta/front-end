import { useSurvey } from '@/context/SurveyContext';

export default function Step3_Resources() {
  const { formData, updateFormData } = useSurvey();

  const handleChange = (field, value) => {
    updateFormData('resources', {
      ...formData.resources,
      [field]: value
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
            className="w-full px-3 py-2 border rounded-md bg-white dark:bg-input-dark dark:text-white"
            placeholder="CPU 코어 수"
            value={formData.resources?.cpu || ''}
            onChange={(e) => handleChange('cpu', e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">RAM (GB)</label>
          <input
            type="number"
            name="ram"
            className="w-full px-3 py-2 border rounded-md bg-white dark:bg-input-dark dark:text-white"
            placeholder="RAM 용량"
            value={formData.resources?.ram || ''}
            onChange={(e) => handleChange('ram', e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">DISK (GB)</label>
          <input
            type="number"
            name="disk"
            className="w-full px-3 py-2 border rounded-md bg-white dark:bg-input-dark dark:text-white"
            placeholder="디스크 용량"
            value={formData.resources?.disk || ''}
            onChange={(e) => handleChange('disk', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
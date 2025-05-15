import { useSurvey } from '@/context/SurveyContext';

export default function Step1_Env() {
  const { formData, updateFormData, setCurrentStep } = useSurvey();

  const handleEnvChange = (value) => {
    updateFormData('env', value);
    setCurrentStep(0);
  };

  return (
    <div className="space-y-4">
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-sm">
        <label className="block mb-2 text-sm font-medium">환경 선택</label>
        <select
          name="env"
          className="w-full px-3 py-2 border rounded-md bg-white dark:bg-input-dark dark:text-white"
          value={formData.env || ''}
          onChange={(e) => handleEnvChange(e.target.value)}
        >
          <option value="">선택</option>
          <option value="iaas">IaaS</option>
          <option value="paas">PaaS</option>
        </select>
      </div>
    </div>
  );
}

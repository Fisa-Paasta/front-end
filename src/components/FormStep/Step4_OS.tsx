import { useSurvey } from '@/context/SurveyContext';
import { useState, useEffect } from 'react';
import { OSConfig, OSName } from '@/types/survey';

export default function Step4_OS() {
  const { formData, updateFormData } = useSurvey();

  const osOptions: Record<Exclude<OSName, ''>, string[]> = {
    ubuntu: ["20.04.6 (LTS / Focal Fossa)", "22.04.5 (LTS / Jammy Jellyfish)", "24.04.2 (LTS / Noble Numbat)"],
    rhel: ["RHEL 8", "RHEL 9"],
    suse: ["SUSE Linux 15.6", "SUSE Linux 12.5"],
    debian: ['Debian 11 "Bullseye"', 'Debian 10 "Buster"', 'Debian 9 "Stretch"'],
    amazon_linux: ["Amazon Linux 2", "Amazon Linux 2023"]
  };

  const [localOS, setLocalOS] = useState<OSConfig>(
    formData.os || { name: '', version: '' }
  );

  useEffect(() => {
    updateFormData('os', localOS);
  }, [localOS]);

  const handleChange = (field: keyof OSConfig, value: string) => {
    const updated: OSConfig = { ...localOS, [field]: value };
    if (field === 'name') updated.version = '';
    setLocalOS(updated);
  };

  return (
    <div className="space-y-4">
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-sm space-y-2">
        <select
          className="w-full px-3 py-2 border rounded-md bg-white dark:bg-input-dark dark:text-white"
          value={localOS.name}
          onChange={(e) => handleChange('name', e.target.value)}
        >
          <option value="">OS 선택</option>
          {(Object.keys(osOptions) as Exclude<OSName, ''>[]).map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>

        <select
          className="w-full px-3 py-2 border rounded-md bg-white dark:bg-input-dark dark:text-white"
          value={localOS.version}
          onChange={(e) => handleChange('version', e.target.value)}
          disabled={!localOS.name}
        >
          <option value="">버전 선택</option>
          {(osOptions[localOS.name as Exclude<OSName, ''>] || []).map((v) => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

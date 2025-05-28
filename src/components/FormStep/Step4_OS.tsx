import { useSurvey } from '@/context/SurveyContext';
import { useState, useEffect } from 'react';
import { OSConfig, OSName } from '@/types/survey';

export default function Step4_OS() {
  const { formData, updateFormData } = useSurvey();

  const osOptions: Record<Exclude<OSName, ''>, string[]> = {
    ubuntu: ['20.04.6 (LTS / Focal Fossa)', '22.04.5 (LTS / Jammy Jellyfish)', '24.04.2 (LTS / Noble Numbat)'],
    rhel: ['RHEL 8', 'RHEL 9'],
    suse: ['SUSE Linux 15.6', 'SUSE Linux 12.5'],
    debian: ['Debian 11 "Bullseye"', 'Debian 10 "Buster"', 'Debian 9 "Stretch"'],
    amazon_linux: ['Amazon Linux 2', 'Amazon Linux 2023'],
  };

  const osImages: { name: Exclude<OSName, ''>; label: string; src: string }[] = [
    { name: 'ubuntu', label: 'Ubuntu', src: '/img/os/ubuntu.png' },
    { name: 'rhel', label: 'RHEL', src: '/img/os/rhel.png' },
    { name: 'suse', label: 'SUSE', src: '/img/os/suse.png' },
    { name: 'debian', label: 'Debian', src: '/img/os/debian.png' },
    { name: 'amazon_linux', label: 'Amazon Linux', src: '/img/os/amazon.png' },
  ];

  const [localOS, setLocalOS] = useState<OSConfig>(formData.os || { name: '', version: '' });

  useEffect(() => {
    updateFormData('os', localOS);
  }, [localOS]);

  const handleChange = (field: keyof OSConfig, value: string) => {
    const updated = { ...localOS, [field]: value };
    if (field === 'name') updated.version = '';
    setLocalOS(updated);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-4">
        {/* 카드 목록 */}
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
          {osImages.map((os) => (
            <div
              key={os.name}
              className={`p-3 rounded-lg border-2 cursor-pointer text-center transition shadow-sm
                ${
                  localOS.name === os.name
                    ? 'border-violet-500 bg-violet-600 text-white'
                    : 'border-gray-300 bg-white hover:bg-gray-100 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white'
                }
              `}
              onClick={() => handleChange('name', localOS.name === os.name ? '' : os.name)}
            >
              <img
                src={os.src}
                alt={os.label}
                className="w-full h-16 object-contain mb-2"
              />
              <p className="text-sm font-semibold">{os.label}</p>
            </div>
          ))}
        </div>

        {/* 버전 선택 */}
        {localOS.name && (
          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-900 dark:text-white">
              버전 선택
            </label>
            <select
              className="w-full px-3 py-2 border rounded-md bg-white dark:bg-input-dark dark:text-white"
              value={localOS.version}
              onChange={(e) => handleChange('version', e.target.value)}
            >
              <option value="">버전 선택</option>
              {(osOptions[localOS.name as Exclude<OSName, ''>] || []).map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
}

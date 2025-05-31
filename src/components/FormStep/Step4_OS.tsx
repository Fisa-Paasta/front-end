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
  }, [localOS, updateFormData]);

  const handleOSChange = (value: string) => {
    const updated = { ...localOS, name: value as OSName, version: '' };
    setLocalOS(updated);
  };

  const handleVersionChange = (value: string) => {
    const updated = { ...localOS, version: value };
    setLocalOS(updated);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-4">
        {/* OS 선택 */}
        <fieldset>
          <legend className="text-sm font-medium mb-3">운영 체제 선택</legend>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
            {osImages.map((os) => (
              <div key={os.name}>
                <input
                  type="radio"
                  id={`os-${os.name}`}
                  name="os-selection"
                  value={os.name}
                  checked={localOS.name === os.name}
                  onChange={(e) => handleOSChange(e.target.value)}
                  className="sr-only"
                />
                <label
                  htmlFor={`os-${os.name}`}
                  className={`p-3 rounded-lg border-2 cursor-pointer text-center transition shadow-sm block
                    ${localOS.name === os.name
                      ? 'border-violet-500 bg-violet-600 text-white'
                      : 'border-gray-300 bg-white hover:bg-gray-100 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white'
                    }
                  `}
                >
                  <img
                    src={os.src}
                    alt={`${os.label} 로고`}
                    className="w-full h-16 object-contain mb-2"
                  />
                  <span className="text-sm font-semibold">{os.label}</span>
                </label>
              </div>
            ))}
          </div>
        </fieldset>

        {/* 버전 선택 */}
        {localOS.name && (
          <div>
            <label htmlFor="os-version-select" className="block mb-1 text-sm font-semibold text-gray-900 dark:text-white">
              버전 선택
            </label>
            <select
              id="os-version-select"
              className="w-full px-3 py-2 border rounded-md bg-white dark:bg-input-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              value={localOS.version}
              onChange={(e) => handleVersionChange(e.target.value)}
              aria-label={`${localOS.name} 버전 선택`}
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
import { useSurvey } from '@/context/SurveyContext';
import { useState, useEffect } from 'react';
import { BackendItem, BackendLanguage, BackendFramework } from '@/types/survey';

export default function Step6_Backend() {
  const { formData, updateFormData } = useSurvey();

  const backendLanguages: BackendLanguage[] = ['java', 'nodejs', 'python', 'go', 'ruby'];

  const languageVersions: Record<Exclude<BackendLanguage, ''>, string[]> = {
    java: ['JDK 11 (LTS)', 'JDK 17 (LTS)', 'JDK 21 (LTS)'],
    nodejs: ['v20 (Maintenance)', 'v22 (LTS)', 'v23 (Maintenance)'],
    python: ['3.10', '3.11', '3.12'],
    go: ['1.23.9', '1.24.3'],
    ruby: ['3.2.8', '3.3.8', '3.4.3']
  };

  const backendFrameworks: Record<Exclude<BackendLanguage, ''>, BackendFramework[]> = {
    java: ['spring_boot'],
    nodejs: ['express', 'nestjs'],
    python: ['django', 'flask'],
    go: ['gin', 'echo', 'fiber'],
    ruby: ['rails']
  };

  const frameworkVersions: Record<Exclude<BackendFramework, ''>, string[]> = {
    spring_boot: ['3.1.2', '3.3.3', '3.4.4'],
    express: ['4.18.2', '4.21.2', '5.1.0'],
    nestjs: ['11.0.13', '11.0.21', '11.1.0'],
    django: ['5.0.1', '4.2.10', '3.2.23'],
    flask: ['2.1.0', '2.3.0', '3.1.0'],
    fiber: ['2.52.6', '2.52.5', '2.52.4'],
    rails: ['4.2', '5.2', '6.1'],
    gin: ['1.9.1', '1.9.2', '1.9.3'],
    echo: ['4.10.1', '4.11.0', '4.12.0']
  };

  const frameworkNames: Record<Exclude<BackendFramework, ''>, string> = {
    spring_boot: 'Spring Boot',
    express: 'Express',
    nestjs: 'NestJS',
    django: 'Django',
    flask: 'Flask',
    fiber: 'Fiber',
    rails: 'Ruby on Rails',
    gin: 'Gin',
    echo: 'Echo'
  };

  const formatLangLabel = (lang: BackendLanguage) =>
    lang ? lang.charAt(0).toUpperCase() + lang.slice(1) : '';

  const [backendItems, setBackendItems] = useState<BackendItem[]>(() =>
    formData.backendItems?.length
      ? formData.backendItems
      : [
          {
            id: Date.now(),
            language: '',
            languageVersion: '',
            framework: '',
            frameworkVersion: ''
          }
        ]
  );

  useEffect(() => {
    updateFormData('backendItems', backendItems);
  }, [backendItems]);

  const addBackendItem = () => {
    setBackendItems((prev) => [
      ...prev,
      {
        id: Date.now(),
        language: '',
        languageVersion: '',
        framework: '',
        frameworkVersion: ''
      }
    ]);
  };

  const removeBackendItem = (id: number) => {
    if (backendItems.length <= 1) return;
    setBackendItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleChange = (id: number, field: keyof BackendItem, value: string) => {
    setBackendItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated: BackendItem = { ...item, [field]: value };
          if (field === 'language') {
            updated.languageVersion = '';
            updated.framework = '';
            updated.frameworkVersion = '';
          } else if (field === 'framework') {
            updated.frameworkVersion = '';
          }
          return updated;
        }
        return item;
      })
    );
  };

  return (
    <div className="space-y-4">
      {backendItems.map((item) => (
        <div
          key={item.id}
          className="flex gap-4 items-center bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-sm"
        >
          <div className="flex-1 space-y-2">
            <select
              value={item.language}
              onChange={(e) => handleChange(item.id, 'language', e.target.value)}
              className="w-full px-3 py-2 border rounded-md bg-white dark:bg-input-dark dark:text-white"
            >
              <option value="">언어 선택</option>
              {backendLanguages.map((lang) => (
                <option key={lang} value={lang}>
                  {formatLangLabel(lang)}
                </option>
              ))}
            </select>

            {item.language && (
              <>
                <select
                  value={item.languageVersion}
                  onChange={(e) => handleChange(item.id, 'languageVersion', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md bg-white dark:bg-input-dark dark:text-white"
                >
                  <option value="">언어 버전 선택</option>
                  {languageVersions[item.language as Exclude<BackendLanguage, ''>]?.map((ver) => (
                    <option key={ver} value={ver}>{ver}</option>
                  ))}
                </select>

                <select
                  value={item.framework}
                  onChange={(e) => handleChange(item.id, 'framework', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md bg-white dark:bg-input-dark dark:text-white"
                >
                  <option value="">프레임워크 선택</option>
                  {backendFrameworks[item.language as Exclude<BackendLanguage, ''>]?.map((fw) => (
                    <option key={fw} value={fw}>{frameworkNames[fw]}</option>
                  ))}
                </select>

                {item.framework && (
                  <select
                    value={item.frameworkVersion}
                    onChange={(e) => handleChange(item.id, 'frameworkVersion', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md bg-white dark:bg-input-dark dark:text-white"
                  >
                    <option value="">프레임워크 버전 선택</option>
                    {frameworkVersions[item.framework as Exclude<BackendFramework, ''>]?.map((ver) => (
                      <option key={ver} value={ver}>{ver}</option>
                    ))}
                  </select>
                )}
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => removeBackendItem(item.id)}
            className="text-red-500 text-xl hover:text-red-700"
            title="항목 제거"
          >
            ×
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addBackendItem}
        className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-md transition"
      >
        + 백엔드 추가
      </button>
    </div>
  );
}

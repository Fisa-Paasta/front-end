import { useSurvey } from '@/context/SurveyContext';
import { useState, useEffect } from 'react';
import { BackendItem } from '@/types/survey';

const languageOptions: Record<string, string[]> = {
  java: ['JDK 11 (LTS)', 'JDK 17 (LTS)', 'JDK 21 (LTS)'],
  nodejs: ['v20 (Maintenance)', 'v22 (LTS)', 'v23 (Maintenance)'],
  python: ['3.10', '3.11', '3.12'],
  go: ['1.23.9', '1.24.3'],
  ruby: ['3.2.8', '3.3.8', '3.4.3'],
};

const frameworkOptions: Record<string, string[]> = {
  spring_boot: ['2.7', '3.0', '3.1'],
  express: ['4.x', '5.x'],
  nestjs: ['9', '10'],
  django: ['3.2', '4.0'],
  flask: ['1.1', '2.0'],
  fiber: ['2.50', '2.60'],
  rails: ['6.1', '7.0'],
  gin: ['1.8', '1.9'],
  echo: ['4.9', '5.0'],
};

const frameworkNames: Record<string, string> = {
  spring_boot: 'Spring Boot',
  express: 'Express',
  nestjs: 'NestJS',
  django: 'Django',
  flask: 'Flask',
  fiber: 'Fiber',
  rails: 'Ruby on Rails',
  gin: 'Gin',
  echo: 'Echo',
};

export default function Step6_Backend() {
  const { formData, updateFormData } = useSurvey();
  const [items, setItems] = useState<BackendItem[]>(formData.backendItems || []);
  const [apiDomain, setApiDomain] = useState<string>(formData.apiDomain || '');
  const [apiPaths, setApiPaths] = useState<string[]>(formData.apiPaths || ['']);
  const [domainError, setDomainError] = useState(false);

  useEffect(() => {
    updateFormData('backendItems', items);
    updateFormData('apiDomain', apiDomain);
    updateFormData('apiPaths', apiPaths);
  }, [items, apiDomain, apiPaths]);

  const handleItemChange = (
    index: number,
    field: keyof BackendItem,
    value: string
  ) => {
    const updated = [...items];
    (updated[index] as any)[field] = value;
    setItems(updated);
  };

  const handleAdd = () => {
    setItems([
      ...items,
      { id: items.length + 1, language: '', languageVersion: '', framework: '', frameworkVersion: '' },
    ]);
  };

  const handleRemove = (index: number) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };

  const handleDomainChange = (value: string) => {
    setApiDomain(value);
    setDomainError(value !== '' && !/^[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(value));
  };

  const handlePathChange = (index: number, value: string) => {
    const updated = [...apiPaths];
    updated[index] = value;
    setApiPaths(updated);
  };

  const handleAddPath = () => {
    setApiPaths([...apiPaths, '']);
  };

  const handleRemovePath = (index: number) => {
    const updated = [...apiPaths];
    updated.splice(index, 1);
    setApiPaths(updated);
  };

  return (
    <div className="space-y-4">
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-sm space-y-4">
        {items.map((item: BackendItem, i: number) => (
          <div key={i} className="space-y-3">
            <select
              value={item.language}
              onChange={(e) => handleItemChange(i, 'language', e.target.value)}
              className="w-full px-3 py-2 border rounded-md bg-white dark:bg-input-dark dark:text-white"
            >
              <option value="">언어 선택</option>
              {Object.keys(languageOptions).map((lang) => (
                <option key={lang} value={lang}>{lang.toUpperCase()}</option>
              ))}
            </select>

            {item.language && (
              <select
                value={item.languageVersion}
                onChange={(e) => handleItemChange(i, 'languageVersion', e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-white dark:bg-input-dark dark:text-white"
              >
                <option value="">언어 버전 선택</option>
                {(languageOptions[item.language] || []).map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            )}

            <select
              value={item.framework}
              onChange={(e) => handleItemChange(i, 'framework', e.target.value)}
              className="w-full px-3 py-2 border rounded-md bg-white dark:bg-input-dark dark:text-white"
            >
              <option value="">프레임워크 선택</option>
              {Object.entries(frameworkNames).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>

            {item.framework && (
              <select
                value={item.frameworkVersion}
                onChange={(e) => handleItemChange(i, 'frameworkVersion', e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-white dark:bg-input-dark dark:text-white"
              >
                <option value="">프레임워크 버전 선택</option>
                {(frameworkOptions[item.framework] || []).map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            )}

            {items.length > 1 && (
              <button onClick={() => handleRemove(i)} className="text-red-500 text-xl">✕</button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={handleAdd}
          className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-md"
        >
          + 백엔드 추가
        </button>

        {formData.env === 'paas' && (
          <>
            {/* API 도메인 */}
            <div className="mt-6">
              <label className="block mb-1 text-sm font-medium">API 도메인</label>
              <input
                type="text"
                value={apiDomain}
                onChange={(e) => handleDomainChange(e.target.value)}
                placeholder="예: api.example.com"
                className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-input-dark dark:text-white ${domainError ? 'border-red-500' : ''}`}
              />
              {domainError && (
                <p className="text-red-500 text-xs mt-1">도메인 형식이 올바르지 않습니다.</p>
              )}
            </div>

            {/* API Prefix Paths */}
            <div className="mt-6 space-y-2">
              <label className="block mb-1 text-sm font-medium">API Prefix Path</label>
              {apiPaths.map((path: string, i: number) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={path}
                    onChange={(e) => handlePathChange(i, e.target.value)}
                    placeholder="/api"
                    className="w-full px-3 py-2 border rounded-md bg-white dark:bg-input-dark dark:text-white"
                  />
                  {apiPaths.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePath(i)}
                      className="text-red-500 text-xl"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddPath}
                className="mt-2 px-3 py-1 bg-purple-600 text-white rounded-md"
              >
                + 경로 추가
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

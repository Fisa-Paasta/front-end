import { useSurvey } from '@/context/SurveyContext';
import { useState, useEffect } from 'react';
import { BackendItem, BackendLanguage, BackendFramework } from '@/types/survey';

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

const languageCards = [
  { name: 'java', label: 'Java', src: '/img/backend/java.png' },
  { name: 'nodejs', label: 'Node.js', src: '/img/backend/nodejs.png' },
  { name: 'python', label: 'Python', src: '/img/backend/python.png' },
  { name: 'go', label: 'Go', src: '/img/backend/go.png' },
  { name: 'ruby', label: 'Ruby', src: '/img/backend/ruby.png' },
];

const frameworkCards: Record<string, { name: string; label: string; src: string }[]> = {
  java: [{ name: 'spring_boot', label: 'Spring Boot', src: '/img/backend/springboot.png' }],
  nodejs: [
    { name: 'express', label: 'Express', src: '/img/backend/express.png' },
    { name: 'nestjs', label: 'NestJS', src: '/img/backend/nestjs.png' },
  ],
  python: [
    { name: 'django', label: 'Django', src: '/img/backend/django.png' },
    { name: 'flask', label: 'Flask', src: '/img/backend/flask.svg' },
  ],
  go: [
    { name: 'fiber', label: 'Fiber', src: '/img/backend/fiber.png' },
    { name: 'gin', label: 'Gin', src: '/img/backend/gin.svg' },
    { name: 'echo', label: 'Echo', src: '/img/backend/echo.png' },
  ],
  ruby: [{ name: 'rails', label: 'Rails', src: '/img/backend/rubyonrails.svg' }],
};

export default function Step6_Backend() {
  const { formData, updateFormData } = useSurvey();
  const [items, setItems] = useState<BackendItem[]>(formData.backendItems || []);
  const [apiDomain, setApiDomain] = useState(formData.apiDomain || '');
  const [apiPaths, setApiPaths] = useState(formData.apiPaths || ['']);
  const [domainError, setDomainError] = useState(false);

  useEffect(() => {
    updateFormData('backendItems', items);
    updateFormData('apiDomain', apiDomain);
    updateFormData('apiPaths', apiPaths);
  }, [items, apiDomain, apiPaths, updateFormData]);

  const handleItemChange = (index: number, field: keyof BackendItem, value: string) => {
    const updated = [...items];
    const item = { ...updated[index] };

    if (field === 'language') {
      item.language = value as BackendLanguage;
      item.languageVersion = '';
      item.framework = '';
      item.frameworkVersion = '';
    } else if (field === 'framework') {
      item.framework = value as BackendFramework;
      item.frameworkVersion = '';
    } else {
      (item as any)[field] = value;
    }

    updated[index] = item;
    setItems(updated);
  };

  const handleAdd = () => {
    setItems([
      ...items,
      { id: Date.now(), language: '', languageVersion: '', framework: '', frameworkVersion: '' },
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

  const handleAddPath = () => setApiPaths([...apiPaths, '']);
  
  const handleRemovePath = (index: number) => {
    const updated = [...apiPaths];
    updated.splice(index, 1);
    setApiPaths(updated);
  };

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm space-y-6">
        {items.map((item, index) => (
          <div key={`backend-item-${item.id}`} className="space-y-4">
            {/* 언어 선택 라디오 그룹 */}
            <fieldset>
              <legend className="text-sm font-medium mb-3">백엔드 언어 선택 {index + 1}</legend>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
                {languageCards.map((lang) => (
                  <label
                    key={`lang-${item.id}-${lang.name}`}
                    className={`p-3 rounded-lg border-2 cursor-pointer text-center transition shadow-sm block
                      ${item.language === lang.name
                        ? 'border-violet-500 bg-violet-600 text-white'
                        : 'border-gray-300 bg-white hover:bg-gray-100 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white'}
                    `}
                  >
                    <input
                      type="radio"
                      name={`backend-language-${item.id}`}
                      value={lang.name}
                      checked={item.language === lang.name}
                      onChange={(e) => handleItemChange(index, 'language', e.target.value)}
                      className="sr-only"
                    />
                    <img src={lang.src} alt="" className="h-14 mx-auto object-contain mb-2" />
                    <span className="text-sm font-semibold">{lang.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            {/* 언어 버전 선택 */}
            {item.language && (
              <div>
                <label htmlFor={`language-version-select-${item.id}`} className="block mb-1 text-sm font-medium">언어 버전 선택</label>
                <select
                  id={`language-version-select-${item.id}`}
                  value={item.languageVersion}
                  onChange={(e) => handleItemChange(index, 'languageVersion', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md bg-white dark:bg-input-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                  aria-label={`${item.language} 버전 선택`}
                >
                  <option value="">언어 버전 선택</option>
                  {(languageOptions[item.language] || []).map((version) => (
                    <option key={`version-${item.id}-${version}`} value={version}>{version}</option>
                  ))}
                </select>
              </div>
            )}

            {/* 프레임워크 선택 라디오 그룹 */}
            {item.language && (
              <fieldset>
                <legend className="text-sm font-medium mb-3">{item.language} 프레임워크 선택</legend>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                  {(frameworkCards[item.language] || []).map((fw) => (
                    <label
                      key={`fw-${item.id}-${fw.name}`}
                      className={`p-3 rounded-lg border-2 cursor-pointer text-center transition shadow-sm block
                        ${item.framework === fw.name
                          ? 'border-violet-500 bg-violet-600 text-white'
                          : 'border-gray-300 bg-white hover:bg-gray-100 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white'}
                      `}
                    >
                      <input
                        type="radio"
                        name={`backend-framework-${item.id}`}
                        value={fw.name}
                        checked={item.framework === fw.name}
                        onChange={(e) => handleItemChange(index, 'framework', e.target.value)}
                        className="sr-only"
                      />
                      <img src={fw.src} alt="" className="h-14 mx-auto object-contain mb-2" />
                      <span className="text-sm font-semibold">{fw.label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            )}

            {/* 프레임워크 버전 선택 */}
            {item.framework && (
              <div>
                <label htmlFor={`framework-version-select-${item.id}`} className="block mb-1 text-sm font-medium">프레임워크 버전 선택</label>
                <select
                  id={`framework-version-select-${item.id}`}
                  value={item.frameworkVersion}
                  onChange={(e) => handleItemChange(index, 'frameworkVersion', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md bg-white dark:bg-input-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                  aria-label={`${item.framework} 버전 선택`}
                >
                  <option value="">프레임워크 버전 선택</option>
                  {(frameworkOptions[item.framework] || []).map((fwVersion) => (
                    <option key={`fw-version-${item.id}-${fwVersion}`} value={fwVersion}>{fwVersion}</option>
                  ))}
                </select>
              </div>
            )}

            {items.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="text-red-600 text-xl hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
                aria-label={`백엔드 항목 ${index + 1} 삭제`}
              >
                ✕
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={handleAdd}
          className="mt-2 px-3 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          aria-label="새 백엔드 항목 추가"
        >
          + 백엔드 추가
        </button>

        {/* PaaS 도메인 설정 */}
        {formData.env === 'paas' && (
          <>
            <div className="mt-6">
              <label htmlFor="api-domain-input" className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">API 도메인</label>
              <input
                id="api-domain-input"
                type="text"
                value={apiDomain}
                onChange={(e) => handleDomainChange(e.target.value)}
                placeholder="예: api.example.com"
                className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-input-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                  domainError ? 'border-red-500' : ''
                }`}
                aria-describedby={domainError ? 'api-domain-error' : undefined}
              />
              {domainError && (
                <p id="api-domain-error" className="text-red-500 text-xs mt-1" role="alert">
                  도메인 형식이 올바르지 않습니다.
                </p>
              )}
            </div>

            <div className="mt-6 space-y-2">
              <label className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">API Prefix Path</label>
              {apiPaths.map((path, pathIndex) => (
                <div key={`api-path-${pathIndex}`} className="flex items-center gap-2">
                  <label htmlFor={`api-path-input-${pathIndex}`} className="sr-only">API 경로 {pathIndex + 1}</label>
                  <input
                    id={`api-path-input-${pathIndex}`}
                    type="text"
                    value={path}
                    onChange={(e) => handlePathChange(pathIndex, e.target.value)}
                    placeholder="/api"
                    className="w-full px-3 py-2 border rounded-md bg-white dark:bg-input-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                  {apiPaths.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePath(pathIndex)}
                      className="text-red-500 text-xl hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
                      aria-label={`API 경로 ${pathIndex + 1} 삭제`}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddPath}
                className="mt-2 px-3 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                aria-label="새 API 경로 추가"
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
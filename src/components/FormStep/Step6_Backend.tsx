import { useSurvey } from '@/context/SurveyContext';
import { useState, useEffect } from 'react';
import { BackendItem, BackendLanguage, BackendFramework } from '@/types/survey';
import {
  Trash2Icon
} from 'lucide-react';

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

  // ✅ 개선된 언어 클릭 핸들러
  const handleLanguageClick = (index: number, languageName: string) => {
    const updated = [...items];
    const item = { ...updated[index] };
    const currentLanguage = item.language;

    // 이미 선택된 언어를 다시 클릭하면 선택 해제
    if (currentLanguage === languageName) {
      item.language = '';
      item.languageVersion = '';
      item.framework = '';
      item.frameworkVersion = '';
      console.log(`🔄 ${languageName} 선택 해제됨`);
    } else {
      // 새로운 언어 선택
      item.language = languageName as BackendLanguage;
      item.languageVersion = '';
      item.framework = '';
      item.frameworkVersion = '';
      console.log(`✅ ${languageName} 선택됨`);
    }

    updated[index] = item;
    setItems(updated);
  };

  // ✅ 개선된 프레임워크 클릭 핸들러
  const handleFrameworkClick = (index: number, frameworkName: string) => {
    const updated = [...items];
    const item = { ...updated[index] };
    const currentFramework = item.framework;

    // 이미 선택된 프레임워크를 다시 클릭하면 선택 해제
    if (currentFramework === frameworkName) {
      item.framework = '';
      item.frameworkVersion = '';
      console.log(`🔄 ${frameworkName} 선택 해제됨`);
    } else {
      // 새로운 프레임워크 선택
      item.framework = frameworkName as BackendFramework;
      item.frameworkVersion = '';
      console.log(`✅ ${frameworkName} 선택됨`);
    }

    updated[index] = item;
    setItems(updated);
  };

  const handleChange = (index: number, field: keyof BackendItem, value: string) => {
    const updated = [...items];
    (updated[index] as any)[field] = value;
    setItems(updated);
  };

  const handleAdd = () => {
    setItems([
      ...items,
      { id: Date.now(), language: '', languageVersion: '', framework: '', frameworkVersion: '' },
    ]);
  };

  // ✅ ID 기반 삭제로 수정
  const handleRemove = (targetId: number) => {
    setItems(prevItems => prevItems.filter(item => item.id !== targetId));
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
      {items.map((item, index) => (
        <div key={`backend-item-${item.id}`} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm space-y-6">
          {/* ✅ 휴지통 버튼을 언어 선택 legend에 통합 */}
          <fieldset>
            <legend className="text-sm font-medium mb-3 flex items-center justify-between">
              <span>
                백엔드 언어 선택 {index + 1}
                <span className="text-xs text-gray-500 ml-2">(선택된 항목을 다시 클릭하면 해제됩니다)</span>
              </span>
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemove(item.id)}
                  className="text-red-600 text-lg hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 rounded p-1"
                  aria-label={`백엔드 항목 ${index + 1} 삭제`}
                >
                  <Trash2Icon color='black' size={18} />
                </button>
              )}
            </legend>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
              {languageCards.map((lang) => (
                <button
                  key={`lang-${item.id}-${lang.name}`}
                  type="button"
                  onClick={() => handleLanguageClick(index, lang.name)}
                  className={`p-3 rounded-lg border-2 cursor-pointer text-center transition shadow-sm block w-full
                    ${item.language === lang.name
                      ? 'border-violet-500 bg-violet-600 text-white'
                      : 'border-gray-300 bg-white hover:bg-gray-100 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white'}
                  `}
                  aria-pressed={item.language === lang.name}
                  aria-label={`${lang.label} ${item.language === lang.name ? '선택됨 (클릭하여 해제)' : '선택하기'}`}
                >
                  <img src={lang.src} alt="" className="h-14 mx-auto object-contain mb-2" />
                  <span className="text-sm font-semibold">{lang.label}</span>
                </button>
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
                onChange={(e) => handleChange(index, 'languageVersion', e.target.value)}
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

          {/* 프레임워크 선택 */}
          {item.language && (
            <fieldset>
              <legend className="text-sm font-medium mb-3">
                {item.language} 프레임워크 선택
                <span className="text-xs text-gray-500 ml-2">(선택된 항목을 다시 클릭하면 해제됩니다)</span>
              </legend>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                {(frameworkCards[item.language] || []).map((fw) => (
                  <button
                    key={`fw-${item.id}-${fw.name}`}
                    type="button"
                    onClick={() => handleFrameworkClick(index, fw.name)}
                    className={`p-3 rounded-lg border-2 cursor-pointer text-center transition shadow-sm block w-full
                      ${item.framework === fw.name
                        ? 'border-violet-500 bg-violet-600 text-white'
                        : 'border-gray-300 bg-white hover:bg-gray-100 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white'}
                    `}
                    aria-pressed={item.framework === fw.name}
                    aria-label={`${fw.label} ${item.framework === fw.name ? '선택됨 (클릭하여 해제)' : '선택하기'}`}
                  >
                    <img src={fw.src} alt="" className="h-14 mx-auto object-contain mb-2" />
                    <span className="text-sm font-semibold">{fw.label}</span>
                  </button>
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
                onChange={(e) => handleChange(index, 'frameworkVersion', e.target.value)}
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
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm space-y-4">
          <div>
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
              autoComplete="off"
              spellCheck="false"
            />
            {domainError && (
              <p id="api-domain-error" className="text-red-500 text-xs mt-1" role="alert">
                도메인 형식이 올바르지 않습니다.
              </p>
            )}
          </div>

          <fieldset className="space-y-2">
            <legend className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">API Prefix Path</legend>
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
                  autoComplete="off"
                  spellCheck="false"
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
          </fieldset>
        </div>
      )}
    </div>
  );
}
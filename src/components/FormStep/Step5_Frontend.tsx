import { useSurvey } from '@/context/SurveyContext';
import { useState, useEffect } from 'react';
import { FrontendItem } from '@/types/survey';

const frontendOptions: Record<string, string[]> = {
  react: ['19.1.0', '18.3.1', '17.0.2'],
  vue: ['3.5.13 (Latest)', '3.5.0'],
  angular: ['19.2.9 (Latest)', '19.2.0'],
  nextjs: ['15.3.0', '14.2.0'],
  vite: ['5.2.7', '5.0.0', '4.5.2'],
  typescript: ['5.4.5', '5.3.3', '4.9.5'],
};

const frontendFrameworks: {
  name: string;
  label: string;
  src: string;
}[] = [
  { name: 'react', label: 'React', src: '/img/frontend/react.png' },
  { name: 'vue', label: 'Vue.js', src: '/img/frontend/vue.png' },
  { name: 'angular', label: 'Angular', src: '/img/frontend/angular.png' },
  { name: 'nextjs', label: 'Next.js', src: '/img/frontend/nextjs.png' },
  { name: 'vite', label: 'Vite', src: '/img/frontend/vite.png' },
  { name: 'typescript', label: 'TypeScript', src: '/img/frontend/typescript.png' },
];

export default function Step5_Frontend() {
  const { formData, updateFormData } = useSurvey();
  const [items, setItems] = useState<FrontendItem[]>(formData.frontendItems || []);
  const [frontendDomain, setFrontendDomain] = useState<string>(formData.frontendDomain || '');
  const [domainError, setDomainError] = useState(false);

  useEffect(() => {
    updateFormData('frontendItems', items);
    updateFormData('frontendDomain', frontendDomain);
  }, [items, frontendDomain, updateFormData]);

  const handleChange = (index: number, field: 'framework' | 'version', value: string) => {
    const updated = [...items];
    updated[index][field] = value;
    if (field === 'framework') updated[index].version = '';
    setItems(updated);
  };

  const handleAdd = () => {
    setItems([...items, { id: Date.now(), framework: '', version: '' }]);
  };

  const handleRemove = (index: number) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };

  const handleDomainChange = (value: string) => {
    setFrontendDomain(value);
    setDomainError(value !== '' && !/^[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(value));
  };

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm space-y-6">
        {items.map((item, i) => (
          <div key={item.id} className="space-y-4">
            {/* 프레임워크 선택 라디오 그룹 */}
            <fieldset>
              <legend className="text-sm font-medium mb-3">프론트엔드 프레임워크 선택 {i + 1}</legend>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {frontendFrameworks.map((fw) => (
                  <label
                    key={fw.name}
                    className={`p-3 rounded-lg border-2 cursor-pointer text-center transition shadow-sm block
                      ${item.framework === fw.name
                        ? 'border-violet-500 bg-violet-600 text-white'
                        : 'border-gray-300 bg-white hover:bg-gray-100 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white'}
                    `}
                  >
                    <input
                      type="radio"
                      name={`frontend-framework-${item.id}`}
                      value={fw.name}
                      checked={item.framework === fw.name}
                      onChange={(e) => handleChange(i, 'framework', e.target.value)}
                      className="sr-only"
                    />
                    <img
                      src={fw.src}
                      alt=""
                      className="w-full h-16 object-contain mb-2"
                    />
                    <span className="text-sm font-semibold">{fw.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            {/* 버전 선택 + 삭제 */}
            {item.framework && (
              <div className="grid grid-cols-[1fr_40px] gap-2 items-center">
                <div>
                  <label htmlFor={`version-select-${item.id}`} className="block mb-1 text-sm font-medium">
                    {item.framework} 버전 선택
                  </label>
                  <select
                    id={`version-select-${item.id}`}
                    value={item.version}
                    onChange={(e) => handleChange(i, 'version', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md bg-white dark:bg-input-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                    aria-label={`${item.framework} 버전 선택`}
                  >
                    <option value="">버전 선택</option>
                    {(frontendOptions[item.framework] || []).map((v) => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </div>

                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemove(i)}
                    className="text-red-600 font-bold text-xl text-center hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
                    aria-label={`프론트엔드 항목 ${i + 1} 삭제`}
                  >
                    ✕
                  </button>
                )}
              </div>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={handleAdd}
          className="mt-2 px-3 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          aria-label="새 프론트엔드 항목 추가"
        >
          + 프론트엔드 추가
        </button>

        {/* 도메인 입력 */}
        {formData.env === 'paas' && (
          <div>
            <label htmlFor="frontend-domain-input" className="block mt-6 mb-1 text-sm font-medium text-gray-900 dark:text-white">
              프론트 도메인 (필수 항목 X)
            </label>
            <input
              id="frontend-domain-input"
              type="text"
              value={frontendDomain}
              onChange={(e) => handleDomainChange(e.target.value)}
              placeholder="예: www.example.com"
              className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-input-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                domainError ? 'border-red-500' : ''
              }`}
              aria-describedby={domainError ? 'domain-error' : undefined}
            />
            {domainError && (
              <p id="domain-error" className="text-red-500 text-xs mt-1" role="alert">
                도메인 형식이 올바르지 않습니다.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
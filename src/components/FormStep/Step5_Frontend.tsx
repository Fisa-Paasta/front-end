import { useSurvey } from '@/context/SurveyContext';
import { useState, useEffect } from 'react';
import { FrontendItem } from '@/types/survey';

const frontendOptions: Record<string, string[]> = {
  react: ['19.1.0', '18.3.1', '17.0.2'],
  vue: ['3.5.13 (Latest)', '3.5.0'],
  angular: ['19.2.9 (Latest)', '19.2.0'],
  nextjs: ['15.3.0', '14.2.0'],
};

const frameworkNames: Record<string, string> = {
  react: 'React',
  vue: 'Vue.js',
  angular: 'Angular',
  nextjs: 'Next.js',
};

export default function Step5_Frontend() {
  const { formData, updateFormData } = useSurvey();
  const [items, setItems] = useState<FrontendItem[]>(formData.frontendItems || []);
  const [frontendDomain, setFrontendDomain] = useState<string>(formData.frontendDomain || '');
  const [domainError, setDomainError] = useState(false);

  useEffect(() => {
    updateFormData('frontendItems', items);
    updateFormData('frontendDomain', frontendDomain);
  }, [items, frontendDomain]);

  const handleChange = (index: number, field: 'framework' | 'version', value: string) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const handleAdd = () => {
    setItems([...items, { id: items.length + 1, framework: '', version: '' }]);
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
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-sm space-y-4">

        {/* 프론트엔드 목록 */}
        {items.map((item: FrontendItem, i: number) => (
          <div key={i} className="grid grid-cols-2 gap-4 items-center">
            {/* 프레임워크 선택 */}
            <select
              value={item.framework}
              onChange={(e) => handleChange(i, 'framework', e.target.value)}
              className="w-full px-3 py-2 border rounded-md bg-white dark:bg-input-dark dark:text-white"
            >
              <option value="">프레임워크 선택</option>
              {Object.entries(frameworkNames).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>

            {/* 버전 + 삭제 버튼 수평 정렬 */}
            <div className="grid grid-cols-[1fr_40px] gap-2 items-center">
              <select
                value={item.version}
                onChange={(e) => handleChange(i, 'version', e.target.value)}
                disabled={!item.framework}
                className="w-full px-3 py-2 border rounded-md bg-white dark:bg-input-dark dark:text-white"
              >
                <option value="">버전 선택</option>
                {(frontendOptions[item.framework] || []).map((ver) => (
                  <option key={ver} value={ver}>{ver}</option>
                ))}
              </select>

              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemove(i)}
                  className="text-red-600 font-bold text-xl text-center"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAdd}
          className="mt-2 px-3 py-1 bg-purple-600 text-white rounded-md"
        >
          + 프론트엔드 추가
        </button>

        {/* 프론트 도메인 (PaaS 전용) */}
        {formData.env === 'paas' && (
          <div>
            <label className="block mt-6 mb-1 text-sm font-medium">프론트 도메인 (필수 항목 X)</label>
            <input
              type="text"
              value={frontendDomain}
              onChange={(e) => handleDomainChange(e.target.value)}
              placeholder="예: www.example.com"
              className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-input-dark dark:text-white ${domainError ? 'border-red-500' : ''}`}
            />
            {domainError && (
              <p className="text-red-500 text-xs mt-1">도메인 형식이 올바르지 않습니다.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

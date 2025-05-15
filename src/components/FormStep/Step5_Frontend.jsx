// 리팩토링: Step5_Frontend.jsx
import { useSurvey } from '@/context/SurveyContext';
import { useState, useEffect } from 'react';

export default function Step5_Frontend() {
  const { formData, updateFormData } = useSurvey();

  const frontendOptions = {
    "react": ["19.1.0", "18.3.1", "17.0.2"],
    "vue": ["3.5.13 (Latest)", "3.5.0"],
    "angular": ["19.2.9 (Latest)", "19.2.0"],
    "nextjs": ["15.3.0", "14.2.0"]
  };

  const frameworkNames = {
    "react": "React",
    "vue": "Vue.js",
    "angular": "Angular",
    "nextjs": "Next.js",
  };

  const [frontendItems, setFrontendItems] = useState(() => {
    return formData.frontendItems?.length > 0
      ? formData.frontendItems
      : [{ id: Date.now(), framework: '', version: '' }];
  });

  useEffect(() => {
    updateFormData('frontendItems', frontendItems);
  }, [frontendItems]);

  const addFrontendItem = () => {
    setFrontendItems([...frontendItems, { id: Date.now(), framework: '', version: '' }]);
  };

  const removeFrontendItem = (id) => {
    if (frontendItems.length <= 1) return;
    setFrontendItems(frontendItems.filter(item => item.id !== id));
  };

  const handleChange = (id, field, value) => {
    setFrontendItems(frontendItems.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'framework') updated.version = '';
        return updated;
      }
      return item;
    }));
  };

  return (
    <div className="space-y-4">
      {frontendItems.map(item => (
        <div key={item.id} className="flex gap-4 items-center bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <div className="flex-1 space-y-2">
            <select
              className="w-full px-3 py-2 border rounded-md bg-white dark:bg-input-dark dark:text-white"
              value={item.framework}
              onChange={(e) => handleChange(item.id, 'framework', e.target.value)}
            >
              <option value="">프레임워크 선택</option>
              {Object.keys(frontendOptions).map(framework => (
                <option key={framework} value={framework}>{frameworkNames[framework]}</option>
              ))}
            </select>

            {item.framework && (
              <select
                className="w-full px-3 py-2 border rounded-md bg-white dark:bg-input-dark dark:text-white"
                value={item.version}
                onChange={(e) => handleChange(item.id, 'version', e.target.value)}
              >
                <option value="">버전 선택</option>
                {frontendOptions[item.framework].map(version => (
                  <option key={version} value={version}>{version}</option>
                ))}
              </select>
            )}
          </div>

          <button
            type="button"
            onClick={() => removeFrontendItem(item.id)}
            className="text-red-500 text-xl hover:text-red-700"
            title="항목 제거"
          >×</button>
        </div>
      ))}

      <button
        type="button"
        onClick={addFrontendItem}
        className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-md transition"
      >+ 프론트엔드 추가</button>
    </div>
  );
}
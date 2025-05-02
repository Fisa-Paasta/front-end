// src/components/FormStep/Step5_Frontend.jsx
import { useSurvey } from '@/context/SurveyContext';
import { useState, useEffect } from 'react';

export default function Step5_Frontend() {
  const { formData, updateFormData } = useSurvey();
  
  // Updated frontend frameworks and their versions
  const frontendOptions = {
    "react": ["18.2.0", "18.0.0", "17.0.2"],
    "vue": ["3.4.15", "3.3.12", "3.2.47"],
    "angular": ["17.3.0", "16.2.12", "15.2.10"],
    "nextjs": ["14.1.0", "14.0.4", "13.5.6"],
    "nuxtjs": ["3.10.0", "3.9.3", "3.8.2"]
  };
  
  const frameworkNames = {
    "react": "React",
    "vue": "Vue.js",
    "angular": "Angular",
    "nextjs": "Next.js",
    "nuxtjs": "Nuxt.js"
  };

  // 로컬 상태 초기화 - 프론트엔드 항목의 배열로 관리
  const [frontendItems, setFrontendItems] = useState(() => {
    // formData에 기존 프론트엔드 항목이 있으면 그것을 사용, 없으면 빈 항목 하나 생성
    if (formData.frontendItems && formData.frontendItems.length > 0) {
      return formData.frontendItems;
    }
    return [{ id: Date.now(), framework: '', version: '' }];
  });

  // 부모 폼 데이터 업데이트 - 로컬 상태가 변경될 때마다 호출
  useEffect(() => {
    updateFormData('frontendItems', frontendItems);
  }, [frontendItems, updateFormData]);

  // 프론트엔드 항목 추가
  const addFrontendItem = () => {
    setFrontendItems([
      ...frontendItems,
      { id: Date.now(), framework: '', version: '' }
    ]);
  };

  // 프론트엔드 항목 제거
  const removeFrontendItem = (id) => {
    if (frontendItems.length <= 1) return; // 항상 최소 하나는 유지
    setFrontendItems(frontendItems.filter(item => item.id !== id));
  };

  // 특정 항목의 필드 변경 처리
  const handleChange = (id, field, value) => {
    const updatedItems = frontendItems.map(item => {
      if (item.id === id) {
        const newItem = { ...item, [field]: value };
        
        // 프레임워크가 변경되면 버전 초기화
        if (field === 'framework') {
          newItem.version = '';
        }
        
        return newItem;
      }
      return item;
    });
    
    setFrontendItems(updatedItems);
  };

  return (
    <div className="formbold-form-step">
      <label className="formbold-form-label">5. 프론트엔드</label>
      
      <div className="form-section">
        <h4>프론트엔드 프레임워크</h4>
        
        <div className="item-list">
          {frontendItems.map((item) => (
            <div key={item.id} className="item-row">
              <div style={{ flex: 1 }}>
                <select
                  className="formbold-form-input"
                  value={item.framework || ''}
                  onChange={(e) => handleChange(item.id, 'framework', e.target.value)}
                >
                  <option value="">프레임워크 선택</option>
                  {Object.keys(frontendOptions).map(framework => (
                    <option key={framework} value={framework}>
                      {frameworkNames[framework]}
                    </option>
                  ))}
                </select>
                
                {item.framework && (
                  <select
                    className="formbold-form-input"
                    value={item.version || ''}
                    onChange={(e) => handleChange(item.id, 'version', e.target.value)}
                  >
                    <option value="">버전 선택</option>
                    {frontendOptions[item.framework]?.map(version => (
                      <option key={version} value={version}>{version}</option>
                    ))}
                  </select>
                )}
              </div>
              
              <button 
                type="button" 
                className="remove-button"
                onClick={() => removeFrontendItem(item.id)}
                title="항목 제거"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        
        <button 
          type="button" 
          className="add-button"
          onClick={addFrontendItem}
        >
          + 프론트엔드 추가
        </button>
      </div>
    </div>
  );
}
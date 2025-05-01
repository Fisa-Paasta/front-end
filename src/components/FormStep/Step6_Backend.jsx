// src/components/FormStep/Step6_Backend.jsx
import { useSurvey } from '@/context/SurveyContext';
import { useState, useEffect } from 'react';

export default function Step6_Backend() {
  const { formData, updateFormData } = useSurvey();
  
  const backendLanguages = [
    "java",
    "nodejs",
    "python",
    "go",
    "ruby"
  ];
  
  const backendFrameworks = {
    "java": [
      "spring_boot",
      "quarkus",
      "micronaut"
    ],
    "nodejs": [
      "express",
      "nestjs",
      "fastify"
    ],
    "python": [
      "django",
      "fastapi",
      "flask"
    ],
    "go": [
      "gin",
      "echo",
      "fiber"
    ],
    "ruby": [
      "rails"
    ]
  };
  
  const frameworkVersions = {
    "spring_boot": ["2.7.x", "3.2.x"],
    "quarkus": ["3.x"],
    "micronaut": ["4.x"],
    "express": ["4.x"],
    "nestjs": ["10.x"],
    "fastify": ["4.x"],
    "django": ["4.2.x", "5.0.x"],
    "fastapi": ["0.104.x"],
    "flask": ["2.3.x"],
    "gin": ["1.9.x"],
    "echo": ["4.x"],
    "fiber": ["2.x"],
    "rails": ["7.1.x"]
  };
  
  const frameworkNames = {
    "spring_boot": "Spring Boot",
    "quarkus": "Quarkus",
    "micronaut": "Micronaut",
    "express": "Express",
    "nestjs": "NestJS",
    "fastify": "Fastify",
    "django": "Django",
    "fastapi": "FastAPI",
    "flask": "Flask",
    "gin": "Gin",
    "echo": "Echo",
    "fiber": "Fiber",
    "rails": "Ruby on Rails"
  };

  // 로컬 상태 초기화 - 백엔드 항목의 배열로 관리
  const [backendItems, setBackendItems] = useState(() => {
    // formData에 기존 백엔드 항목이 있으면 그것을 사용, 없으면 빈 항목 하나 생성
    if (formData.backendItems && formData.backendItems.length > 0) {
      return formData.backendItems;
    }
    return [{ id: Date.now(), language: '', framework: '', version: '' }];
  });

  // 부모 폼 데이터 업데이트 - 로컬 상태가 변경될 때마다 호출
  useEffect(() => {
    updateFormData('backendItems', backendItems);
  }, [backendItems, updateFormData]);

  // 백엔드 항목 추가
  const addBackendItem = () => {
    setBackendItems([
      ...backendItems,
      { id: Date.now(), language: '', framework: '', version: '' }
    ]);
  };

  // 백엔드 항목 제거
  const removeBackendItem = (id) => {
    if (backendItems.length <= 1) return; // 항상 최소 하나는 유지
    setBackendItems(backendItems.filter(item => item.id !== id));
  };

  // 특정 항목의 필드 변경 처리
  const handleChange = (id, field, value) => {
    const updatedItems = backendItems.map(item => {
      if (item.id === id) {
        const newItem = { ...item, [field]: value };
        
        // 언어가 변경되면 프레임워크와 버전 초기화
        if (field === 'language') {
          newItem.framework = '';
          newItem.version = '';
        } 
        // 프레임워크가 변경되면 버전 초기화
        else if (field === 'framework') {
          newItem.version = '';
        }
        
        return newItem;
      }
      return item;
    });
    
    setBackendItems(updatedItems);
  };

  return (
    <div className="formbold-form-step">
      <label className="formbold-form-label">6. 백엔드</label>
      
      <div className="form-section">
        <h4>백엔드 프레임워크/언어</h4>
        
        <div className="item-list">
          {backendItems.map((item) => (
            <div key={item.id} className="item-row">
              <div style={{ flex: 1 }}>
                <select
                  className="formbold-form-input"
                  value={item.language || ''}
                  onChange={(e) => handleChange(item.id, 'language', e.target.value)}
                >
                  <option value="">언어 선택</option>
                  {backendLanguages.map(lang => (
                    <option key={lang} value={lang}>
                      {lang.charAt(0).toUpperCase() + lang.slice(1)}
                    </option>
                  ))}
                </select>
                
                {item.language && (
                  <>
                    <select
                      className="formbold-form-input"
                      value={item.framework || ''}
                      onChange={(e) => handleChange(item.id, 'framework', e.target.value)}
                    >
                      <option value="">프레임워크 선택</option>
                      {backendFrameworks[item.language]?.map(framework => (
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
                        {frameworkVersions[item.framework]?.map(version => (
                          <option key={version} value={version}>{version}</option>
                        ))}
                      </select>
                    )}
                  </>
                )}
              </div>
              
              <button 
                type="button" 
                className="remove-button"
                onClick={() => removeBackendItem(item.id)}
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
          onClick={addBackendItem}
        >
          + 백엔드 추가
        </button>
      </div>
    </div>
  );
}
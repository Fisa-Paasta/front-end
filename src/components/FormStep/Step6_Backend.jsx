// src/components/FormStep/Step6_Backend.jsx
import { useSurvey } from '@/context/SurveyContext';
import { useState, useEffect } from 'react';

export default function Step6_Backend() {
  const { formData, updateFormData } = useSurvey();
  
  // Backend languages and their versions
  const backendLanguages = [
    "java",
    "nodejs",
    "python",
    "go",
    "ruby"
  ];

  // Language versions
  const languageVersions = {
    "java": ["JDK 11 (LTS)", "JDK 17 (LTS)", "JDK 21 (LTS)"],
    "nodejs": ["v20 (Maintenance)", "v22 (LTS)", "v23 (Maintenance)"],
    "python": ["3.10", "3.11", "3.12"],
    "go": ["1.23.9", "1.24.3"],
    "ruby": ["3.2.8", "3.3.8", "3.4.3"]
  };
  
  // Backend frameworks
  const backendFrameworks = {
    "java": [
      "spring_boot"
    ],
    "nodejs": [
      "express",
      "nestjs"
    ],
    "python": [
      "django",
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
  
  // Framework versions
  const frameworkVersions = {
    "spring_boot": ["3.1.2", "3.3.3", "3.4.4"],
    "express": ["4.18.2", "4.21.2", "5.1.0"],
    "nestjs": ["11.0.13", "11.0.21", "11.1.0"],
    "django": ["5.0.1", "4.2.10", "3.2.23"],
    "flask": ["2.1.0", "2.3.0", "3.1.0"],
    "fiber": ["2.52.6", "2.52.5", "2.52.4"],
    "rails": ["4.2", "5.2", "6.1"]
  };
  
  // Display names for frameworks
  const frameworkNames = {
    "spring_boot": "Spring Boot",
    "express": "Express",
    "nestjs": "NestJS",
    "django": "Django",
    "flask": "Flask",
    "fiber": "Fiber",
    "rails": "Ruby on Rails"
  };

  // Local state for backend items
  const [backendItems, setBackendItems] = useState(() => {
    // Use existing data or initialize with empty item
    if (formData.backendItems && formData.backendItems.length > 0) {
      return formData.backendItems;
    }
    return [{ id: Date.now(), language: '', languageVersion: '', framework: '', frameworkVersion: '' }];
  });

  // Update parent form data when local state changes
  useEffect(() => {
    updateFormData('backendItems', backendItems);
  }, [backendItems, updateFormData]);

  // Add backend item
  const addBackendItem = () => {
    setBackendItems([
      ...backendItems,
      { id: Date.now(), language: '', languageVersion: '', framework: '', frameworkVersion: '' }
    ]);
  };

  // Remove backend item
  const removeBackendItem = (id) => {
    if (backendItems.length <= 1) return; // Always keep at least one item
    setBackendItems(backendItems.filter(item => item.id !== id));
  };

  // Handle field changes
  const handleChange = (id, field, value) => {
    const updatedItems = backendItems.map(item => {
      if (item.id === id) {
        const newItem = { ...item, [field]: value };
        
        // Reset dependent fields when parent fields change
        if (field === 'language') {
          newItem.languageVersion = '';
          newItem.framework = '';
          newItem.frameworkVersion = '';
        } 
        else if (field === 'framework') {
          newItem.frameworkVersion = '';
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
                {/* Language selection */}
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
                
                {/* Language version selection */}
                {item.language && (
                  <select
                    className="formbold-form-input"
                    value={item.languageVersion || ''}
                    onChange={(e) => handleChange(item.id, 'languageVersion', e.target.value)}
                  >
                    <option value="">언어 버전 선택</option>
                    {languageVersions[item.language]?.map(version => (
                      <option key={version} value={version}>{version}</option>
                    ))}
                  </select>
                )}
                
                {/* Framework selection */}
                {item.language && (
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
                )}
                
                {/* Framework version selection */}
                {item.framework && (
                  <select
                    className="formbold-form-input"
                    value={item.frameworkVersion || ''}
                    onChange={(e) => handleChange(item.id, 'frameworkVersion', e.target.value)}
                  >
                    <option value="">프레임워크 버전 선택</option>
                    {frameworkVersions[item.framework]?.map(version => (
                      <option key={version} value={version}>{version}</option>
                    ))}
                  </select>
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
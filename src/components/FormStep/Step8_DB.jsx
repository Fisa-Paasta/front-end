// src/components/FormStep/Step8_DB.jsx
import { useSurvey } from '@/context/SurveyContext';
import { useState, useEffect } from 'react';

export default function Step8_DB() {
  const { formData, updateFormData } = useSurvey();
  
  const dbTypes = [
    { value: "relational", label: "관계형 DB" },
    { value: "nosql", label: "NoSQL DB" },
    { value: "newsql", label: "NewSQL" }
  ];
  
  const dbOptions = {
    "relational": [
      "mysql",
      "postgresql",
      "mariadb",
      "oracle"
    ],
    "nosql": [
      "mongodb",
      "redis",
      "elasticsearch",
      "cassandra"
    ],
    "newsql": [
      "cockroachdb",
      "cloud_spanner"
    ]
  };
  
  const dbNames = {
    "mysql": "MySQL",
    "postgresql": "PostgreSQL",
    "mariadb": "MariaDB",
    "oracle": "Oracle Database",
    "mongodb": "MongoDB",
    "redis": "Redis",
    "elasticsearch": "Elasticsearch",
    "cassandra": "Cassandra",
    "cockroachdb": "CockroachDB",
    "cloud_spanner": "Google Cloud Spanner"
  };
  
  const dbVersions = {
    "mysql": ["8.0.x"],
    "postgresql": ["16.x"],
    "mariadb": ["11.x"],
    "oracle": ["19c", "21c"],
    "mongodb": ["7.0.x"],
    "redis": ["7.2.x"],
    "elasticsearch": ["8.x"],
    "cassandra": ["4.1.x"],
    "cockroachdb": ["23.1.x"],
    "cloud_spanner": ["Latest"]
  };

  // 로컬 상태 초기화 - DB 항목의 배열로 관리
  const [dbItems, setDbItems] = useState(() => {
    // formData에 기존 DB 항목이 있으면 그것을 사용, 없으면 빈 항목 하나 생성
    if (formData.dbItems && formData.dbItems.length > 0) {
      return formData.dbItems;
    }
    return [{ id: Date.now(), type: '', name: '', version: '', size: '' }];
  });

  // 부모 폼 데이터 업데이트 - 로컬 상태가 변경될 때마다 호출
  useEffect(() => {
    updateFormData('dbItems', dbItems);
  }, [dbItems, updateFormData]);

  // DB 항목 추가
  const addDbItem = () => {
    setDbItems([
      ...dbItems,
      { id: Date.now(), type: '', name: '', version: '', size: '' }
    ]);
  };

  // DB 항목 제거
  const removeDbItem = (id) => {
    if (dbItems.length <= 1) return; // 항상 최소 하나는 유지
    setDbItems(dbItems.filter(item => item.id !== id));
  };

  // 특정 항목의 필드 변경 처리
  const handleChange = (id, field, value) => {
    const updatedItems = dbItems.map(item => {
      if (item.id === id) {
        const newItem = { ...item, [field]: value };
        
        // 의존성에 따른 필드 초기화
        if (field === 'type') {
          newItem.name = '';
          newItem.version = '';
        } else if (field === 'name') {
          newItem.version = '';
        }
        
        return newItem;
      }
      return item;
    });
    
    setDbItems(updatedItems);
  };

  return (
    <div className="formbold-form-step">
      <label className="formbold-form-label">8. 데이터베이스</label>
      
      <div className="form-section">
        <h4>데이터베이스</h4>
        
        <div className="item-list">
          {dbItems.map((item) => (
            <div key={item.id} className="item-row">
              <div style={{ flex: 1 }}>
                <select
                  className="formbold-form-input"
                  value={item.type || ''}
                  onChange={(e) => handleChange(item.id, 'type', e.target.value)}
                >
                  <option value="">DB 타입 선택</option>
                  {dbTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
                
                {item.type && (
                  <>
                    <select
                      className="formbold-form-input"
                      value={item.name || ''}
                      onChange={(e) => handleChange(item.id, 'name', e.target.value)}
                    >
                      <option value="">DB 선택</option>
                      {dbOptions[item.type]?.map(db => (
                        <option key={db} value={db}>{dbNames[db]}</option>
                      ))}
                    </select>
                    
                    {item.name && (
                      <>
                        <select
                          className="formbold-form-input"
                          value={item.version || ''}
                          onChange={(e) => handleChange(item.id, 'version', e.target.value)}
                        >
                          <option value="">버전 선택</option>
                          {dbVersions[item.name]?.map(version => (
                            <option key={version} value={version}>{version}</option>
                          ))}
                        </select>
                        
                        <div className="formbold-input-with-unit">
                          <input
                            type="number"
                            className="formbold-form-input"
                            placeholder="DB Size"
                            value={item.size || ''}
                            onChange={(e) => handleChange(item.id, 'size', e.target.value)}
                          />
                          <span className="unit">GB</span>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
              
              <button 
                type="button" 
                className="remove-button"
                onClick={() => removeDbItem(item.id)}
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
          onClick={addDbItem}
        >
          + 데이터베이스 추가
        </button>
      </div>
    </div>
  );
}
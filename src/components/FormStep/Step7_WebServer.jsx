// src/components/FormStep/Step7_WebServer.jsx
import { useSurvey } from '@/context/SurveyContext';
import { useState, useEffect } from 'react';

export default function Step7_WebServer() {
  const { formData, updateFormData } = useSurvey();
  
  // Updated web server options with latest versions
  const webServerOptions = {
    "nginx": ["1.28.0 (LTS)", "1.27.5"],
    "apache": ["2.4.63 (Latest)", "2.4.0"],
    "tomcat": ["11.0", "10.1", "9.0"]
  };
  
  const serverDisplayNames = {
    "nginx": "Nginx",
    "apache": "Apache HTTP Server",
    "tomcat": "Tomcat"
  };

  // 로컬 상태 초기화 - 웹서버 항목의 배열로 관리
  const [webServerItems, setWebServerItems] = useState(() => {
    // formData에 기존 웹서버 항목이 있으면 그것을 사용, 없으면 빈 항목 하나 생성
    if (formData.webServerItems && formData.webServerItems.length > 0) {
      return formData.webServerItems;
    }
    return [{ id: Date.now(), server: '', version: '' }];
  });

  // 부모 폼 데이터 업데이트 - 로컬 상태가 변경될 때마다 호출
  useEffect(() => {
    updateFormData('webServerItems', webServerItems);
  }, [webServerItems, updateFormData]);

  // 웹서버 항목 추가
  const addWebServerItem = () => {
    setWebServerItems([
      ...webServerItems,
      { id: Date.now(), server: '', version: '' }
    ]);
  };

  // 웹서버 항목 제거
  const removeWebServerItem = (id) => {
    if (webServerItems.length <= 1) return; // 항상 최소 하나는 유지
    setWebServerItems(webServerItems.filter(item => item.id !== id));
  };

  // 특정 항목의 필드 변경 처리
  const handleChange = (id, field, value) => {
    const updatedItems = webServerItems.map(item => {
      if (item.id === id) {
        const newItem = { ...item, [field]: value };
        
        // 서버가 변경되면 버전 초기화
        if (field === 'server') {
          newItem.version = '';
        }
        
        return newItem;
      }
      return item;
    });
    
    setWebServerItems(updatedItems);
  };

  return (
    <div className="formbold-form-step">
      <label className="formbold-form-label">7. 웹 서버 / WAS</label>
      
      <div className="form-section">
        <h4>웹 서버 / WAS</h4>
        
        <div className="item-list">
          {webServerItems.map((item) => (
            <div key={item.id} className="item-row">
              <div style={{ flex: 1 }}>
                <select
                  className="formbold-form-input"
                  value={item.server || ''}
                  onChange={(e) => handleChange(item.id, 'server', e.target.value)}
                >
                  <option value="">서버 선택</option>
                  {Object.keys(webServerOptions).map(server => (
                    <option key={server} value={server}>
                      {serverDisplayNames[server]}
                    </option>
                  ))}
                </select>
                
                {item.server && (
                  <select
                    className="formbold-form-input"
                    value={item.version || ''}
                    onChange={(e) => handleChange(item.id, 'version', e.target.value)}
                  >
                    <option value="">버전 선택</option>
                    {webServerOptions[item.server]?.map(version => (
                      <option key={version} value={version}>{version}</option>
                    ))}
                  </select>
                )}
              </div>
              
              <button 
                type="button" 
                className="remove-button"
                onClick={() => removeWebServerItem(item.id)}
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
          onClick={addWebServerItem}
        >
          + 웹서버 추가
        </button>
      </div>
    </div>
  );
}
import { useSurvey } from '@/context/SurveyContext';
import { useState, useEffect } from 'react';
import { WebServerItem, WebServerType } from '@/types/survey';

type ValidWebServerType = Exclude<WebServerType, ''>;

export default function Step7_WebServer() {
  const { formData, updateFormData } = useSurvey();

  const webServerOptions: Record<ValidWebServerType, string[]> = {
    nginx: ['1.28.0 (LTS)', '1.27.5'],
    apache: ['2.4.63 (Latest)', '2.4.0'],
    tomcat: ['11.0', '10.1', '9.0']
  };

  const serverDisplayNames: Record<ValidWebServerType, string> = {
    nginx: 'Nginx',
    apache: 'Apache HTTP Server',
    tomcat: 'Tomcat'
  };

  const [webServerItems, setWebServerItems] = useState<WebServerItem[]>(() =>
    formData.webServerItems?.length
      ? formData.webServerItems
      : [{ id: Date.now(), server: '', version: '' }]
  );

  useEffect(() => {
    updateFormData('webServerItems', webServerItems);
  }, [webServerItems]);

  const addWebServerItem = () => {
    setWebServerItems((prev) => [
      ...prev,
      { id: Date.now(), server: '', version: '' }
    ]);
  };

  const removeWebServerItem = (id: number) => {
    if (webServerItems.length <= 1) return;
    setWebServerItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleChange = (
    id: number,
    field: keyof WebServerItem,
    value: string
  ) => {
    setWebServerItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          if (field === 'server') updated.version = '';
          return updated;
        }
        return item;
      })
    );
  };

  return (
    <div className="space-y-4">
      {webServerItems.map((item) => (
        <div
          key={item.id}
          className="flex gap-4 items-center bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-sm"
        >
          <div className="flex-1 space-y-2">
            <select
              value={item.server}
              onChange={(e) => handleChange(item.id, 'server', e.target.value)}
              className="w-full px-3 py-2 border rounded-md bg-white dark:bg-input-dark dark:text-white"
            >
              <option value="">서버 선택</option>
              {(Object.keys(webServerOptions) as ValidWebServerType[]).map((server) => (
                <option key={server} value={server}>
                  {serverDisplayNames[server]}
                </option>
              ))}
            </select>

            {item.server && (
              <select
                value={item.version}
                onChange={(e) => handleChange(item.id, 'version', e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-white dark:bg-input-dark dark:text-white"
              >
                <option value="">버전 선택</option>
                {(webServerOptions[item.server as ValidWebServerType] || []).map((version) => (
                  <option key={version} value={version}>
                    {version}
                  </option>
                ))}
              </select>
            )}
          </div>

          <button
            type="button"
            onClick={() => removeWebServerItem(item.id)}
            className="text-red-500 text-xl hover:text-red-700"
            title="항목 제거"
          >
            ×
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addWebServerItem}
        className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-md transition"
      >
        + 웹서버 추가
      </button>
    </div>
  );
}

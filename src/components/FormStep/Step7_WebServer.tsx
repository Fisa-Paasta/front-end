import { useSurvey } from '@/context/SurveyContext';
import { useState, useEffect } from 'react';
import { WebServerItem, WebServerType } from '@/types/survey';

type ValidWebServerType = Exclude<WebServerType, ''>;

const serverCards: { name: ValidWebServerType; label: string; src: string }[] = [
  { name: 'nginx', label: 'Nginx', src: '/img/webserver/nginx.svg' },
  { name: 'apache', label: 'Apache HTTP Server', src: '/img/webserver/apache.svg' },
  { name: 'tomcat', label: 'Tomcat', src: '/img/webserver/tomcat.svg' }
];

const webServerOptions: Record<ValidWebServerType, string[]> = {
  nginx: ['1.28.0 (LTS)', '1.27.5'],
  apache: ['2.4.63 (Latest)', '2.4.0'],
  tomcat: ['11.0', '10.1', '9.0']
};

export default function Step7_WebServer() {
  const { formData, updateFormData } = useSurvey();

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

  const handleServerClick = (itemId: number, serverName: string) => {
    const item = webServerItems.find(item => item.id === itemId);
    const newValue = item?.server === serverName ? '' : serverName;
    handleChange(itemId, 'server', newValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent, itemId: number, serverName: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleServerClick(itemId, serverName);
    }
  };

  return (
    <div className="space-y-4">
      {webServerItems.map((item) => (
        <div
          key={item.id}
          className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm space-y-4"
        >
          {/* 서버 선택 카드 - 접근성 개선 */}
          <fieldset className="grid grid-cols-3 gap-4">
            <legend className="sr-only">웹서버 선택</legend>
            {serverCards.map((server) => {
              const isSelected = item.server === server.name;
              return (
                <button
                  key={server.name}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  aria-label={`${server.label} 선택`}
                  className={`p-3 rounded-lg border-2 cursor-pointer text-center transition shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2
                    ${isSelected
                      ? 'border-violet-500 bg-violet-600 text-white'
                      : 'border-gray-300 bg-white hover:bg-gray-100 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white'}
                  `}
                  onClick={() => handleServerClick(item.id, server.name)}
                  onKeyDown={(e) => handleKeyDown(e, item.id, server.name)}
                  tabIndex={0}
                >
                  <img
                    src={server.src}
                    alt=""
                    className="h-14 mx-auto object-contain mb-2"
                  />
                  <p className="text-sm font-semibold">{server.label}</p>
                </button>
              );
            })}
          </fieldset>

          {/* 버전 선택 */}
          {item.server && (
            <div>
              <label htmlFor={`version-select-${item.id}`} className="block mb-1 text-sm font-medium">
                {item.server} 버전 선택
              </label>
              <select
                id={`version-select-${item.id}`}
                value={item.version}
                onChange={(e) => handleChange(item.id, 'version', e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-white dark:bg-input-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                aria-label={`${item.server} 버전 선택`}
              >
                <option value="">버전 선택</option>
                {(webServerOptions[item.server as ValidWebServerType] || []).map((ver) => (
                  <option key={ver} value={ver}>{ver}</option>
                ))}
              </select>
            </div>
          )}

          {/* 제거 버튼 */}
          {webServerItems.length > 1 && (
            <button
              type="button"
              onClick={() => removeWebServerItem(item.id)}
              className="text-red-500 text-xl hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
              title="항목 제거"
              aria-label={`웹서버 항목 삭제`}
            >
              ×
            </button>
          )}
        </div>
      ))}

      {/* 추가 버튼 */}
      <button
        type="button"
        onClick={addWebServerItem}
        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition focus:outline-none focus:ring-2 focus:ring-purple-500"
        aria-label="새 웹서버 항목 추가"
      >
        + 웹서버 추가
      </button>
    </div>
  );
}
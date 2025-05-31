import { useSurvey } from '@/context/SurveyContext';
import { useState, useEffect } from 'react';
import { DBItem, DBType, DBName } from '@/types/survey';

type ValidDBType = Exclude<DBType, ''>;

const dbTypeCards: { value: ValidDBType; label: string }[] = [
  { value: 'relational', label: 'Relational DB' },
  { value: 'nosql', label: 'NoSQL DB' }
];

const dbOptions: Record<ValidDBType, DBName[]> = {
  relational: ['mysql', 'postgresql', 'mariadb', 'oracle'],
  nosql: ['mongodb', 'redis', 'elasticsearch', 'cassandra'],
};

const dbLabels: Record<DBName, string> = {
  mysql: 'MySQL',
  postgresql: 'PostgreSQL',
  mariadb: 'MariaDB',
  oracle: 'Oracle Database',
  mongodb: 'MongoDB',
  redis: 'Redis',
  elasticsearch: 'Elasticsearch',
  cassandra: 'Cassandra',
};

const dbImages: Record<DBName, string> = {
  mysql: '/img/db/mysql.svg',
  postgresql: '/img/db/postgresql.svg',
  mariadb: '/img/db/maria.svg',
  oracle: '/img/db/oracle.svg',
  mongodb: '/img/db/mongo.svg',
  redis: '/img/db/redis.svg',
  elasticsearch: '/img/db/elasticsearch.svg',
  cassandra: '/img/db/cassandra.svg',
};

const dbVersions: Record<DBName, string[]> = {
  mysql: ['8.4.0', '8.0.36 (LTS)', '5.7.44 (Legacy)'],
  postgresql: ['16.1', '15.5', '14.10'],
  mariadb: ['11.2.2', '10.11.6 (LTS)', '10.6.17 (LTS)'],
  oracle: ['23c (Free)', '21c', '19c (LTS)'],
  mongodb: ['7.0.5', '6.0.12', '5.0.23'],
  redis: ['7.2.4', '7.0.14', '6.2.14'],
  elasticsearch: ['8.12.1', '8.11.4', '7.17.16'],
  cassandra: ['4.1.3', '4.0.12', '3.11.16'],
};

export default function Step8_DB() {
  const { formData, updateFormData } = useSurvey();

  const [dbItems, setDbItems] = useState<DBItem[]>(() =>
    formData.dbItems?.length
      ? formData.dbItems
      : [{ id: Date.now(), type: '', name: '', version: '', size: '' }]
  );

  const [errors, setErrors] = useState<Record<string, Record<string, boolean>>>({});

  useEffect(() => {
    updateFormData('dbItems', dbItems);
  }, [dbItems]);

  const addDbItem = () => {
    setDbItems((prev) => [
      ...prev,
      { id: Date.now(), type: '', name: '', version: '', size: '' }
    ]);
  };

  const removeDbItem = (id: number) => {
    if (dbItems.length <= 1) return;
    setDbItems((prev) => prev.filter((item) => item.id !== id));
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy[id.toString()];
      return copy;
    });
  };

  const validateField = (field: keyof DBItem, value: string): boolean => {
    if (field === 'size') {
      const n = parseInt(value, 10);
      return !isNaN(n) && n > 0;
    }
    return !!value;
  };

  const handleChange = (id: number, field: keyof DBItem, value: string) => {
    const idStr = id.toString();
    const isValid = validateField(field, value);

    setErrors((prev) => ({
      ...prev,
      [idStr]: { ...prev[idStr], [field]: !isValid }
    }));

    setDbItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const updated = { ...item, [field]: value };
        if (field === 'type') {
          updated.name = '';
          updated.version = '';
        } else if (field === 'name') {
          updated.version = '';
        }
        return updated;
      })
    );
  };

  const handleTypeClick = (itemId: number, dbType: string) => {
    const item = dbItems.find(item => item.id === itemId);
    const newValue = item?.type === dbType ? '' : dbType;
    handleChange(itemId, 'type', newValue);
  };

  const handleDBClick = (itemId: number, dbName: string) => {
    const item = dbItems.find(item => item.id === itemId);
    const newValue = item?.name === dbName ? '' : dbName;
    handleChange(itemId, 'name', newValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent, callback: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      callback();
    }
  };

  const hasError = (id: number, field: keyof DBItem) =>
    errors[id?.toString()]?.[field] === true;

  return (
    <div className="space-y-4">
      {dbItems.map((item) => (
        <div
          key={item.id}
          className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm space-y-4"
        >
          {/* DB 타입 선택 카드 - 접근성 개선 */}
          <fieldset className="grid grid-cols-2 gap-4">
            <legend className="sr-only">데이터베이스 타입 선택</legend>
            {dbTypeCards.map((type) => {
              const isSelected = item.type === type.value;
              return (
                <button
                  key={type.value}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  aria-label={`${type.label} 선택`}
                  className={`p-3 rounded-md border-2 text-center cursor-pointer transition shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2
                    ${isSelected
                      ? 'border-violet-500 bg-violet-600 text-white'
                      : 'border-gray-300 bg-white hover:bg-gray-100 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white'}
                  `}
                  onClick={() => handleTypeClick(item.id, type.value)}
                  onKeyDown={(e) => handleKeyDown(e, () => handleTypeClick(item.id, type.value))}
                  tabIndex={0}
                >
                  <p className="text-sm font-semibold">{type.label}</p>
                </button>
              );
            })}
          </fieldset>

          {/* DB 종류 선택 카드 - 접근성 개선 */}
          {item.type && (
            <fieldset className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <legend className="sr-only">{item.type} 데이터베이스 선택</legend>
              {dbOptions[item.type as ValidDBType].map((db) => {
                const isSelected = item.name === db;
                return (
                  <button
                    key={db}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    aria-label={`${dbLabels[db]} 선택`}
                    className={`p-3 rounded-md border-2 text-center cursor-pointer transition shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2
                      ${isSelected
                        ? 'border-violet-500 bg-violet-600 text-white'
                        : 'border-gray-300 bg-white hover:bg-gray-100 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white'}
                    `}
                    onClick={() => handleDBClick(item.id, db)}
                    onKeyDown={(e) => handleKeyDown(e, () => handleDBClick(item.id, db))}
                    tabIndex={0}
                  >
                    <img
                      src={dbImages[db]}
                      alt=""
                      className="h-14 mx-auto object-contain mb-2"
                    />
                    <p className="text-sm font-semibold">{dbLabels[db]}</p>
                  </button>
                );
              })}
            </fieldset>
          )}

          {/* 버전 & 사이즈 입력 */}
          {item.name && (
            <div className="space-y-2">
              <div>
                <label htmlFor={`db-version-select-${item.id}`} className="block mb-1 text-sm font-medium">
                  {dbLabels[item.name as DBName]} 버전 선택
                </label>
                <select
                  id={`db-version-select-${item.id}`}
                  value={item.version}
                  onChange={(e) => handleChange(item.id, 'version', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-input-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                    hasError(item.id, 'version') ? 'border-red-500' : ''
                  }`}
                  aria-describedby={hasError(item.id, 'version') ? `version-error-${item.id}` : undefined}
                >
                  <option value="">버전 선택</option>
                  {dbVersions[item.name as DBName].map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
                {hasError(item.id, 'version') && (
                  <p id={`version-error-${item.id}`} className="text-red-500 text-xs mt-1" role="alert">
                    버전을 선택해주세요.
                  </p>
                )}
              </div>

              <div>
                <label htmlFor={`db-size-input-${item.id}`} className="block mb-1 text-sm font-medium">
                  DB 크기 (GB)
                </label>
                <input
                  id={`db-size-input-${item.id}`}
                  type="number"
                  min="1"
                  value={item.size}
                  onChange={(e) => handleChange(item.id, 'size', e.target.value)}
                  placeholder="DB Size (GB)"
                  className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-input-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                    hasError(item.id, 'size') ? 'border-red-500' : ''
                  }`}
                  aria-describedby={hasError(item.id, 'size') ? `size-error-${item.id}` : undefined}
                />
                {hasError(item.id, 'size') && (
                  <p id={`size-error-${item.id}`} className="text-red-500 text-xs mt-1" role="alert">
                    유효한 크기를 입력해주세요.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* 삭제 버튼 */}
          {dbItems.length > 1 && (
            <button
              type="button"
              onClick={() => removeDbItem(item.id)}
              className="text-red-600 text-xl hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
              aria-label="데이터베이스 항목 삭제"
            >
              ×
            </button>
          )}
        </div>
      ))}

      {/* 추가 버튼 */}
      <button
        type="button"
        onClick={addDbItem}
        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition focus:outline-none focus:ring-2 focus:ring-purple-500"
        aria-label="새 데이터베이스 항목 추가"
      >
        + 데이터베이스 추가
      </button>
    </div>
  );
}
import { useSurvey } from '@/context/SurveyContext';
import { useState, useEffect } from 'react';
import { DBItem, DBType, DBName } from '@/types/survey';

type ValidDBType = Exclude<DBType, ''>;

export default function Step8_DB() {
  const { formData, updateFormData } = useSurvey();

  const dbTypes: { value: ValidDBType, label: string }[] = [
    { value: 'relational', label: '관계형 DB' },
    { value: 'nosql', label: 'NoSQL DB' }
  ];

  const dbOptions: Record<ValidDBType, DBName[]> = {
    relational: ['mysql', 'postgresql', 'mariadb', 'oracle'],
    nosql: ['mongodb', 'redis', 'elasticsearch', 'cassandra']
  };

  const dbNames: Record<DBName, string> = {
    mysql: 'MySQL',
    postgresql: 'PostgreSQL',
    mariadb: 'MariaDB',
    oracle: 'Oracle Database',
    mongodb: 'MongoDB',
    redis: 'Redis',
    elasticsearch: 'Elasticsearch',
    cassandra: 'Cassandra'
  };

  const dbVersions: Record<DBName, string[]> = {
    mysql: ['8.4.0', '8.0.36 (LTS)', '5.7.44 (Legacy)'],
    postgresql: ['16.1', '15.5', '14.10'],
    mariadb: ['11.2.2', '10.11.6 (LTS)', '10.6.17 (LTS)'],
    oracle: ['23c (Free)', '21c', '19c (LTS)'],
    mongodb: ['7.0.5', '6.0.12', '5.0.23'],
    redis: ['7.2.4', '7.0.14', '6.2.14'],
    elasticsearch: ['8.12.1', '8.11.4', '7.17.16'],
    cassandra: ['4.1.3', '4.0.12', '3.11.16']
  };

  const [dbItems, setDbItems] = useState<DBItem[]>(() =>
    formData.dbItems?.length
      ? formData.dbItems
      : [{ id: Date.now(), type: '', name: '', version: '', size: '' }]
  );

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
  };

  const handleChange = (id: number, field: keyof DBItem, value: string) => {
    setDbItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          if (field === 'type') {
            updated.name = '';
            updated.version = '';
          } else if (field === 'name') {
            updated.version = '';
          }
          return updated;
        }
        return item;
      })
    );
  };

  return (
    <div className="space-y-4">
      {dbItems.map((item) => (
        <div key={item.id} className="flex gap-4 items-center bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <div className="flex-1 space-y-2">
            {/* DB 타입 선택 */}
            <select
              value={item.type}
              onChange={(e) => handleChange(item.id, 'type', e.target.value)}
              className="w-full px-3 py-2 border rounded-md bg-white dark:bg-input-dark dark:text-white"
            >
              <option value="">DB 타입 선택</option>
              {dbTypes.map((type) => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>

            {/* DB 이름 선택 */}
            {item.type && (
              <>
                <select
                  value={item.name}
                  onChange={(e) => handleChange(item.id, 'name', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md bg-white dark:bg-input-dark dark:text-white"
                >
                  <option value="">DB 선택</option>
                  {dbOptions[item.type as ValidDBType].map((db) => (
                    <option key={db} value={db}>{dbNames[db]}</option>
                  ))}
                </select>

                {/* 버전 및 사이즈 */}
                {item.name && (
                  <>
                    <select
                      value={item.version}
                      onChange={(e) => handleChange(item.id, 'version', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md bg-white dark:bg-input-dark dark:text-white"
                    >
                      <option value="">버전 선택</option>
                      {dbVersions[item.name as DBName].map((v) => (
                        <option key={v} value={v}>{v}</option>
                      ))}
                    </select>

                    <input
                      type="number"
                      placeholder="DB Size (GB)"
                      value={item.size}
                      onChange={(e) => handleChange(item.id, 'size', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md bg-white dark:bg-input-dark dark:text-white"
                    />
                  </>
                )}
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => removeDbItem(item.id)}
            className="text-red-500 text-xl hover:text-red-700"
            title="항목 제거"
          >
            ×
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addDbItem}
        className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-md transition"
      >
        + 데이터베이스 추가
      </button>
    </div>
  );
}

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

// 검증 함수 분리
const validateField = (field: keyof DBItem, value: string): boolean => {
  if (field === 'size') {
    const n = parseInt(value, 10);
    return !isNaN(n) && n > 0;
  }
  return !!value;
};

// 아이템 업데이트 함수 분리
const createUpdatedItem = (item: DBItem, field: keyof DBItem, value: string): DBItem => {
  const updated = { ...item, [field]: value };
  
  if (field === 'type') {
    updated.name = '';
    updated.version = '';
  } else if (field === 'name') {
    updated.version = '';
  }
  
  return updated;
};

// 에러 체크 함수 분리
const hasError = (errors: Record<string, Record<string, boolean>>, id: number, field: keyof DBItem): boolean => {
  return errors[id?.toString()]?.[field] === true;
};

// DB 타입 섹션 컴포넌트
interface DBTypeSectionProps {
  item: DBItem;
  onTypeChange: (id: number, value: string) => void;
}

const DBTypeSection = ({ item, onTypeChange }: DBTypeSectionProps) => (
  <div className="space-y-2">
    <fieldset>
      <legend className="text-sm font-medium mb-2">데이터베이스 타입 선택</legend>
      <div className="grid grid-cols-2 gap-4">
        {dbTypeCards.map((type) => (
          <div key={type.value}>
            <input
              type="radio"
              id={`db-type-${item.id}-${type.value}`}
              name={`db-type-${item.id}`}
              value={type.value}
              checked={item.type === type.value}
              onChange={(e) => onTypeChange(item.id, e.target.value)}
              className="sr-only"
            />
            <label
              htmlFor={`db-type-${item.id}-${type.value}`}
              className={`p-3 rounded-md border-2 text-center cursor-pointer transition shadow-sm block
                ${item.type === type.value
                  ? 'border-violet-500 bg-violet-600 text-white'
                  : 'border-gray-300 bg-white hover:bg-gray-100 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white'}
              `}
            >
              <span className="text-sm font-semibold">{type.label}</span>
            </label>
          </div>
        ))}
      </div>
    </fieldset>
  </div>
);

// DB 선택 섹션 컴포넌트
interface DBSelectionSectionProps {
  item: DBItem;
  onNameChange: (id: number, value: string) => void;
}

const DBSelectionSection = ({ item, onNameChange }: DBSelectionSectionProps) => {
  if (!item.type) return null;
  
  const availableDBs = dbOptions[item.type as ValidDBType] ?? [];
  
  return (
    <div className="space-y-2">
      <fieldset>
        <legend className="text-sm font-medium mb-2">{item.type} 데이터베이스 선택</legend>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {availableDBs.map((db) => (
            <div key={db}>
              <input
                type="radio"
                id={`db-name-${item.id}-${db}`}
                name={`db-name-${item.id}`}
                value={db}
                checked={item.name === db}
                onChange={(e) => onNameChange(item.id, e.target.value)}
                className="sr-only"
              />
              <label
                htmlFor={`db-name-${item.id}-${db}`}
                className={`p-3 rounded-md border-2 text-center cursor-pointer transition shadow-sm block
                  ${item.name === db
                    ? 'border-violet-500 bg-violet-600 text-white'
                    : 'border-gray-300 bg-white hover:bg-gray-100 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white'}
                `}
              >
                <img
                  src={dbImages[db]}
                  alt={`${dbLabels[db]} 로고`}
                  className="h-14 mx-auto object-contain mb-2"
                />
                <span className="text-sm font-semibold">{dbLabels[db]}</span>
              </label>
            </div>
          ))}
        </div>
      </fieldset>
    </div>
  );
};

// 버전 및 크기 섹션 컴포넌트
interface VersionAndSizeSectionProps {
  item: DBItem;
  errors: Record<string, Record<string, boolean>>;
  onChange: (id: number, field: keyof DBItem, value: string) => void;
}

const VersionAndSizeSection = ({ item, errors, onChange }: VersionAndSizeSectionProps) => {
  if (!item.name) return null;
  
  const versions = dbVersions[item.name] ?? [];
  
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor={`db-version-select-${item.id}`} className="block mb-1 text-sm font-medium">
          {dbLabels[item.name] ?? ''} 버전 선택
        </label>
        <select
          id={`db-version-select-${item.id}`}
          value={item.version}
          onChange={(e) => onChange(item.id, 'version', e.target.value)}
          className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-input-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 ${
            hasError(errors, item.id, 'version') ? 'border-red-500' : ''
          }`}
          aria-describedby={hasError(errors, item.id, 'version') ? `version-error-${item.id}` : undefined}
        >
          <option value="">버전 선택</option>
          {versions.map((v) => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>
        {hasError(errors, item.id, 'version') && (
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
          onChange={(e) => onChange(item.id, 'size', e.target.value)}
          placeholder="DB Size (GB)"
          className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-input-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 ${
            hasError(errors, item.id, 'size') ? 'border-red-500' : ''
          }`}
          aria-describedby={hasError(errors, item.id, 'size') ? `size-error-${item.id}` : undefined}
        />
        {hasError(errors, item.id, 'size') && (
          <p id={`size-error-${item.id}`} className="text-red-500 text-xs mt-1" role="alert">
            유효한 크기를 입력해주세요.
          </p>
        )}
      </div>
    </div>
  );
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
  }, [dbItems, updateFormData]);

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

  const updateItemField = (id: number, field: keyof DBItem, value: string) => {
    setDbItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        return createUpdatedItem(item, field, value);
      })
    );
  };

  const handleChange = (id: number, field: keyof DBItem, value: string) => {
    const idStr = id.toString();
    const isValid = validateField(field, value);

    setErrors((prev) => ({
      ...prev,
      [idStr]: { ...prev[idStr], [field]: !isValid }
    }));

    updateItemField(id, field, value);
  };

  const handleTypeChange = (id: number, value: string) => {
    handleChange(id, 'type', value);
  };

  const handleNameChange = (id: number, value: string) => {
    handleChange(id, 'name', value);
  };

  return (
    <div className="space-y-4">
      {dbItems.map((item) => (
        <div
          key={`db-item-${item.id}`}
          className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm space-y-4"
        >
          <DBTypeSection item={item} onTypeChange={handleTypeChange} />
          <DBSelectionSection item={item} onNameChange={handleNameChange} />
          <VersionAndSizeSection item={item} errors={errors} onChange={handleChange} />

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
import { useSurvey } from '@/context/SurveyContext';

interface Props {
  onClose: () => void;
  onSubmit: () => void;
}

export default function InformationModal({ onClose, onSubmit }: Props) {
  const { formData } = useSurvey();

  const formatEnv = (env?: string) => {
    if (!env) return '-';
    const lowered = env.toLowerCase();
    return lowered === 'iaas' ? 'IaaS' : lowered === 'paas' ? 'PaaS' : env;
  };

  const formatName = (key?: string) => {
    if (!key) return '-';
    const mappings: Record<string, string> = {
      spring_boot: 'Spring Boot',
      express: 'Express',
      nestjs: 'NestJS',
      django: 'Django',
      flask: 'Flask',
      fiber: 'Fiber',
      rails: 'Ruby on Rails',
      gin: 'Gin',
      echo: 'Echo',
      react: 'React',
      vue: 'Vue.js',
      angular: 'Angular',
      nextjs: 'Next.js',
      github_actions: 'GitHub Actions',
      gitlab_ci: 'GitLab CI/CD',
      jenkins: 'Jenkins',
      nginx: 'Nginx',
      apache: 'Apache',
      tomcat: 'Tomcat',
      mysql: 'MySQL',
      postgresql: 'PostgreSQL',
      mariadb: 'MariaDB',
      oracle: 'Oracle',
      mongodb: 'MongoDB',
      redis: 'Redis',
      elasticsearch: 'Elasticsearch',
      cassandra: 'Cassandra'
    };
    return mappings[key] || key;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
      <div
        className="bg-panel-light dark:bg-panel-dark rounded-2xl p-6 w-full max-w-md shadow-2xl transition-colors duration-500 text-foreground-light dark:text-foreground-dark"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          📝 <span>신청 내용 확인</span>
        </h2>

        <div className="text-sm max-h-[60vh] overflow-y-auto pr-1">
          <div className="section-block">
            <strong>1. 환경:</strong> {formatEnv(formData.env)}
          </div>

          <div className="section-block">
            <strong>2. {formData.env === 'iaas' ? 'VM 구성' : 'Kubernetes'}:</strong>
            {formData.env === 'iaas' ? (
              <>
                <div className="ml-2">Hostname: {formData.vm.hostname || '-'}</div>
                <div className="ml-2">Username: {formData.vm.username || '-'}</div>
                <div className="ml-2">••• 비밀번호는 표시되지 않음</div>
              </>
            ) : (
              <>
                <div className="ml-2">Type: {formatName(formData.k8s?.type)}</div>
                <div className="ml-2">Node: {formData.k8s?.node || '-'}</div>
                <div className="ml-2">Namespace: {formData.k8s?.namespace || '-'}</div>
              </>
            )}
          </div>

          <div className="section-block">
            <strong>3. 자원:</strong>
            <div className="ml-2">CPU: {formData.resources.cpu} cores</div>
            <div className="ml-2">RAM: {formData.resources.ram} GB</div>
            <div className="ml-2">Disk: {formData.resources.disk} GB</div>
          </div>

          <div className="section-block">
            <strong>4. 운영체제:</strong>
            <div className="ml-2">{formatName(formData.os.name)} {formData.os.version}</div>
          </div>

          <div className="section-block">
            <strong>5. 프론트엔드:</strong>
            {formData.frontendItems.map((item, i) => (
              <div key={i} className="ml-2">
                {i + 1}. {formatName(item.framework)} {item.version}
              </div>
            ))}
            {formData.frontendDomain && (
              <div className="ml-2">도메인: {formData.frontendDomain}</div>
            )}
          </div>

          <div className="section-block">
            <strong>6. 백엔드:</strong>
            {formData.backendItems.map((item, i) => (
              <div key={i} className="ml-2">
                {i + 1}. {formatName(item.language)} {item.languageVersion} / {formatName(item.framework)} {item.frameworkVersion}
              </div>
            ))}
            {formData.apiDomain && (
              <div className="ml-2">API 도메인: {formData.apiDomain}</div>
            )}
            {formData.apiPaths?.length > 0 && formData.apiPaths.some((p) => p.trim()) && (
              <div className="ml-2">
                API 경로:
                <ul className="list-disc list-inside">
                  {formData.apiPaths.filter((p) => p.trim()).map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="section-block">
            <strong>7. 웹 서버:</strong>
            {formData.webServerItems.length === 0 ? (
              <div className="ml-2">선택 안 함</div>
            ) : (
              formData.webServerItems.map((item, i) => (
                <div key={i} className="ml-2">
                  {i + 1}. {formatName(item.server)} {item.version}
                </div>
              ))
            )}
          </div>

          <div className="section-block">
            <strong>8. DB:</strong>
            {formData.dbItems.map((item, i) => (
              <div key={i} className="ml-2">
                {i + 1}. {formatName(item.type)} / {formatName(item.name)} {item.version} ({item.size} GB)
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          >
            닫기
          </button>
          <button
            onClick={onSubmit}
            className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}

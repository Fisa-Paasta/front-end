import { useSurvey } from '@/context/SurveyContext';

export default function SidebarSummary() {
  const { formData, currentStep } = useSurvey();

  const formatEnv = (env: string | undefined) => {
    if (!env) return '-';
    return env === 'iaas' ? 'IaaS' : env === 'paas' ? 'PaaS' : env;
  };

  const formatName = (key: string | undefined) => {
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
      argocd: 'ArgoCD',
      jenkins: 'Jenkins',
      nginx: 'Nginx',
      apache: 'Apache HTTP Server',
      tomcat: 'Tomcat',
      mysql: 'MySQL',
      postgresql: 'PostgreSQL',
      mariadb: 'MariaDB',
      oracle: 'Oracle DB',
      mongodb: 'MongoDB',
      redis: 'Redis',
      elasticsearch: 'Elasticsearch',
      cassandra: 'Cassandra'
    };
    return mappings[key] || key;
  };

  return (
    <div className="sticky top-24 bg-panel-light dark:bg-panel-dark text-foreground-light dark:text-foreground-dark rounded-2xl p-6 border border-border-light dark:border-border-dark shadow-sm space-y-6 h-fit">
      <h2 className="text-lg font-semibold">🧾 현재 입력 항목</h2>

      <div className="text-sm space-y-4">
        {currentStep === 0 && (
          <SummaryItem label="1. 환경" value={formatEnv(formData.env)} />
        )}

        {currentStep === 1 && formData.env === 'paas' && (
          <SummaryItem label="2. Kubernetes">
            <div>Type: {formatName(formData.k8s.type)}</div>
            <div>Node: {formData.k8s.node || '0'}</div>
            <div>Namespace: {formData.k8s.namespace || '-'}</div>
          </SummaryItem>
        )}

        {currentStep === 1 && formData.env === 'iaas' && (
          <SummaryItem label="2. VM 구성">
            <div>Hostname: {formData.vm.hostname || '-'}</div>
            <div>Username: {formData.vm.username || '-'}</div>
            <div>••• 비밀번호는 표시되지 않음</div>
          </SummaryItem>
        )}

        {currentStep === 2 && (
          <SummaryItem label="3. 자원">
            <div>CPU: {formData.resources.cpu || '0'} cores</div>
            <div>RAM: {formData.resources.ram || '0'} GB</div>
            <div>Disk: {formData.resources.disk || '0'} GB</div>
          </SummaryItem>
        )}

        {currentStep === 3 && (
          <SummaryItem label="4. OS"
            value={`${formatName(formData.os.name)} ${formData.os.version}`}
          />
        )}

        {currentStep === 4 && (
          <SummaryItem label="5. 프론트엔드">
            {formData.frontendItems.length ? (
              formData.frontendItems.map((item, i) => (
                <div key={item.id}>
                  {i + 1}. {formatName(item.framework)} {item.version}
                </div>
              ))
            ) : (
              <div>-</div>
            )}
            {formData.env === 'paas' && formData.frontendDomain && (
              <div>도메인: {formData.frontendDomain}</div>
            )}
          </SummaryItem>
        )}

        {currentStep === 5 && (
          <SummaryItem label="6. 백엔드">
            {formData.backendItems.length ? (
              formData.backendItems.map((item, i) => (
                <div key={item.id}>
                  {i + 1}. {formatName(item.language)} {item.languageVersion} / {formatName(item.framework)} {item.frameworkVersion}
                </div>
              ))
            ) : (
              <div>-</div>
            )}
            {formData.env === 'paas' && formData.apiDomain && (
              <div>API 도메인: {formData.apiDomain}</div>
            )}
            {formData.env === 'paas' &&
             Array.isArray(formData.apiPaths) &&
             formData.apiPaths.some((path) => path.trim() !== '') && (
              <div>
                API 경로:
                <ul className="list-disc ml-5">
                  {formData.apiPaths
                    .filter((path) => path.trim() !== '')
                    .map((path, i) => (
                      <li key={i}>{path}</li>
                    ))}
                </ul>
              </div>
            )}
          </SummaryItem>
        )}

        {currentStep === 6 && (
          <SummaryItem label="7. 웹 서버/WAS">
            {formData.webServerItems.length ? (
              formData.webServerItems.map((item, i) => (
                <div key={item.id}>
                  {i + 1}. {formatName(item.server)} {item.version}
                </div>
              ))
            ) : (
              <div>-</div>
            )}
          </SummaryItem>
        )}

        {currentStep === 7 && (
          <SummaryItem label="8. DB">
            {formData.dbItems.length ? (
              formData.dbItems.map((item, i) => (
                <div key={item.id}>
                  {i + 1}. {formatName(item.type)} / {formatName(item.name)} {item.version} ({item.size} GB)
                </div>
              ))
            ) : (
              <div>-</div>
            )}
          </SummaryItem>
        )}

        {currentStep === 8 && (
          <SummaryItem label="9. CI/CD"
            value={`${formatName(formData.cicd.tool)} ${formData.cicd.version}`}
          />
        )}
      </div>
    </div>
  );
}

type SummaryItemProps = {
  label: string;
  value?: string;
  children?: React.ReactNode;
};

function SummaryItem({ label, value, children }: SummaryItemProps) {
  return (
    <div>
      <div className="font-semibold text-foreground-light dark:text-white mb-1">{label}</div>
      {value !== undefined ? (
        <div className="text-gray-700 dark:text-gray-300">{value}</div>
      ) : (
        <div className="text-gray-700 dark:text-gray-300 space-y-1">{children}</div>
      )}
    </div>
  );
}

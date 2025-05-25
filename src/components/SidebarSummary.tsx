import { useSurvey } from '@/context/SurveyContext';

export default function SidebarSummary() {
  const { formData, currentStep } = useSurvey();
  const isEKS = formData.k8s?.type === 'amazon_eks';
  const isK8sOnPrem = formData.k8s?.type === 'kubernetes';

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
      cassandra: 'Cassandra',
      relational: 'Relational DB',
      nosql: 'NoSQL DB'
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
            <div>Namespace: {formData.k8s.namespace || '-'}</div>
          </SummaryItem>
        )}

        {currentStep === 1 && formData.env === 'iaas' && (
          <SummaryItem label="2. VM 구성">
            <div>Hostname: {formData.vm.hostname || '-'}</div>
            <div>Username: {formData.vm.username || '-'}</div>
          </SummaryItem>
        )}

        {currentStep === 2 && (
          <SummaryItem label="3. 자원">
            {formData.env === 'paas' && isEKS && (
              <>
                <div>Worker Node 수: {formData.k8s.node || '0'}</div>
                <div>EC2: {formData.vm?.ec2Type || '-'}</div>
                <div>EBS: {formData.vm?.ebsType || '-'}</div>
              </>
            )}
            {formData.env === 'paas' && isK8sOnPrem && (
              <>
                <div>Worker Node 수: {formData.k8s.node || '0'}</div>
                <div>CPU: {formData.resources.cpu || '0'} cores</div>
                <div>RAM: {formData.resources.ram || '0'} GB</div>
                <div>Disk: {formData.resources.disk || '0'} GB</div>
              </>
            )}
            {formData.env === 'iaas' && formData.vm.environment === 'aws' && (
              <>
                <div>EC2: {formData.vm?.ec2Type || '-'}</div>
                <div>EBS: {formData.vm?.ebsType || '-'}</div>
              </>
            )}
            {formData.env === 'iaas' && formData.vm.environment === 'on-premise' && (
              <>
                <div>CPU: {formData.resources.cpu || '0'} cores</div>
                <div>RAM: {formData.resources.ram || '0'} GB</div>
                <div>Disk: {formData.resources.disk || '0'} GB</div>
              </>
            )}
          </SummaryItem>
        )}

        {currentStep === 3 && (
          <SummaryItem label="4. OS"
            value={`${formatName(formData.os.name)} ${formData.os.version || '-'}`}
          />
        )}

        {currentStep === 4 && (
          <SummaryItem label="5. 프론트엔드">
            {formData.frontendItems.length > 0 && formData.frontendItems.some(item => item.framework || item.version) ? (
              formData.frontendItems.map((item) => (
                <div key={item.id}>
                  {formatName(item.framework)} {item.version}
                </div>
              ))
            ) : (
              <div>선택 안 함</div>
            )}
            {formData.env === 'paas' && formData.frontendDomain && (
              <div>도메인: {formData.frontendDomain}</div>
            )}
          </SummaryItem>
        )}

        {currentStep === 5 && (
          <SummaryItem label="6. 백엔드">
            {formData.backendItems.length > 0 && formData.backendItems.some(item => item.language || item.framework) ? (
              formData.backendItems.map((item) => (
                <div key={item.id}>
                  {formatName(item.language)} {item.languageVersion}
                  {item.framework ? ` / ${formatName(item.framework)} ${item.frameworkVersion}` : ''}
                </div>
              ))
            ) : (
              <div>선택 안 함</div>
            )}
            {formData.env === 'paas' && formData.apiDomain && (
              <div>API 도메인: {formData.apiDomain}</div>
            )}
            {formData.env === 'paas' && Array.isArray(formData.apiPaths) && formData.apiPaths.some((path) => path.trim() !== '') && (
              <div>
                API 경로:
                <ul className="list-disc ml-5">
                  {formData.apiPaths.filter((path) => path.trim() !== '').map((path, i) => (
                    <li key={i}>{path}</li>
                  ))}
                </ul>
              </div>
            )}
          </SummaryItem>
        )}

        {currentStep === 6 && (
          <SummaryItem label="7. 웹 서버/WAS">
            {formData.webServerItems.length > 0 && formData.webServerItems.some(item => item.server || item.version) ? (
              formData.webServerItems.map((item) => (
                <div key={item.id}>
                  {formatName(item.server)} {item.version}
                </div>
              ))
            ) : (
              <div>선택 안 함</div>
            )}
          </SummaryItem>
        )}

        {currentStep === 7 && (
          <SummaryItem label="8. DB">
            {formData.dbItems.length > 0 && formData.dbItems.some(item => item.name || item.version) ? (
              formData.dbItems.map((item) => (
                <div key={item.id}>
                  {formatName(item.type)} / {formatName(item.name)} {item.version} ({item.size} GB)
                </div>
              ))
            ) : (
              <div>선택 안 함</div>
            )}
          </SummaryItem>
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

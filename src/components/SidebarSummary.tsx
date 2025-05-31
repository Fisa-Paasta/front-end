import { useSurvey } from '@/context/SurveyContext';
import { ec2Pricing } from '@/types/ec2';
import CostSummaryBox from '@/components/Cost/CostSummaryBox';

export default function SidebarSummary() {
  const { formData, currentStep } = useSurvey();

  const isEKS = formData.k8s?.type === 'amazon_eks';
  const isK8sOnPrem = formData.k8s?.type === 'kubernetes';
  const isIaaS = formData.env === 'iaas';
  const isIaaSOnPrem = isIaaS && formData.vm?.environment === 'on-premise';

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
      nosql: 'NoSQL DB',
      amazon_eks: 'Amazon EKS',
      kubernetes: 'On-Premise'
    };
    return mappings[key] ?? key;
  };

  const EBS_PRICING: Record<string, number> = {
    gp2: 0.10,
    gp3: 0.08,
    io1: 0.125,
    io2: 0.125,
    st1: 0.045,
    sc1: 0.025,
  };

  // 공통 계산 요소
  const nodeType = formData.vm?.ec2Type ?? '-';
  const nodeCount = isIaaS ? 1 : (parseInt(formData.k8s?.node ?? '0', 10) ?? 0);
  const volumeSize = parseInt(formData.vm?.ebsSize ?? '50', 10);
  const volumeType = formData.vm?.ebsType ?? 'gp3';
  const ec2Unit = ec2Pricing[nodeType as keyof typeof ec2Pricing] ?? 0;
  const ebsUnit = EBS_PRICING[volumeType] ?? 0.08;
  const dataTransferHourly = (100 * 0.09) / 30 / 24;

  const cpu = parseInt(formData.resources.cpu ?? '0', 10);
  const ram = parseInt(formData.resources.ram ?? '0', 10);
  const disk = parseInt(formData.resources.disk ?? '0', 10);

  const getCostRate = () => {
    // PaaS + On-prem
    if (formData.env === 'paas' && isK8sOnPrem) {
      const hourly = nodeCount * (cpu * 0.02 + ram * 0.01 + disk * 0.001);
      const monthly = hourly * 24 * 30;
      return { hourly, monthly };
    }

    // IaaS + On-prem
    if (isIaaSOnPrem) {
      const hourly = cpu * 0.02 + ram * 0.01 + disk * 0.001;
      const monthly = hourly * 24 * 30;
      return { hourly, monthly };
    }

    // EKS 기준 계산 (PaaS + amazon_eks or IaaS + aws)
    const includeEksCluster = formData.env === 'paas' && isEKS;
    const eksCluster = includeEksCluster ? 0.1 : 0;
    const ec2Cost = nodeCount * ec2Unit;
    const ebsCost = volumeSize * ebsUnit / 30 / 24;
    const hourly = eksCluster + ec2Cost + ebsCost + dataTransferHourly;
    const monthly = hourly * 24 * 30;
    return { hourly, monthly };
  };

  const getCostFormula = () => {
    if (formData.env === 'paas' && isK8sOnPrem) {
      return `노드 (${nodeCount}) x CPU ${cpu} × $0.02/hr + RAM ${ram}GB × $0.01/hr + DISK ${disk}GB × $0.001/hr`;
    }

    if (isIaaSOnPrem) {
      return `노드 (1) x CPU ${cpu} × $0.02/hr + RAM ${ram}GB × $0.01/hr + DISK ${disk}GB × $0.001/hr`;
    }

    const includeEksCluster = formData.env === 'paas' && isEKS;

    return [
      includeEksCluster ? `EKS 클러스터 ($0.1/hr)` : null,
      `EC2 노드 (${nodeCount} × ${ec2Unit}/hr)`,
      `EBS 볼륨 (${volumeSize}GB × ${ebsUnit}/GB/월 ÷ 30일 ÷ 24시간)`,
      `데이터 전송 (100GB × $0.09/GB/월 ÷ 30일 ÷ 24시간)`
    ].filter(Boolean).join(' + ');
  };

  const { hourly, monthly } = getCostRate();
  const formula = getCostFormula();

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
            <div>Namespace: {formData.k8s.namespace ?? '-'}</div>
          </SummaryItem>
        )}

        {currentStep === 1 && formData.env === 'iaas' && (
          <SummaryItem label="2. VM 구성">
            <div>Hostname: {formData.vm.hostname ?? '-'}</div>
            <div>Username: {formData.vm.username ?? '-'}</div>
          </SummaryItem>
        )}

        {currentStep === 2 && (
          <SummaryItem label="3. 자원">
            {formData.env === 'paas' && isEKS && (
              <>
                <div>Worker Node 수: {formData.k8s.node ?? '0'}</div>
                <div>EC2: {formData.vm?.ec2Type ?? '-'}</div>
                <div>EBS: {formData.vm?.ebsType ?? '-'}</div>
                <div>EBS 볼륨 크기: {formData.vm?.ebsSize ?? '0'} GB</div>
              </>
            )}
            {formData.env === 'paas' && isK8sOnPrem && (
              <>
                <div>Worker Node 수: {formData.k8s.node ?? '0'}</div>
                <div>CPU: {formData.resources.cpu ?? '0'} cores</div>
                <div>RAM: {formData.resources.ram ?? '0'} GB</div>
                <div>Disk: {formData.resources.disk ?? '0'} GB</div>
              </>
            )}
            {formData.env === 'iaas' && formData.vm.environment === 'aws' && (
              <>
                <div>EC2: {formData.vm?.ec2Type ?? '-'}</div>
                <div>EBS: {formData.vm?.ebsType ?? '-'}</div>
                <div>EBS 볼륨 크기: {formData.vm?.ebsSize ?? '0'} GB</div>
              </>
            )}
            {formData.env === 'iaas' && formData.vm.environment === 'on-premise' && (
              <>
                <div>CPU: {formData.resources.cpu ?? '0'} cores</div>
                <div>RAM: {formData.resources.ram ?? '0'} GB</div>
                <div>Disk: {formData.resources.disk ?? '0'} GB</div>
              </>
            )}
          </SummaryItem>
        )}

        {currentStep === 3 && (
          <SummaryItem label="4. OS"
            value={`${formatName(formData.os.name)} ${formData.os.version ?? '-'}`}
          />
        )}

        {currentStep === 4 && (
          <SummaryItem label="5. 프론트엔드">
            {formData.frontendItems.length > 0 && formData.frontendItems.some(item => item.framework ?? item.version) ? (
              formData.frontendItems.map((item) => (
                <div key={`frontend-summary-${item.id}`}>
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
            {formData.backendItems.length > 0 && formData.backendItems.some(item => item.language ?? item.framework) ? (
              formData.backendItems.map((item) => (
                <div key={`backend-summary-${item.id}`}>
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
                  {formData.apiPaths.filter((path) => path.trim() !== '').map((path, pathIndex) => (
                    <li key={`api-path-summary-${pathIndex}-${path}`}>{path}</li>
                  ))}
                </ul>
              </div>
            )}
          </SummaryItem>
        )}

        {currentStep === 6 && (
          <SummaryItem label="7. 웹 서버/WAS">
            {formData.webServerItems.length > 0 && formData.webServerItems.some(item => item.server ?? item.version) ? (
              formData.webServerItems.map((item) => (
                <div key={`webserver-summary-${item.id}`}>
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
            {formData.dbItems.length > 0 && formData.dbItems.some(item => item.name ?? item.version) ? (
              formData.dbItems.map((item) => (
                <div key={`db-summary-${item.id}`}>
                  {formatName(item.type)} / {formatName(item.name)} {item.version} ({item.size} GB)
                </div>
              ))
            ) : (
              <div>선택 안 함</div>
            )}
          </SummaryItem>
        )}
      </div>

      {/* ✅ 비용 요약 컴포넌트 적용 */}
      {(formData.env === 'paas' || formData.env === 'iaas') && (
        <CostSummaryBox
          hourly={hourly}
          monthly={monthly}
          formula={formula}
          compact
        />
      )}
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
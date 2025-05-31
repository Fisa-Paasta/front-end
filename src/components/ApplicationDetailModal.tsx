import { FileText } from 'lucide-react';
import { SubmittedCard } from '@/context/SubmittedContext';

type Props = Readonly<{
  onClose: () => void;
  item: SubmittedCard;
}>;

const formatName = (key?: string) => {
  if (!key) return '선택 안함';
  const mappings: Record<string, string> = {
    spring_boot: 'Spring Boot', express: 'Express', nestjs: 'NestJS',
    django: 'Django', flask: 'Flask', fiber: 'Fiber', rails: 'Ruby on Rails',
    gin: 'Gin', echo: 'Echo', react: 'React', vue: 'Vue.js', angular: 'Angular',
    nextjs: 'Next.js', github_actions: 'GitHub Actions', gitlab_ci: 'GitLab CI/CD',
    jenkins: 'Jenkins', nginx: 'Nginx', apache: 'Apache', tomcat: 'Tomcat',
    mysql: 'MySQL', postgresql: 'PostgreSQL', mariadb: 'MariaDB', oracle: 'Oracle DB',
    mongodb: 'MongoDB', redis: 'Redis', elasticsearch: 'Elasticsearch', cassandra: 'Cassandra',
    relational: 'Relational DB', nosql: 'NoSQL DB'
  };
  return mappings[key] ?? key;
};

const formatValue = (value?: string | number | null): React.ReactNode =>
  value === undefined || value === null || value === ''
    ? <span className="text-gray-500 dark:text-gray-400 italic">선택 안함</span>
    : <span className="text-gray-900 dark:text-white">{String(value)}</span>;

const KeyValue = ({ label, value }: { label: string; value?: React.ReactNode }) => (
  <div className="flex items-center gap-3">
    <div className="text-xs text-gray-500 dark:text-gray-400 w-28">{label}</div>
    <div className="text-sm font-medium">{value}</div>
  </div>
);

const KeyGroup = ({ children }: { children: React.ReactNode }) => (
  <div className="border-l-4 border-purple-500 pl-4 space-y-2">
    {children}
  </div>
);

export default function ApplicationDetailModal({ item, onClose }: Props) {
  const formData = item.formDataSnapshot;

  if (!formData) {
    return (
      <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
        <div className="bg-white dark:bg-zinc-900 text-gray-900 dark:text-white p-6 rounded-xl shadow-xl">
          <p className="mb-4">❌ 신청서 세부 구성이 존재하지 않습니다.</p>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
          >
            닫기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
      <div className="bg-white dark:bg-zinc-900 text-gray-900 dark:text-white rounded-2xl p-6 w-full max-w-4xl shadow-2xl overflow-y-auto max-h-[90vh] space-y-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <FileText className="w-5 h-5" />
          신청서 상세 내역
        </h2>

        <KeyGroup>
          <KeyValue label="제목" value={formatValue(item.title)} />
          <KeyValue label="설명" value={formatValue(item.desc)} />
          <KeyValue label="신청일" value={formatValue(item.date)} />
          <KeyValue label="상태" value={formatValue(item.status)} />
        </KeyGroup>

        <div className="border-t border-dashed border-zinc-300 dark:border-zinc-600 pt-4">
          <KeyGroup>
            <KeyValue label="환경" value={formatValue(formData.env)} />
            {formData.env === 'iaas' ? (
              <>
                <KeyValue label="Hostname" value={formatValue(formData.vm.hostname)} />
                <KeyValue label="Username" value={formatValue(formData.vm.username)} />
              </>
            ) : (
              <>
                <KeyValue label="Type" value={formatValue(formatName(formData.k8s?.type))} />
                <KeyValue label="Namespace" value={formatValue(formData.k8s?.namespace)} />
              </>
            )}
          </KeyGroup>
        </div>

        <div className="border-t border-dashed border-zinc-300 dark:border-zinc-600 pt-4">
          <KeyGroup>
            {formData.env === 'iaas' && formData.vm.environment === 'aws' && (
              <>
                <KeyValue label="EC2" value={formatValue(formData.vm.ec2Type)} />
                <KeyValue label="EBS" value={formatValue(formData.vm.ebsType)} />
                <KeyValue label="EBS 크기" value={formatValue(`${formData.vm.ebsSize} GB`)} />
              </>
            )}
            {formData.env === 'iaas' && formData.vm.environment === 'on-premise' && (
              <>
                <KeyValue label="CPU" value={formatValue(`${formData.resources.cpu} cores`)} />
                <KeyValue label="RAM" value={formatValue(`${formData.resources.ram} GB`)} />
                <KeyValue label="Disk" value={formatValue(`${formData.resources.disk} GB`)} />
              </>
            )}
            {formData.env === 'paas' && (
              <>
                <KeyValue label="Worker 수" value={formatValue(formData.k8s?.node)} />
                {formData.k8s?.type === 'amazon_eks' ? (
                  <>
                    <KeyValue label="EC2" value={formatValue(formData.vm.ec2Type)} />
                    <KeyValue label="EBS" value={formatValue(formData.vm.ebsType)} />
                    <KeyValue label="EBS 크기" value={formatValue(`${formData.vm.ebsSize} GB`)} />
                  </>
                ) : (
                  <>
                    <KeyValue label="CPU" value={formatValue(`${formData.resources.cpu} cores`)} />
                    <KeyValue label="RAM" value={formatValue(`${formData.resources.ram} GB`)} />
                    <KeyValue label="Disk" value={formatValue(`${formData.resources.disk} GB`)} />
                  </>
                )}
              </>
            )}
          </KeyGroup>
        </div>

        <div className="border-t border-dashed border-zinc-300 dark:border-zinc-600 pt-4">
          <KeyGroup>
            {formData.frontendItems.map((f) => (
              <KeyValue
                key={`frontend-${f.id}-${f.framework}`}
                label={`Frontend`}
                value={formatValue(`${formatName(f.framework)} ${f.version}`)}
              />
            ))}
            <KeyValue label="도메인" value={formatValue(formData.frontendDomain)} />
          </KeyGroup>
        </div>

        <div className="border-t border-dashed border-zinc-300 dark:border-zinc-600 pt-4">
          <KeyGroup>
            {formData.backendItems.map((b) => (
              <KeyValue
                key={`backend-${b.id}-${b.language}-${b.framework}`}
                label={`Backend`}
                value={formatValue(
                  `${formatName(b.language)} ${b.languageVersion} / ${formatName(b.framework)} ${b.frameworkVersion}`
                )}
              />
            ))}
            <KeyValue label="API 도메인" value={formatValue(formData.apiDomain)} />
            {formData.apiPaths?.map((p, pathIndex) => (
              <KeyValue
                key={`api-path-${pathIndex}-${p}`}
                label="경로"
                value={formatValue(p)}
              />
            ))}
          </KeyGroup>
        </div>

        <div className="border-t border-dashed border-zinc-300 dark:border-zinc-600 pt-4">
          <KeyGroup>
            {formData.webServerItems.map((w) => (
              <KeyValue
                key={`webserver-${w.id}-${w.server}`}
                label="Web Server"
                value={formatValue(`${formatName(w.server)} ${w.version}`)}
              />
            ))}
          </KeyGroup>
        </div>

        <div className="border-t border-dashed border-zinc-300 dark:border-zinc-600 pt-4">
          <KeyGroup>
            {formData.dbItems.map((d) => (
              <KeyValue
                key={`db-${d.id}-${d.name}`}
                label="DB"
                value={formatValue(
                  `${formatName(d.type)} / ${formatName(d.name)} ${d.version} (${d.size} GB)`
                )}
              />
            ))}
          </KeyGroup>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-zinc-300 dark:border-zinc-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-md bg-[#5A3EBA] text-white hover:bg-[#4932A0]"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
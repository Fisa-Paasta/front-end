import { FileText } from 'lucide-react';
import { AdminCardData } from '@/types/admin';

interface Props {
  onClose: () => void;
  item: AdminCardData;
}

const formatName = (key?: string) => {
  if (!key) return '-';
  const mappings: Record<string, string> = {
    spring_boot: 'Spring Boot', express: 'Express', nestjs: 'NestJS',
    django: 'Django', flask: 'Flask', fiber: 'Fiber', rails: 'Ruby on Rails',
    gin: 'Gin', echo: 'Echo', react: 'React', vue: 'Vue.js', angular: 'Angular',
    nextjs: 'Next.js', github_actions: 'GitHub Actions', gitlab_ci: 'GitLab CI/CD',
    jenkins: 'Jenkins', nginx: 'Nginx', apache: 'Apache HTTP Server', tomcat: 'Tomcat',
    mysql: 'MySQL', postgresql: 'PostgreSQL', mariadb: 'MariaDB', oracle: 'Oracle DB',
    mongodb: 'MongoDB', redis: 'Redis', elasticsearch: 'Elasticsearch', cassandra: 'Cassandra',
    relational: 'Relational DB', nosql: 'NoSQL DB'
  };
  return mappings[key] || key;
};

export default function ApplicationDetailModal({ item, onClose }: Props) {
  const formData = item.formDataSnapshot; // ✅ 이거 사용
  if (!formData) {
    return (
      <div className="...">
        <div>❌ 신청서 세부 구성이 존재하지 않습니다.</div>
        <button onClick={onClose}>닫기</button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-3xl shadow-xl text-gray-900 dark:text-white overflow-y-auto max-h-[90vh]">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          <span>신청서 상세 내역</span>
        </h2>

        {/* 기본 정보 */}
        <div className="space-y-3 text-sm">
          <div><strong>제목:</strong> {item.title}</div>
          <div><strong>설명:</strong> {item.desc}</div>
          <div><strong>신청일:</strong> {item.date}</div>
          <div><strong>상태:</strong> {item.status}</div>
        </div>

        <hr className="my-4 border-gray-300 dark:border-gray-600" />

        {/* 상세 구성 */}
        <div className="text-sm space-y-4">
          <div><strong>1. 환경:</strong> {formData.env}</div>

          <div>
            <strong>2. {formData.env === 'iaas' ? 'VM 구성' : 'Kubernetes'}:</strong>
            {formData.env === 'iaas' ? (
              <>
                <div className="ml-2">Hostname: {formData.vm.hostname}</div>
                <div className="ml-2">Username: {formData.vm.username}</div>
              </>
            ) : (
              <>
                <div className="ml-2">Type: {formatName(formData.k8s?.type)}</div>
                <div className="ml-2">Namespace: {formData.k8s?.namespace}</div>
              </>
            )}
          </div>

          <div>
            <strong>3. 자원:</strong>
            {formData.env === 'iaas' && formData.vm.environment === 'aws' && (
              <>
                <div className="ml-2">EC2: {formData.vm.ec2Type}</div>
                <div className="ml-2">EBS: {formData.vm.ebsType}</div>
                <div className="ml-2">EBS 볼륨 크기: {formData.vm.ebsSize} GB</div>
              </>
            )}
            {formData.env === 'iaas' && formData.vm.environment === 'on-premise' && (
              <>
                <div className="ml-2">CPU: {formData.resources.cpu} cores</div>
                <div className="ml-2">RAM: {formData.resources.ram} GB</div>
                <div className="ml-2">Disk: {formData.resources.disk} GB</div>
              </>
            )}
            {formData.env === 'paas' && formData.k8s?.type === 'amazon_eks' && (
              <>
                <div className="ml-2">Worker Node 수: {formData.k8s.node}</div>
                <div className="ml-2">EC2: {formData.vm.ec2Type}</div>
                <div className="ml-2">EBS: {formData.vm.ebsType}</div>
                <div className="ml-2">EBS 볼륨 크기: {formData.vm.ebsSize} GB</div>
              </>
            )}
            {formData.env === 'paas' && formData.k8s?.type === 'kubernetes' && (
              <>
                <div className="ml-2">Worker Node 수: {formData.k8s.node}</div>
                <div className="ml-2">CPU: {formData.resources.cpu} cores</div>
                <div className="ml-2">RAM: {formData.resources.ram} GB</div>
                <div className="ml-2">Disk: {formData.resources.disk} GB</div>
              </>
            )}
          </div>

          <div><strong>4. 운영체제:</strong> {formatName(formData.os.name)} {formData.os.version}</div>

          <div>
            <strong>5. 프론트엔드:</strong>
            {formData.frontendItems.map((f, i) => (
              <div key={i} className="ml-2">{formatName(f.framework)} {f.version}</div>
            ))}
            {formData.frontendDomain && <div className="ml-2">도메인: {formData.frontendDomain}</div>}
          </div>

          <div>
            <strong>6. 백엔드:</strong>
            {formData.backendItems.map((b, i) => (
              <div key={i} className="ml-2">
                {formatName(b.language)} {b.languageVersion} / {formatName(b.framework)} {b.frameworkVersion}
              </div>
            ))}
            {formData.apiDomain && <div className="ml-2">API 도메인: {formData.apiDomain}</div>}
            {formData.apiPaths?.map((p, i) => <div key={i} className="ml-2">경로: {p}</div>)}
          </div>

          <div>
            <strong>7. 웹 서버:</strong>
            {formData.webServerItems.map((w, i) => (
              <div key={i} className="ml-2">{formatName(w.server)} {w.version}</div>
            ))}
          </div>

          <div>
            <strong>8. DB:</strong>
            {formData.dbItems.map((d, i) => (
              <div key={i} className="ml-2">{formatName(d.type)} / {formatName(d.name)} {d.version} ({d.size} GB)</div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}

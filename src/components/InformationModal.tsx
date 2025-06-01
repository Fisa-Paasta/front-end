import { useSurvey } from '@/context/SurveyContext';
import { FileText } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface Props {
  onClose: () => void;
  onSubmit: () => void;
}

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

export default function InformationModal({ onClose, onSubmit }: Props) {
  const { formData } = useSurvey();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog) {
      dialog.showModal();
      
      // 포커스 관리
      const firstButton = dialog.querySelector('button');
      if (firstButton) {
        firstButton.focus();
      }
    }

    return () => {
      if (dialog) {
        dialog.close();
      }
    };
  }, []);

  const handleClose = () => {
    const dialog = dialogRef.current;
    if (dialog) {
      dialog.close();
    }
    onClose();
  };

  const handleSubmit = () => {
    const dialog = dialogRef.current;
    if (dialog) {
      dialog.close();
    }
    onSubmit();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      handleClose();
    }
  };

  return (
    <dialog 
      ref={dialogRef}
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center backdrop:bg-black/60"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      onKeyDown={handleKeyDown}
    >
      <div className="bg-white dark:bg-zinc-900 text-gray-900 dark:text-white rounded-2xl p-6 w-full max-w-3xl shadow-2xl overflow-y-auto max-h-[90vh] space-y-6">
        <header>
          <h2 id="modal-title" className="text-xl font-bold flex items-center gap-2">
            <FileText className="w-5 h-5" aria-hidden="true" />
            신청서 상세 내역
          </h2>
          <p id="modal-description" className="sr-only">
            신청하신 인프라 환경의 상세 설정 내역을 확인하실 수 있습니다.
          </p>
        </header>

        <main className="mt-6 space-y-6">
          <section aria-labelledby="basic-info-heading">
            <h3 id="basic-info-heading" className="sr-only">기본 정보</h3>
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
          </section>

          <section aria-labelledby="resource-info-heading" className="border-t border-dashed border-zinc-300 dark:border-zinc-600 pt-4">
            <h3 id="resource-info-heading" className="sr-only">리소스 정보</h3>
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
          </section>

          <section aria-labelledby="os-info-heading" className="border-t border-dashed border-zinc-300 dark:border-zinc-600 pt-4">
            <h3 id="os-info-heading" className="sr-only">운영체제 정보</h3>
            <KeyGroup>
              <KeyValue label="OS" value={formatValue(`${formatName(formData.os.name)} ${formData.os.version}`)} />
            </KeyGroup>
          </section>

          <section aria-labelledby="frontend-info-heading" className="border-t border-dashed border-zinc-300 dark:border-zinc-600 pt-4">
            <h3 id="frontend-info-heading" className="sr-only">프론트엔드 정보</h3>
            <KeyGroup>
              {formData.frontendItems.map((f, index) => (
                <KeyValue key={`frontend-item-${f.id}-${f.framework}`} label={`Frontend ${index + 1}`} value={formatValue(`${formatName(f.framework)} ${f.version}`)} />
              ))}
              <KeyValue label="도메인" value={formatValue(formData.frontendDomain)} />
            </KeyGroup>
          </section>

          <section aria-labelledby="backend-info-heading" className="border-t border-dashed border-zinc-300 dark:border-zinc-600 pt-4">
            <h3 id="backend-info-heading" className="sr-only">백엔드 정보</h3>
            <KeyGroup>
              {formData.backendItems.map((b, index) => (
                <KeyValue
                  key={`backend-item-${b.id}-${b.language}-${b.framework}`}
                  label={`Backend ${index + 1}`}
                  value={formatValue(`${formatName(b.language)} ${b.languageVersion} / ${formatName(b.framework)} ${b.frameworkVersion}`)}
                />
              ))}
              <KeyValue label="API 도메인" value={formatValue(formData.apiDomain)} />
              {formData.apiPaths?.map((p, pathIndex) => (
                <KeyValue key={`api-path-${pathIndex}-${p}`} label={`경로 ${pathIndex + 1}`} value={formatValue(p)} />
              ))}
            </KeyGroup>
          </section>

          <section aria-labelledby="webserver-info-heading" className="border-t border-dashed border-zinc-300 dark:border-zinc-600 pt-4">
            <h3 id="webserver-info-heading" className="sr-only">웹서버 정보</h3>
            <KeyGroup>
              {formData.webServerItems.map((w, index) => (
                <KeyValue key={`webserver-item-${w.id}-${w.server}`} label={`Web Server ${index + 1}`} value={formatValue(`${formatName(w.server)} ${w.version}`)} />
              ))}
            </KeyGroup>
          </section>

          <section aria-labelledby="database-info-heading" className="border-t border-dashed border-zinc-300 dark:border-zinc-600 pt-4">
            <h3 id="database-info-heading" className="sr-only">데이터베이스 정보</h3>
            <KeyGroup>
              {formData.dbItems.map((d, index) => (
                <KeyValue
                  key={`db-item-${d.id}-${d.name}`}
                  label={`DB ${index + 1}`}
                  value={formatValue(`${formatName(d.type)} / ${formatName(d.name)} ${d.version} (${d.size} GB)`)}
                />
              ))}
            </KeyGroup>
          </section>
        </main>

        <footer className="flex justify-end gap-2 pt-4 border-t border-zinc-300 dark:border-zinc-700">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            닫기
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 text-sm rounded-md bg-[#5A3EBA] text-white hover:bg-[#4932A0] focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            다음
          </button>
        </footer>
      </div>
    </dialog>
  );
}
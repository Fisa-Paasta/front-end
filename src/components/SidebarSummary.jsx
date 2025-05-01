import { useSurvey } from '@/context/SurveyContext';

export default function SidebarSummary() {
  const { formData } = useSurvey();

  // 환경 포맷: iaas → IaaS, paas → PaaS
  const formatEnv = (env) => {
    if (!env) return '-';
    const lowered = env.toLowerCase();
    if (lowered === 'iaas') return 'IaaS';
    if (lowered === 'paas') return 'PaaS';
    return env;
  };

  // 보안 등급 포맷: low → Low
  const formatSecurity = (sec) => {
    if (!sec) return '-';
    return sec.charAt(0).toUpperCase() + sec.slice(1).toLowerCase();
  };

  // 프레임워크 하나 포맷
  const renderFrameworkItem = (item) => {
    if (!item || !item.name) return '-';
    return `${item.name} (${item.version || '버전 선택 안함'})`;
  };

  return (
    <div className="formbold-sidebar">
      <h3>입력 요약</h3>
      <ul className="formbold-summary">
        <li><strong>1. 환경:</strong> 
          <div>{formatEnv(formData.env)}</div>
        </li>

        <li><strong>2. 자원:</strong>
          <div>Cpu: {formData.cpu || '0'} cores</div>
          <div>Ram: {formData.ram || '0'} GB</div>
          <div>Disk: {formData.disk || '0'} GB</div>
        </li>

        <li><strong>3. 보안:</strong> 
          <div>{formatSecurity(formData.sec)}</div>
        </li>

        <li><strong>4. k8s settings:</strong>
          <div>Node: {formData.k8s?.node || '0'}</div>
          <div>ReplicaSets: {formData.k8s?.rs || '0'}</div>
          <div>NameSpace: {formData.k8s?.namespace || '-'}</div>
        </li>

        <li><strong>5. DB:</strong>
          <div>Type: {formData.db?.db_type || '-'}</div> 
          <div>Version: {formData.db?.db_version || '0.0'}</div>
          <div>Size: {formData.db?.db_size || '0'} GB</div>
        </li>

        <li><strong>6. Framework:</strong>
          <div>Back-end: {renderFrameworkItem(formData.framework?.backend)}</div>
          <div>Front-end: {renderFrameworkItem(formData.framework?.frontend)}</div>
          <div>CI/CD: {renderFrameworkItem(formData.framework?.cicd)}</div>
          <div>기타: {formData.framework?.etc || '-'}</div>
        </li>
      </ul>
    </div>
  );
}

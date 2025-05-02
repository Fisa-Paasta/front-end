// src/components/SidebarSummary.jsx
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

  // 이름 포맷: snake_case를 Title Case로 변환
  const formatName = (key) => {
    if (!key) return '-';
    
    // 특수 케이스 매핑
    const mappings = {
      'spring_boot': 'Spring Boot',
      'nextjs': 'Next.js',
      'nuxtjs': 'Nuxt.js',
      'nodejs': 'Node.js',
      'nestjs': 'NestJS',
      'fastapi': 'FastAPI',
      'github_actions': 'GitHub Actions',
      'gitlab_ci': 'GitLab CI/CD'
    };
    
    if (mappings[key]) return mappings[key];
    
    // 기본 포맷팅: snake_case를 Title Case로 변환
    return key.split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="formbold-sidebar">
      <h3>입력 요약</h3>
      <ul className="formbold-summary">
        <li><strong>1. 환경:</strong> 
          <div>{formatEnv(formData.env)}</div>
        </li>

        <li><strong>2. k8s settings:</strong>
          <div>Type: {formatName(formData.k8s?.type) || '-'}</div>
          <div>Version: {formData.k8s?.version || '-'}</div>
          {formData.k8s?.runtime && <div>Runtime: {formatName(formData.k8s?.runtime)} {formData.k8s?.runtimeVersion}</div>}
          {formData.k8s?.cni && <div>CNI: {formData.k8s?.cni}</div>}
          <div>Node: {formData.k8s?.node || '0'}</div>
          <div>ReplicaSets: {formData.k8s?.rs || '0'}</div>
          <div>NameSpace: {formData.k8s?.namespace || '-'}</div>
        </li>

        <li><strong>3. 자원:</strong>
          <div>Cpu: {formData.resources?.cpu || '0'} cores</div>
          <div>Ram: {formData.resources?.ram || '0'} GB</div>
          <div>Disk: {formData.resources?.disk || '0'} GB</div>
        </li>

        <li><strong>4. OS:</strong> 
          <div>{formatName(formData.os?.name) || '-'} {formData.os?.version || '-'}</div>
        </li>
        
        <li><strong>5. 프론트엔드:</strong>
          {!formData.frontendItems || formData.frontendItems.length === 0 ? (
            <div>-</div>
          ) : (
            formData.frontendItems.map((item, index) => (
              <div key={item.id || index}>
                {index + 1}. {formatName(item.framework) || '-'} {item.version || '-'}
              </div>
            ))
          )}
        </li>
        
        <li><strong>6. 백엔드:</strong>
          {!formData.backendItems || formData.backendItems.length === 0 ? (
            <div>-</div>
          ) : (
            formData.backendItems.map((item, index) => (
              <div key={item.id || index}>
                {index + 1}. {formatName(item.language) || '-'} {item.languageVersion || '-'} / 
                {formatName(item.framework) || '-'} {item.frameworkVersion || '-'}
              </div>
            ))
          )}
        </li>
        
        <li><strong>7. 웹 서버/WAS:</strong>
          {!formData.webServerItems || formData.webServerItems.length === 0 ? (
            <div>-</div>
          ) : (
            formData.webServerItems.map((item, index) => (
              <div key={item.id || index}>
                {index + 1}. {formatName(item.server) || '-'} {item.version || '-'}
              </div>
            ))
          )}
        </li>
        
        <li><strong>8. DB:</strong>
          {!formData.dbItems || formData.dbItems.length === 0 ? (
            <div>-</div>
          ) : (
            formData.dbItems.map((item, index) => (
              <div key={item.id || index}>
                {index + 1}. {formatName(item.type) || '-'} / 
                {formatName(item.name) || '-'} {item.version || '-'}
                {item.size && <span> ({item.size} GB)</span>}
              </div>
            ))
          )}
        </li>
        
        <li><strong>9. CI/CD:</strong> 
          <div>Tool: {formatName(formData.cicd?.tool) || '-'} {formData.cicd?.version || '-'}</div>
        </li>
      </ul>
    </div>
  );
}
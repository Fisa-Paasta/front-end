import { useSurvey } from '@/context/SurveyContext';

export default function ConfirmModal({ onClose, onSubmit }) {
  const { formData } = useSurvey();

  const formatEnv = (env) => {
    if (!env) return '-';
    const lowered = env.toLowerCase();
    if (lowered === 'iaas') return 'IaaS';
    if (lowered === 'paas') return 'PaaS';
    return env;
  };

  const formatName = (key) => {
    if (!key) return '-';
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

    return key.split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>📝 신청 내용 확인</h2>
        <div className="modal-body">
          <ul className="summary-list">
            <li>
              <strong>1. 환경:</strong>
              <div className="item-entry">{formatEnv(formData.env)}</div>
            </li>

            <li>
              <strong>2. k8s settings:</strong>
              <div className="item-entry">Type: {formatName(formData.k8s?.type) || '-'}</div>
              <div className="item-entry">Version: {formData.k8s?.version || '-'}</div>
              {formData.k8s?.runtime && <div className="item-entry">Runtime: {formatName(formData.k8s?.runtime)} {formData.k8s?.runtimeVersion}</div>}
              {formData.k8s?.cni && <div className="item-entry">CNI: {formData.k8s?.cni}</div>}
              <div className="item-entry">Node: {formData.k8s?.node || '0'}</div>
              <div className="item-entry">ReplicaSets: {formData.k8s?.rs || '0'}</div>
              <div className="item-entry">NameSpace: {formData.k8s?.namespace || '-'}</div>
            </li>

            <li>
              <strong>3. 자원:</strong>
              <div className="item-entry">Cpu: {formData.resources?.cpu || '0'} cores</div>
              <div className="item-entry">Ram: {formData.resources?.ram || '0'} GB</div>
              <div className="item-entry">Disk: {formData.resources?.disk || '0'} GB</div>
            </li>

            <li>
              <strong>4. OS:</strong>
              <div className="item-entry">{formatName(formData.os?.name) || '-'} {formData.os?.version || '-'}</div>
            </li>

            <li>
              <strong>5. 프론트엔드:</strong>
              {!formData.frontendItems || formData.frontendItems.length === 0 ? (
                <div className="item-entry">-</div>
              ) : (
                formData.frontendItems.map((item, index) => (
                  <div key={item.id || index} className="item-entry">
                    {index + 1}. {formatName(item.framework) || '-'} {item.version || '-'}
                  </div>
                ))
              )}
            </li>

            <li>
              <strong>6. 백엔드:</strong>
              {!formData.backendItems || formData.backendItems.length === 0 ? (
                <div className="item-entry">-</div>
              ) : (
                formData.backendItems.map((item, index) => (
                  <div key={item.id || index} className="item-entry">
                    {index + 1}. {formatName(item.language) || '-'} {item.languageVersion || '-'} / 
                    {formatName(item.framework) || '-'} {item.frameworkVersion || '-'}
                  </div>
                ))
              )}
            </li>

            <li>
              <strong>7. 웹 서버/WAS:</strong>
              {!formData.webServerItems || formData.webServerItems.length === 0 ? (
                <div className="item-entry">-</div>
              ) : (
                formData.webServerItems.map((item, index) => (
                  <div key={item.id || index} className="item-entry">
                    {index + 1}. {formatName(item.server) || '-'} {item.version || '-'}
                  </div>
                ))
              )}
            </li>

            <li>
              <strong>8. DB:</strong>
              {!formData.dbItems || formData.dbItems.length === 0 ? (
                <div className="item-entry">-</div>
              ) : (
                formData.dbItems.map((item, index) => (
                  <div key={item.id || index} className="item-entry">
                    {index + 1}. {formatName(item.type) || '-'} / {formatName(item.name) || '-'} {item.version || '-'}
                    {item.size && <span> ({item.size} GB)</span>}
                  </div>
                ))
              )}
            </li>

            <li>
              <strong>9. CI/CD:</strong>
              <div className="item-entry">Tool: {formatName(formData.cicd?.tool) || '-'} {formData.cicd?.version || '-'}</div>
            </li>
          </ul>
        </div>

        <div className="modal-actions">
          <button className="cancel-button" onClick={onClose}>취소</button>
          <button className="submit-button" onClick={onSubmit}>제출</button>
        </div>
      </div>
    </div>
  );
}
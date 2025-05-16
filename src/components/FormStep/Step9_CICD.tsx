import { useSurvey } from '@/context/SurveyContext';
import { useState, useEffect } from 'react';
import { CICDConfig, CICDTool } from '@/types/survey';

export default function Step9_CICD() {
  const { formData, updateFormData } = useSurvey();

  const cicdOptions: Record<Exclude<CICDTool, ''>, string[]> = {
    jenkins: ['2.504.1', '2.492.3 (LTS)', '2.479.3 (LTS)'],
    argocd: ['2.14.11', '2.13.7', '2.12.12']
  };

  const toolDisplayNames: Record<Exclude<CICDTool, ''>, string> = {
    jenkins: 'Jenkins',
    argocd: 'ArgoCD'
  };

  const [localCICD, setLocalCICD] = useState<CICDConfig>(
    formData.cicd || { tool: '', version: '' }
  );

  useEffect(() => {
    updateFormData('cicd', localCICD);
  }, [localCICD]);

  const handleChange = (field: keyof CICDConfig, value: string) => {
    const updated = { ...localCICD, [field]: value };
    if (field === 'tool') updated.version = '';
    setLocalCICD(updated);
  };

  return (
    <div className="space-y-4">
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-sm space-y-2">
        <select
          className="w-full px-3 py-2 border rounded-md bg-white dark:bg-input-dark dark:text-white"
          value={localCICD.tool}
          onChange={(e) => handleChange('tool', e.target.value)}
        >
          <option value="">도구 선택</option>
          {(Object.keys(cicdOptions) as Exclude<CICDTool, ''>[]).map((tool) => (
            <option key={tool} value={tool}>
              {toolDisplayNames[tool]}
            </option>
          ))}
        </select>

        <select
          className="w-full px-3 py-2 border rounded-md bg-white dark:bg-input-dark dark:text-white"
          value={localCICD.version}
          onChange={(e) => handleChange('version', e.target.value)}
          disabled={!localCICD.tool}
        >
          <option value="">버전 선택</option>
          {(cicdOptions[localCICD.tool as Exclude<CICDTool, ''>] || []).map((version) => (
            <option key={version} value={version}>
              {version}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

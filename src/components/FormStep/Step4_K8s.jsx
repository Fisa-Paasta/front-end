import { useSurvey } from '@/context/SurveyContext';

export default function Step4_K8s() {
  const { formData, updateFormData } = useSurvey();

  const handleChange = (field, value) => {
    updateFormData('k8s', {
      ...formData.k8s,
      [field]: value
    });
  };

  return (
    <div className="formbold-form-step">
      <label className="formbold-form-label">4. k8s Settings</label>
      <input
        type="number"
        name="node"
        className="formbold-form-input"
        placeholder="Node"
        value={formData.k8s?.node || ''}
        onChange={(e) => handleChange('node', e.target.value)}
      />
      <input
        type="number"
        name="rs"
        className="formbold-form-input"
        placeholder="ReplicaSet (RS)"
        value={formData.k8s?.rs || ''}
        onChange={(e) => handleChange('rs', e.target.value)}
      />
      <input
        type="text"
        name="namespace"
        className="formbold-form-input"
        placeholder="Namespace"
        value={formData.k8s?.namespace || ''}
        onChange={(e) => handleChange('namespace', e.target.value)}
      />
    </div>
  );
}

// src/pages/CostPage.tsx
import { useState } from 'react';
import OnPremCostForm from '../components/Cost/OnPremCostForm';
import EKSCostForm from '../components/Cost/EKSCostForm';
import Layout from '@/components/Layout';

export default function CostPage() {
  const [envType, setEnvType] = useState<'onprem' | 'eks'>('onprem');

  return (
    <Layout>
      <div className="pb-20"> {/* ✅ padding-x 제거, Layout이 담당 */}

        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1">비용 산정</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            온프레미스 바닐라 k8s 또는 AWS EKS 환경에 맞는 리소스를 선택하면 실시간으로 시간당 및 월간 비용이 계산됩니다.
          </p>
        </div>

        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setEnvType('onprem')}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors duration-300 ${
              envType === 'onprem'
                ? 'bg-primary text-white'
                : 'bg-panel-light dark:bg-panel-dark text-gray-700 dark:text-gray-300 hover:bg-panel-light/90 dark:hover:bg-panel-dark/80'
            }`}
          >
            온프레미스 바닐라 k8s [VM]
          </button>

          <button
            onClick={() => setEnvType('eks')}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors duration-300 ${
              envType === 'eks'
                ? 'bg-primary text-white'
                : 'bg-panel-light dark:bg-panel-dark text-gray-700 dark:text-gray-300 hover:bg-panel-light/90 dark:hover:bg-panel-dark/80'
            }`}
          >
            AWS EKS
          </button>
        </div>

        {envType === 'onprem' ? <OnPremCostForm /> : <EKSCostForm />}
      </div>
    </Layout>
  );
}

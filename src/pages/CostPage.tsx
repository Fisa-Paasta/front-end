import { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import OnPremCostForm from '../components/Cost/OnPremCostForm';
import EKSCostForm from '../components/Cost/EKSCostForm';

export default function CostPage() {
  const [envType, setEnvType] = useState('onprem'); // 'onprem' or 'eks'

  // 💡 요약 비용은 하위 컴포넌트에서 받아오는 방식이 아니라면 상태로 분리 가능
  // 혹은 리프팅해서 props로 전달해도 됨

  return (
    <div className="min-h-screen transition-colors duration-500 bg-background-light dark:bg-background-dark text-foreground-light dark:text-foreground-dark">
  <Header />
  <div className="flex">
    <Sidebar />

    <main className="flex-1 px-10 pt-10 pb-20 relative">
      <div className="sticky top-20 z-40">
        {/* 비용 요약은 하위에서 자동 렌더됨 */}
      </div>

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
          🖥️ 온프레미스 바닐라 k8s [VM]
        </button>

        <button
          onClick={() => setEnvType('eks')}
          className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors duration-300 ${
            envType === 'eks'
              ? 'bg-primary text-white'
              : 'bg-panel-light dark:bg-panel-dark text-gray-700 dark:text-gray-300 hover:bg-panel-light/90 dark:hover:bg-panel-dark/80'
          }`}
        >
          ☁️ AWS EKS
        </button>
      </div>

      {envType === 'onprem' ? <OnPremCostForm /> : <EKSCostForm />}
    </main>
  </div>
</div>
  );
}

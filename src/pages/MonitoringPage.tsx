import { useState } from 'react';
import Layout from '@/components/Layout';
import { useSubmitted } from '@/context/SubmittedContext';
import { GrafanaDashboard, SubmittedCard } from '@/context/SubmittedContext';

export default function MonitoringPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { submittedCards } = useSubmitted();
  const [selectedCard, setSelectedCard] = useState<SubmittedCard | null>(null);
  const [selectedDashboard, setSelectedDashboard] = useState<GrafanaDashboard | null>(null);

  return (
    <Layout collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">시스템 모니터링</h1>
        <p className="text-gray-600 dark:text-gray-400">
          신청한 인프라 환경별 Grafana 대시보드를 확인할 수 있습니다.
        </p>
      </div>

      <div className="flex gap-6">
        {/* 카드 리스트 */}
        <div className="w-1/4 border-r border-border-light dark:border-border-dark pr-4">
          <h3 className="text-lg font-semibold mb-4">신청서 목록</h3>
          <div className="space-y-2">
            {submittedCards.map((card) => (
              <div
                key={card.id}
                onClick={() => setSelectedCard(card)}
                className={`p-4 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition ${
                  selectedCard?.id === card.id ? 'bg-gray-200 dark:bg-gray-600' : ''
                }`}
              >
                <div className="font-medium truncate">{card.title}</div>
                <div className="text-sm text-gray-500">{card.status}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 선택된 카드의 대시보드들 */}
        <div className="w-3/4">
          {selectedCard ? (
            <>
              <h3 className="text-lg font-semibold mb-4">
                {selectedCard.title}의 대시보드
              </h3>
              {selectedCard.grafanaDashboards?.length ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {selectedCard.grafanaDashboards.map((dashboard) => (
                    <div
                      key={dashboard.id}
                      onClick={() => setSelectedDashboard(dashboard)}
                      className="bg-panel-light dark:bg-panel-dark hover:bg-panel-light/90 dark:hover:bg-panel-dark/90 transition rounded-xl p-6 cursor-pointer"
                    >
                      <div className="h-32 bg-gradient-to-br from-purple-600 to-blue-500 rounded-lg mb-4" />
                      <h3 className="text-lg font-semibold mb-2">{dashboard.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        {dashboard.description}
                      </p>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <span className="mr-4">📊 {dashboard.panels}개 패널</span>
                        <span>⏱ {dashboard.refresh}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">연결된 대시보드가 없습니다.</p>
              )}
            </>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">왼쪽에서 신청서를 선택하세요.</p>
          )}
        </div>
      </div>

      {/* 선택된 대시보드 모달 */}
      {selectedDashboard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-panel-light dark:bg-panel-dark rounded-xl w-full max-w-6xl h-[80vh] p-6 transition-colors duration-500 relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{selectedDashboard.title}</h2>
              <button
                onClick={() => setSelectedDashboard(null)}
                className="text-gray-400 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>
            <iframe
              src={selectedDashboard.url}
              className="w-full h-[calc(100%-3rem)] rounded-lg border border-gray-300"
              frameBorder="0"
            />
          </div>
        </div>
      )}
    </Layout>
  );
}

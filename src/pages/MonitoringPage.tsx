import { useState } from 'react';
import Layout from '@/components/Layout';
import { GrafanaDashboard, SubmittedCard, useSubmitted } from '@/context/SubmittedContext';
import {
  FolderKanban,
  BarChart2,
  Clock,
  LayoutDashboard
} from 'lucide-react';

export default function MonitoringPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { submittedCards } = useSubmitted();
  const [selectedCard, setSelectedCard] = useState<SubmittedCard | null>(null);
  const [selectedDashboard, setSelectedDashboard] = useState<GrafanaDashboard | null>(null);

  return (
    <Layout collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <BarChart2 size={20} /> 시스템 모니터링
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          신청한 인프라 환경별 Grafana 대시보드를 확인할 수 있습니다.
        </p>
      </div>

      <div className="flex gap-6">
        {/* 신청서 목록 */}
        <div className="w-1/4">
          <div className="bg-panel-light dark:bg-panel-dark p-4 rounded-xl border border-border-light dark:border-border-dark shadow-sm">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FolderKanban size={18} /> 신청서 목록
            </h3>
            <div className="space-y-3">
              {submittedCards.map((card) => (
                <button
                key={card.id}
                type="button"
                onClick={() => setSelectedCard(card)}
                className={`w-full text-left p-4 rounded-lg border cursor-pointer transition shadow-sm ${
                  selectedCard?.id === card.id
                    ? 'bg-blue-100 dark:bg-blue-900 border-blue-400'
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <div className="font-medium truncate text-sm">{card.title}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{card.status}</div>
              </button>
              ))}
            </div>
          </div>
        </div>

        {/* 대시보드 목록 */}
      <div className="w-3/4">
        {selectedCard ? (
          <div className="h-full bg-white dark:bg-gray-900 border border-border-light dark:border-border-dark rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              {/* ✅ 아이콘 변경: Lucide의 LayoutDashboard 사용 */}
              <LayoutDashboard size={18} /> {selectedCard.title}의 대시보드
            </h3>
        
            {selectedCard.grafanaDashboards?.length ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {selectedCard.grafanaDashboards.map((dashboard) => (
                  <button
                  type="button"
                  onClick={() => setSelectedDashboard(dashboard)}
                  className="w-full text-left bg-panel-light dark:bg-panel-dark border border-border-light dark:border-border-dark hover:border-primary transition rounded-xl p-6 cursor-pointer shadow-md"
                  >
                    <div className="h-32 bg-gradient-to-br from-purple-600 to-blue-500 rounded-lg mb-4" />
                    <h3 className="text-base font-semibold mb-2">{dashboard.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{dashboard.description}</p>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 gap-4">
                      <span className="flex items-center gap-1">
                        <BarChart2 size={14} /> {dashboard.panels}개 패널
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} /> {dashboard.refresh}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">연결된 대시보드가 없습니다.</p>
            )}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center bg-white dark:bg-gray-900 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">왼쪽에서 신청서를 선택하세요.</p>
          </div>
        )}
      </div>
    </div>
    
      {/* 대시보드 모달 */}
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

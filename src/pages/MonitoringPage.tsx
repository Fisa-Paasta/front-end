import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

interface GrafanaDashboard {
  id: string;
  title: string;
  description: string;
  panels: number;
  refresh: string;
  url: string;
}

export default function MonitoringPage() {
  const [dashboards, setDashboards] = useState<GrafanaDashboard[]>([]);
  const [selectedDashboard, setSelectedDashboard] = useState<GrafanaDashboard | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboards = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/grafana/dashboards');
        const data: GrafanaDashboard[] = await response.json();
        setDashboards(data);
      } catch (error) {
        console.error('대시보드 로딩 중 오류 발생:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboards();
  }, []);

  return (
    <div className="min-h-screen transition-colors duration-500 bg-background-light dark:bg-background-dark text-foreground-light dark:text-foreground-dark">
      <Header />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-10">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">시스템 모니터링</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Grafana 대시보드를 통해 시스템 상태를 실시간으로 모니터링하세요.
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dashboards.map((dashboard) => (
                <div
                  key={dashboard.id}
                  onClick={() => setSelectedDashboard(dashboard)}
                  className="bg-panel-light dark:bg-panel-dark hover:bg-panel-light/90 dark:hover:bg-panel-dark/90 transition rounded-xl p-6 cursor-pointer"
                >
                  <div className="h-32 bg-gradient-to-br from-purple-600 to-blue-500 rounded-lg mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{dashboard.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{dashboard.description}</p>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <span className="mr-4">📊 {dashboard.panels}개 패널</span>
                    <span>⏱ {dashboard.refresh}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedDashboard && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
              <div className="bg-panel-light dark:bg-panel-dark rounded-xl w-full max-w-6xl h-[80vh] p-6 transition-colors duration-500">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">{selectedDashboard.title}</h2>
                  <button
                    onClick={() => setSelectedDashboard(null)}
                    className="text-gray-400 hover:text-white"
                  >✕</button>
                </div>
                <iframe
                  src={selectedDashboard.url}
                  className="w-full h-[calc(100%-4rem)] rounded-lg"
                  frameBorder="0"
                />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

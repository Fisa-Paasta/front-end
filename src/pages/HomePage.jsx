import { useState } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import DashboardDetail from '@/pages/DashboardDetail';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();
  const [dashboards, setDashboards] = useState([
    { id: 1, title: 'EKS 클러스터 구축', desc: '프로덕션용 EKS 클러스터 구축 요청입니다.', date: '2024.01.15', starred: true, status: '접수중' },
    { id: 2, title: '개발 환경 구성', desc: '개발팀을 위한 테스트 클러스터 환경 구성', date: '2024.01.14', starred: false, status: '승인완료' },
    { id: 3, title: '모니터링 시스템', desc: 'Prometheus/Grafana 기반 모니터링 구축', date: '2024.01.13', starred: true, status: '구축중' },
    { id: 4, title: 'CI/CD 파이프라인', desc: 'GitOps 기반 배포 파이프라인 구성', date: '2024.01.12', starred: true, status: '구축완료' },
    { id: 5, title: '백업 시스템', desc: '클러스터 및 데이터 백업 시스템 구축', date: '2024.01.11', starred: false, status: '접수완료' },
    { id: 6, title: '로깅 시스템', desc: 'EFK 스택 기반 중앙 로깅 시스템', date: '2024.01.10', starred: true, status: '승인처리중' },
    { id: 7, title: '스테이징 환경', desc: '스테이징용 경량 클러스터 구성', date: '2024.01.09', starred: false, status: '구축완료' },
    { id: 8, title: '서비스 메시', desc: 'Istio 기반 서비스 메시 구축', date: '2024.01.08', starred: true, status: '접수중' },
  ]);

  const [sortType, setSortType] = useState('date');
  const [selectedDashboard, setSelectedDashboard] = useState(null);

  const toggleStar = (id) => {
    setDashboards(prev =>
      prev.map(card =>
        card.id === id ? { ...card, starred: !card.starred } : card
      )
    );
  };

  const statusPriority = {
    '접수중': 1,
    '접수완료': 2,
    '승인처리중': 3,
    '승인완료': 4,
    '구축중': 5,
    '구축완료': 6,
  };

  const sortDashboards = (list) => {
    return list.sort((a, b) => {
      if (sortType === 'title') return a.title.localeCompare(b.title);
      if (sortType === 'status') return statusPriority[a.status] - statusPriority[b.status];
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  };

  const getStatusColor = (status) => {
    const map = {
      '접수중': 'bg-yellow-500 text-black',
      '접수완료': 'bg-green-600 text-white',
      '승인처리중': 'bg-blue-500 text-white',
      '승인완료': 'bg-blue-700 text-white',
      '구축중': 'bg-purple-500 text-white',
      '구축완료': 'bg-gray-500 text-white'
    };
    return map[status] || 'bg-white text-black';
  };

  const starredDashboards = sortDashboards(dashboards.filter(d => d.starred));
  const normalDashboards = sortDashboards(dashboards.filter(d => !d.starred));

  return (
    <div className="min-h-screen transition-colors duration-500 bg-background-light dark:bg-background-dark text-foreground-light dark:text-foreground-dark text-[15px]">
      <Header />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-10">
          <div className="flex items-center justify-between mb-6 min-w-0">
            <h2 className="text-2xl font-bold truncate">대시보드</h2>
            <select
              value={sortType}
              onChange={(e) => setSortType(e.target.value)}
              className="bg-input-light dark:bg-input-dark text-foreground-light dark:text-white text-sm rounded px-3 py-2 border-none outline-none shadow w-auto flex-shrink-0"
            >
              <option value="date"> 최신순</option>
              <option value="title"> 제목순</option>
              <option value="status"> 상태순</option>
            </select>
          </div>

          {starredDashboards.length > 0 && (
            <div className="mb-12">
              <h2 className="text-xl font-semibold mb-4">⭐ 즐겨찾기 대시보드</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {starredDashboards.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedDashboard(item)}
                    className="bg-panel-light dark:bg-panel-dark hover:bg-panel-light/90 dark:hover:bg-panel-dark/90 transition rounded-xl p-5 cursor-pointer"
                  >
                    <div className="relative h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-md mb-4" />
                    <div className="flex items-center justify-between mb-1">
                      <h2 className="text-base font-semibold">{item.title}</h2>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{item.desc}</p>
                    <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                      <span>{item.date}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleStar(item.id);
                        }}
                        className="hover:scale-110 transition-transform"
                      >
                        {item.starred ? '⭐' : '☆'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <h1 className="text-2xl font-bold mb-8">대시보드 리스트</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {normalDashboards.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedDashboard(item)}
                className="bg-panel-light dark:bg-panel-dark hover:bg-panel-light/90 dark:hover:bg-panel-dark/90 transition rounded-xl p-5 cursor-pointer"
              >
                <div className="relative h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-md mb-4" />
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-base font-semibold">{item.title}</h2>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{item.desc}</p>
                <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                  <span>{item.date}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleStar(item.id);
                    }}
                    className="hover:scale-110 transition-transform"
                  >
                    {item.starred ? '⭐' : '☆'}
                  </button>
                </div>
              </div>
            ))}

            <div
              onClick={() => navigate('/survey')}
              className="min-h-[160px] bg-panel-light dark:bg-panel-dark rounded-xl flex items-center justify-center text-4xl text-gray-500 hover:bg-panel-light/90 dark:hover:bg-panel-dark/80 transition"
            >
              +
            </div>
          </div>
        </main>
      </div>

      {selectedDashboard && (
        <DashboardDetail
          item={selectedDashboard}
          onClose={() => setSelectedDashboard(null)}
        />
      )}
    </div>
  );
}

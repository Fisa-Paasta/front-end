import { useSubmitted } from '@/context/SubmittedContext';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import DashboardDetail from '@/pages/DashboardDetail';
import { useNavigate } from 'react-router-dom';
import { AdminCardData, StatusType } from '@/types/admin';
import { transformSubmittedCards } from '@/utils/transformSubmitted';
import { useState } from 'react';
import { useMemo } from 'react';

export default function HomePage() {
  const navigate = useNavigate();
  const { submittedCards, toggleStarred } = useSubmitted();
  const [sortType, setSortType] = useState<'date' | 'title' | 'status'>('date');
  const [selectedDashboard, setSelectedDashboard] = useState<AdminCardData | null>(null);

  const statusPriority: Record<StatusType, number> = {
    접수중: 1,
    접수완료: 2,
    승인처리중: 3,
    승인완료: 4,
    구축중: 5,
    구축완료: 6,
  };

  const sortDashboards = (list: AdminCardData[]): AdminCardData[] => {
    return list.slice().sort((a, b) => {
      if (sortType === 'title') return a.title.localeCompare(b.title);
      if (sortType === 'status') return statusPriority[a.status] - statusPriority[b.status];
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  };

  const getStatusColor = (status: StatusType): string => {
    const map: Record<StatusType, string> = {
      접수중: 'bg-yellow-500 text-black',
      접수완료: 'bg-green-600 text-white',
      승인처리중: 'bg-blue-500 text-white',
      승인완료: 'bg-blue-700 text-white',
      구축중: 'bg-purple-500 text-white',
      구축완료: 'bg-gray-500 text-white',
    };
    return map[status] || 'bg-white text-black';
  };

  const enrichedCards = useMemo(() => transformSubmittedCards(submittedCards), [submittedCards]);
  const sorted = sortDashboards(enrichedCards);
  const starredDashboards = sorted.filter((d) => d.starred);
  const normalDashboards = sorted.filter((d) => !d.starred);

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
              onChange={(e) => setSortType(e.target.value as 'date' | 'title' | 'status')}
              className="bg-input-light dark:bg-input-dark text-foreground-light dark:text-white text-sm rounded px-3 py-2 border-none outline-none shadow w-auto flex-shrink-0"
            >
              <option value="date">최신순</option>
              <option value="title">제목순</option>
              <option value="status">상태순</option>
            </select>
          </div>

          {starredDashboards.length > 0 && (
            <div className="mb-12">
              <h2 className="text-xl font-semibold mb-4">⭐ 즐겨찾기 대시보드</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {starredDashboards.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (selectedDashboard?.id !== item.id) {
                        setSelectedDashboard(item);
                      }
                    }}
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
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleStarred(String(item.id))
                        }}
                        className="cursor-pointer"
                      >
                        {item.starred ? '⭐' : '☆'}
                      </span>
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
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleStarred(item.id.toString());
                    }}
                    className="cursor-pointer"
                  >
                    {item.starred ? '⭐' : '☆'}
                  </span>
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

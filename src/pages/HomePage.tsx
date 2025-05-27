import { useSubmitted } from '@/context/SubmittedContext';
import DashboardDetail from '@/pages/DashboardDetail';
import { useNavigate } from 'react-router-dom';
import { AdminCardData, StatusType } from '@/types/admin';
import { transformSubmittedCards } from '@/utils/transformSubmitted';
import { useState, useMemo } from 'react';
import Layout from '@/components/Layout';
import { ClipboardList, Star, StarOff } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();
  const { submittedCards, toggleStarred } = useSubmitted();
  const [sortType, setSortType] = useState<'date' | 'title' | 'status'>('date');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const statusPriority: Record<StatusType, number> = {
    접수중: 1,
    접수완료: 2,
    승인처리중: 3,
    승인완료: 4,
    구축중: 5,
    구축완료: 6,
    삭제됨: 7,
  };

  const enrichedCards = useMemo(
    () => transformSubmittedCards(submittedCards),
    [submittedCards]
  );

  const sorted = useMemo(() => {
    return [...enrichedCards].sort((a, b) => {
      if (sortType === 'title') return a.title.localeCompare(b.title);
      if (sortType === 'status') return statusPriority[a.status] - statusPriority[b.status];
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, [enrichedCards, sortType]);

  const starredDashboards = sorted.filter((d) => d.starred);
  const normalDashboards = sorted.filter((d) => !d.starred);
  const selectedDashboard = useMemo(() => enrichedCards.find((c) => c.id === selectedId) || null, [enrichedCards, selectedId]);

  const getStatusColor = (status: StatusType): string => {
    const map: Record<StatusType, string> = {
      접수중: 'bg-yellow-500 text-black',
      접수완료: 'bg-green-600 text-white',
      승인처리중: 'bg-blue-500 text-white',
      승인완료: 'bg-blue-700 text-white',
      구축중: 'bg-purple-500 text-white',
      구축완료: 'bg-gray-500 text-white',
      삭제됨: 'bg-red-500 text-black',
    };
    return map[status] || 'bg-white text-black';
  };

  const renderCard = (item: AdminCardData) => (
    <div
      key={item.id}
      onClick={() => setSelectedId(item.id)}
      className="bg-panel-light dark:bg-panel-dark hover:bg-panel-light/90 dark:hover:bg-panel-dark/90 transition rounded-xl p-5 cursor-pointer"
    >
      <div className="relative h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-md mb-4" />
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-base font-semibold truncate max-w-[70%]">{item.title}</h2>
        <span className={`px-2 py-1 rounded-md text-xs font-semibold whitespace-nowrap ${getStatusColor(item.status)}`}>
          {item.status}
        </span>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 truncate">{item.desc}</p>
      <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
        <span>{item.date}</span>
        <span
          onClick={(e) => {
            e.stopPropagation();
            toggleStarred(item.id);
          }}
          className="cursor-pointer"
        >
          {item.starred ? <Star size={14} fill="gold" strokeWidth={1.5} /> : <StarOff size={14} strokeWidth={1.5} />}
        </span>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ClipboardList size={20} /> 신청서 리스트
        </h1>
        <select
          value={sortType}
          onChange={(e) => setSortType(e.target.value as typeof sortType)}
          className="w-fit bg-input-light dark:bg-input-dark text-sm rounded px-2 py-1 shadow border border-border-light dark:border-border-dark"
        >
          <option value="date">최신순</option>
          <option value="title">제목순</option>
          <option value="status">상태순</option>
        </select>
      </div>

      {starredDashboards.length > 0 && (
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Star size={18} className="text-yellow-400" /> 즐겨찾기
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {starredDashboards.map(renderCard)}
          </div>
        </div>
      )}

      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <ClipboardList size={18} /> 대시보드
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {normalDashboards.map(renderCard)}
        <div
          onClick={() => navigate('/survey')}
          className="min-h-[160px] bg-panel-light dark:bg-panel-dark rounded-xl flex items-center justify-center text-4xl text-gray-500 hover:bg-panel-light/90 dark:hover:bg-panel-dark/80 transition"
        >
          +
        </div>
      </div>

      {selectedDashboard && (
        <DashboardDetail
          item={selectedDashboard}
          onClose={() => setSelectedId(null)}
        />
      )}
    </Layout>
  );
}

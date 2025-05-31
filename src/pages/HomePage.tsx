import { useSubmitted } from '@/context/SubmittedContext';
import { useAuth } from '@/context/AuthContext';
import DashboardDetail from '@/pages/DashboardDetail';
import { useNavigate } from 'react-router-dom';
import { AdminCardData, StatusType } from '@/types/admin';
import { transformSubmittedCards } from '@/utils/transformSubmitted';
import { useState, useMemo } from 'react';
import Layout from '@/components/Layout';
import { ClipboardList, Star, StarOff, Loader2 } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();
  const { submittedCards, toggleStarred, isLoading } = useSubmitted();
  const { user, isLoading: authLoading } = useAuth();

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

  const myCards: AdminCardData[] = useMemo(() => {
    const allCards = transformSubmittedCards(submittedCards);
    return allCards.filter(card => card.userId === user?.userId);
  }, [submittedCards, user?.userId]);

  const sorted = useMemo(() => {
    return [...myCards].sort((a, b) => {
      if (sortType === 'title') return a.title.localeCompare(b.title);
      if (sortType === 'status') return statusPriority[a.status] - statusPriority[b.status];
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, [myCards, sortType]);

  const starredDashboards = sorted.filter((d) => d.starred);
  const normalDashboards = sorted.filter((d) => !d.starred);
  const selectedDashboard = useMemo(
    () => myCards.find((c) => c.id === selectedId) ?? null,
    [myCards, selectedId]
  );

  const getStatusColor = (status: StatusType): string => {
    const map: Record<StatusType, string> = {
      접수중: 'bg-yellow-500 text-black',
      접수완료: 'bg-green-600 text-white',
      승인처리중: 'bg-blue-500 text-white',
      승인완료: 'bg-blue-700 text-white',
      구축중: 'bg-purple-500 text-white',
      구축완료: 'bg-gray-500 text-white',
      삭제됨: 'bg-red-500 text-white',
    };
    return map[status] ?? 'bg-white text-black';
  };

  const handleCardClick = (item: AdminCardData) => {
    setSelectedId(item.id);
  };

  const handleCardKeyDown = (item: AdminCardData, e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setSelectedId(item.id);
    }
  };

  const handleNewApplicationClick = () => {
    navigate('/survey');
  };

  const handleNewApplicationKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      navigate('/survey');
    }
  };

  const handleStarToggle = (item: AdminCardData, e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    if ('key' in e && !(e.key === 'Enter' || e.key === ' ')) {
      return;
    }
    if ('key' in e) {
      e.preventDefault();
    }
    toggleStarred(item.id);
  };

  const renderCard = (item: AdminCardData) => (
    <button
      key={item.id}
      type="button"
      onClick={() => handleCardClick(item)}
      onKeyDown={(e) => handleCardKeyDown(item, e)}
      className={`bg-panel-light dark:bg-panel-dark hover:bg-panel-light/90 dark:hover:bg-panel-dark/90 transition rounded-xl p-5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary text-left w-full ${
        item.status === '삭제됨' ? 'opacity-60 border-2 border-red-300' : ''
      }`}
      aria-label={`신청서: ${item.title}, 상태: ${item.status}, 즐겨찾기 ${item.starred ? '활성화' : '비활성화'}`}
    >
      <div className="relative h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-md mb-4" />
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-base font-semibold truncate max-w-[70%]">
          {item.title}
          {item.status === '삭제됨' && <span className="text-red-500 text-xs ml-1">(삭제됨)</span>}
        </h2>
        <span className={`px-2 py-1 rounded-md text-xs font-semibold whitespace-nowrap ${getStatusColor(item.status)}`}>
          {item.status}
        </span>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 truncate">{item.desc}</p>
      <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
        <span>{item.date}</span>
        <button
          type="button"
          onClick={(e) => handleStarToggle(item, e)}
          onKeyDown={(e) => handleStarToggle(item, e)}
          className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary rounded p-1"
          aria-label={`${item.title} 즐겨찾기 ${item.starred ? '제거' : '추가'}`}
        >
          {item.starred ? <Star size={14} fill="gold" strokeWidth={1.5} /> : <StarOff size={14} strokeWidth={1.5} />}
        </button>
      </div>
    </button>
  );

  // 로딩 중 표시
  if (authLoading || isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-3 text-lg">
            <Loader2 size={24} className="animate-spin" />
            <span>신청서 목록을 불러오는 중...</span>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ClipboardList size={20} /> 신청서 리스트
          {myCards.length > 0 && (
            <span className="text-sm font-normal text-gray-500">({myCards.length}개)</span>
          )}
        </h1>
        <label htmlFor="sort-select" className="sr-only">정렬 방식 선택</label>
        <select
          id="sort-select"
          value={sortType}
          onChange={(e) => setSortType(e.target.value as typeof sortType)}
          className="w-fit bg-input-light dark:bg-input-dark text-sm rounded px-2 py-1 shadow border border-border-light dark:border-border-dark focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="date">최신순</option>
          <option value="title">제목순</option>
          <option value="status">상태순</option>
        </select>
      </div>

      {starredDashboards.length > 0 && (
        <section className="mb-12" aria-labelledby="starred-heading">
          <h2 id="starred-heading" className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Star size={18} className="text-yellow-400" /> 즐겨찾기
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {starredDashboards.map(renderCard)}
          </div>
        </section>
      )}

      <section aria-labelledby="main-dashboard-heading">
        <h2 id="main-dashboard-heading" className="text-xl font-semibold mb-4 flex items-center gap-2">
          <ClipboardList size={18} /> 대시보드
        </h2>
        
        {normalDashboards.length === 0 && starredDashboards.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-lg font-semibold mb-2">아직 신청서가 없습니다</h3>
            <p className="text-gray-500 mb-4">새로운 인프라 환경을 신청해보세요!</p>
            <button
              type="button"
              onClick={() => navigate('/survey')}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition focus:outline-none focus:ring-2 focus:ring-primary"
            >
              첫 신청서 작성하기
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {normalDashboards.map(renderCard)}
            <button
              type="button"
              onClick={handleNewApplicationClick}
              onKeyDown={handleNewApplicationKeyDown}
              className="min-h-[160px] bg-panel-light dark:bg-panel-dark rounded-xl flex items-center justify-center text-4xl text-gray-500 hover:bg-panel-light/90 dark:hover:bg-panel-dark/80 transition cursor-pointer border-2 border-dashed border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="새 신청서 작성하기"
            >
              +
            </button>
          </div>
        )}
      </section>

      {selectedDashboard && (
        <DashboardDetail
          item={selectedDashboard}
          onClose={() => setSelectedId(null)}
        />
      )}
    </Layout>
  );
}
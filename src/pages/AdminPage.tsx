import React, { useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminCardList from '@/components/admin/AdminCardList';
import AdminCardDetail from '@/components/admin/AdminCardDetail';
import LogView from '@/components/admin/LogView';
import { AdminCardData } from '@/types/admin';

const STATUS_OPTIONS = ['접수중', '접수완료', '승인처리중', '승인완료', '구축중', '구축완료'];

export default function AdminPage() {
  const [cards, setCards] = useState<AdminCardData[]>([
  {
    id: 1,
    title: '테스트 신청 A',
    userId: 'A1234',
    desc: '백엔드 클러스터 요청',
    date: '2025-05-14',
    status: '접수완료',
    historyList: [
      { timestamp: '2025-05-13T10:00:00Z', status: '접수중' },
      { timestamp: '2025-05-14T09:00:00Z', status: '접수완료' }
    ]
  },
  {
    id: 2,
    title: '프론트 클러스터 신청',
    userId: 'B5678',
    desc: '프론트엔드용 리소스',
    date: '2025-05-15',
    status: '승인처리중',
    historyList: [
      { timestamp: '2025-05-14T12:00:00Z', status: '접수완료' },
      { timestamp: '2025-05-15T08:00:00Z', status: '승인처리중' }
    ]
  },
  {
    id: 3,
    title: '내부망 구축 요청',
    userId: 'C4321',
    desc: '보안 등급 높은 인프라 요청',
    date: '2025-05-16',
    status: '구축중',
    historyList: [
      { timestamp: '2025-05-15T09:00:00Z', status: '승인완료' },
      { timestamp: '2025-05-16T10:30:00Z', status: '구축중', approver: 'admin01' }
    ]
  }
]);

  const [selectedItem, setSelectedItem] = useState<AdminCardData | null>(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterUserId, setFilterUserId] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [bulkStatus, setBulkStatus] = useState('승인완료');
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [activeSidebar, setActiveSidebar] = useState<string>('전체 요청');

  const handleSidebarFilter = (status: string, label: string) => {
    setFilterStatus(status === 'LOG_VIEW' ? '' : status);
    setActiveSidebar(label);
  };

  const handleStatusChange = (id: number, newStatus: string) => {
    const updatedCards = cards.map(card =>
      card.id === id
        ? {
            ...card,
            status: newStatus,
            historyList: [
              ...(card.historyList || []),
              { timestamp: new Date().toISOString(), status: newStatus }
            ]
          }
        : card
    );
    setCards(updatedCards);
    const updatedSelected = updatedCards.find(card => card.id === id);
    if (updatedSelected) setSelectedItem(updatedSelected);
  };

  const handleBulkStatusChange = () => {
    const updatedCards = cards.map(card =>
      selectedIds.has(card.id)
        ? {
            ...card,
            status: bulkStatus,
            historyList: [
              ...(card.historyList || []),
              { timestamp: new Date().toISOString(), status: bulkStatus }
            ]
          }
        : card
    );
    setCards(updatedCards);
    setSelectedIds(new Set());
  };

  const toggleCardSelection = (id: number) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const filteredCards = cards.filter(card =>
    (!filterUserId || card.userId.includes(filterUserId)) &&
    (!filterStatus || card.status === filterStatus) &&
    (!filterDate || card.date === filterDate)
  );

  return (
    <div className="flex h-screen bg-background-light dark:bg-background-dark text-foreground-light dark:text-foreground-dark transition-colors">
      <AdminSidebar onFilter={handleSidebarFilter} active={activeSidebar} />
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-6">
          {activeSidebar === '로그 보기' ? '📜 로그 보기' : '📋 신청 내역 관리'}
        </h1>

        {activeSidebar === '로그 보기' ? (
          <LogView cards={cards} />
        ) : (
          <>
            <div className="flex gap-4 mb-4 items-center">
              {<div className="flex gap-4 mb-4 items-center">
  <input
    type="text"
    placeholder="사번 검색"
    value={filterUserId}
    onChange={(e) => setFilterUserId(e.target.value)}
    className="px-3 py-1 border rounded"
  />
  <select
    value={filterStatus}
    onChange={(e) => setFilterStatus(e.target.value)}
    className="px-3 py-1 border rounded"
  >
    <option value="">전체 상태</option>
    {STATUS_OPTIONS.map((s) => (
      <option key={s} value={s}>{s}</option>
    ))}
  </select>
  <input
    type="date"
    value={filterDate}
    onChange={(e) => setFilterDate(e.target.value)}
    className="px-3 py-1 border rounded"
  />
  <select
    value={bulkStatus}
    onChange={(e) => setBulkStatus(e.target.value)}
    className="px-3 py-1 border rounded"
  >
    {STATUS_OPTIONS.map((s) => (
      <option key={s} value={s}>{s}로 변경</option>
    ))}
  </select>
  <button
  onClick={handleBulkStatusChange}
  className="px-6 py-2 bg-primary text-white rounded-md shadow hover:bg-primary-hover transition font-semibold text-sm whitespace-nowrap"
>
  ✅ 선택 항목 일괄 변경
</button>

</div>
}
            </div>
            <AdminCardList
              cards={filteredCards}
              onSelect={(item, e) => {
                if (e.target instanceof HTMLInputElement) return;
                setSelectedItem(item);
              }}
              selectedIds={selectedIds}
              onToggleSelect={toggleCardSelection}
            />
          </>
        )}
      </main>

      {selectedItem && (
        <AdminCardDetail
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}

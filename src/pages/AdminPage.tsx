import { useState } from 'react';

import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminCardList from '@/components/admin/AdminCardList';
import AdminCardDetail from '@/components/admin/AdminCardDetail';
import LogView from '@/components/admin/LogView';
import AdminFilterBar from '@/components/admin/AdminFilterBar';

import { useSubmitted } from '@/context/SubmittedContext';
import { transformSubmittedCards } from '@/utils/transformSubmitted';

import { StatusType, STATUS_ENUM } from '@/types/admin';

const STATUS_BADGE_COLORS: Record<StatusType, string> = {
  접수중: 'bg-yellow-500 text-black',
  접수완료: 'bg-green-600 text-white',
  승인처리중: 'bg-blue-500 text-white',
  승인완료: 'bg-blue-700 text-white',
  구축중: 'bg-purple-500 text-white',
  구축완료: 'bg-gray-500 text-white',
};

export default function AdminPage() {
  const { submittedCards, updateCardStatus } = useSubmitted();
  const cards = transformSubmittedCards(submittedCards);

  const [selectedItem, setSelectedItem] = useState<typeof cards[0] | null>(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterUserId, setFilterUserId] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [bulkStatus, setBulkStatus] = useState<StatusType>('승인완료');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [activeSidebar, setActiveSidebar] = useState<string>('전체 요청');

  const handleSidebarFilter = (status: string, label: string) => {
    setFilterStatus(status === 'LOG_VIEW' ? '' : status);
    setActiveSidebar(label);
  };

  const handleStatusChange = (id: string, newStatus: StatusType) => {
    updateCardStatus(id, newStatus);
    const updatedSelected = cards.find(card => card.id === id);
    if (updatedSelected) setSelectedItem(updatedSelected);
  };

  const handleBulkStatusChange = () => {
    selectedIds.forEach(id => updateCardStatus(id, bulkStatus));
    setSelectedIds(new Set());
  };

  const toggleCardSelection = (id: string) => {
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
            <AdminFilterBar
              filterUserId={filterUserId}
              setFilterUserId={setFilterUserId}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              filterDate={filterDate}
              setFilterDate={setFilterDate}
              bulkStatus={bulkStatus}
              setBulkStatus={setBulkStatus}
              onBulkApply={handleBulkStatusChange}
              statusOptions={Object.values(STATUS_ENUM)}
            />

            <AdminCardList
              cards={filteredCards}
              onSelect={(item, e) => {
                if (e.target instanceof HTMLInputElement) return;
                setSelectedItem(item);
              }}
              selectedIds={selectedIds}
              onToggleSelect={toggleCardSelection}
              badgeColors={STATUS_BADGE_COLORS}
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

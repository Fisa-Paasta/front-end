import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminCardList from '@/components/admin/AdminCardList';
import AdminCardDetail from '@/components/admin/AdminCardDetail';
import LogView from '@/components/admin/LogView';
import AdminFilterBar from '@/components/admin/AdminFilterBar';

import { StatusType, STATUS_ENUM } from '@/types/admin';
import { useSubmitted } from '@/context/SubmittedContext';
import { SubmittedCard } from '@/context/SubmittedContext'; 

const STATUS_BADGE_COLORS: Record<StatusType, string> = {
  접수중: 'bg-yellow-500 text-black',
  접수완료: 'bg-green-600 text-white',
  승인처리중: 'bg-blue-500 text-white',
  승인완료: 'bg-blue-700 text-white',
  구축중: 'bg-purple-500 text-white',
  구축완료: 'bg-gray-500 text-white',
  삭제됨: 'bg-red-600 text-white',
};

export default function AdminPage() {
  const navigate = useNavigate();
  const {
    submittedCards,
    deleteCard,
    updateCardContent,
    updateCardStatus,
    refreshCards,
    isLoading,
  } = useSubmitted();

  const [selectedItem, setSelectedItem] = useState<SubmittedCard | null>(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterUserId, setFilterUserId] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [bulkStatus, setBulkStatus] = useState<StatusType>('승인완료');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [activeSidebar, setActiveSidebar] = useState<string>('전체 요청');

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'admin') {
      alert('관리자만 접근 가능한 페이지입니다.');
      navigate('/home');
    }
  }, [navigate]);

  const handleSidebarFilter = (status: string, label: string) => {
    setFilterStatus(status === 'LOG_VIEW' ? '' : status);
    setActiveSidebar(label);
  };

  const handleDelete = async (id: string, comment?: string) => {
    try {
      const res = await fetch(`http://localhost:8080/api/admin/applications/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          status: 'DELETED',
          comments: comment ?? '관리자가 삭제함',
          approverEmployeeId: localStorage.getItem('userId'),
        }),
      });
  
      if (!res.ok) throw new Error('삭제 실패');
  
      await deleteCard(id, comment);
      await refreshCards(); // 상태 동기화
      setSelectedItem(null); // ✅ 명확한 선택 해제 (최신 카드 다시 선택 권장 시점)
  
    } catch (err) {
      console.error('❌ 삭제 실패:', err);
      alert('❌ 삭제 중 오류가 발생했습니다.');
    }
  };
  
  
  
  const handleEdit = (id: string, newTitle: string, newDesc: string) => {
    updateCardContent(id, newTitle, newDesc);
  };

  const handleStatusChange = async (id: string, newStatus: StatusType) => {
    try {
      const res = await fetch(`http://localhost:8080/api/admin/applications/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          status: newStatus,
          comments: `상태를 ${newStatus}로 변경`,
          approverEmployeeId: localStorage.getItem('userId'),
        }),
      });
      if (!res.ok) throw new Error('상태 변경 실패');

      updateCardStatus(id, newStatus, `상태를 ${newStatus}로 변경`);
      const updated = submittedCards.find(card => card.id === id);
      if (updated) setSelectedItem({ ...updated, status: newStatus });
    } catch (err) {
      console.error('❌ 상태 업데이트 실패:', err);
      alert('❌ 상태 업데이트 중 오류가 발생했습니다.');
    }
  };

  const handleBulkStatusChange = async () => {
    if (selectedIds.size === 0) {
      alert('선택된 항목이 없습니다.');
      return;
    }
    try {
      const promises = Array.from(selectedIds).map(id =>
        fetch(`http://localhost:8080/api/admin/applications/${id}/status`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            status: bulkStatus,
            comments: `일괄 처리: ${bulkStatus}로 변경`,
            approverEmployeeId: localStorage.getItem('userId'),
          }),
        })
      );
      await Promise.all(promises);
      alert(`✅ ${selectedIds.size}개 항목이 ${bulkStatus}로 변경되었습니다.`);
      setSelectedIds(new Set());
      await refreshCards();
    } catch (err) {
      console.error('❌ 일괄 상태 변경 실패:', err);
      alert('❌ 일괄 상태 변경 중 오류가 발생했습니다.');
    }
  };

  const toggleCardSelection = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const filteredCards = submittedCards.filter(card => {
    const userIdMatch =
      !filterUserId || (card.userId?.toLowerCase() ?? '').includes(filterUserId.toLowerCase());
  
    const dateMatch = !filterDate || card.date === filterDate;
  
    let statusMatch = true;
  
    if (filterStatus) {
      statusMatch = card.status === filterStatus;
    } else {
      if (activeSidebar === '삭제된 요청') {
        statusMatch = card.status === '삭제됨';
      } else {
        statusMatch = card.status !== '삭제됨';
      }
    }
  
    return userIdMatch && dateMatch && statusMatch;
  });
  

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background-light dark:bg-background-dark text-foreground-light dark:text-foreground-dark transition-colors">
        <div className="text-lg">📋 신청서 목록을 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background-light dark:bg-background-dark text-foreground-light dark:text-foreground-dark transition-colors">
      <AdminSidebar onFilter={handleSidebarFilter} active={activeSidebar} />

      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-6">
          {activeSidebar === '로그 보기' ? '📜 로그 보기' : '📋 신청 내역 관리'}
          <span className="text-sm font-normal text-gray-500 ml-2">
            (총 {submittedCards.length}개)
          </span>
        </h1>

        {activeSidebar === '로그 보기' ? (
          <LogView cards={submittedCards} />
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

            {filteredCards.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                📭 해당 조건에 맞는 신청서가 없습니다.
              </div>
            ) : (
              <AdminCardList
                cards={filteredCards}
                onSelect={(item, e) => {
                  if (e.target instanceof HTMLInputElement) return;
                  setSelectedItem(item);
                }}
                selectedIds={selectedIds}
                onToggleSelect={toggleCardSelection}
                badgeColors={STATUS_BADGE_COLORS}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            )}
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

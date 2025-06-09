import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminCardList from '@/components/admin/AdminCardList';
import AdminCardDetail from '@/components/admin/AdminCardDetail';
import LogView from '@/components/admin/LogView';
import AdminFilterBar from '@/components/admin/AdminFilterBar';

import { StatusType, STATUS_ENUM, AdminCardData } from '@/types/admin';
import { useSubmitted } from '@/context/SubmittedContext';

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

  const [selectedItem, setSelectedItem] = useState<AdminCardData | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterUserId, setFilterUserId] = useState<string>('');
  const [filterDate, setFilterDate] = useState<string>('');
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

  const handleDelete = async (id: string, comment?: string): Promise<void> => {
    try {
      console.log(`🗑️ 삭제 요청 시작: ${id}`);
      
      const response = await fetch(`/api/admin/applications/${id}/status`, {
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

      if (!response.ok) {
        throw new Error(`삭제 실패`);
      }

      console.log('✅ 서버 삭제 성공');
      deleteCard(id, comment);
      
      if (selectedItem && selectedItem.id === id) {
        setSelectedItem(null);
      }

      await refreshCards();

    } catch (err) {
      console.error('❌ 삭제 실패:', err);
      alert('❌ 삭제 중 오류가 발생했습니다.');
    }
  };
  
  const handleEdit = (id: string, newTitle: string, newDesc: string): void => {
    updateCardContent(id, newTitle, newDesc);
  };

  // ✅ 수정: 완전한 상태 매핑 추가
  const handleStatusChange = async (id: string, newStatus: StatusType): Promise<void> => {
    console.log(`🔄 상태 변경 시도: ${id} → ${newStatus}`);
    
    try {
      // ✅ 백엔드 enum과 정확히 매칭되는 상태 매핑
      const statusMapping: Record<StatusType, string> = {
        '접수중': 'RECEIVED',           // 백엔드의 RECEIVED
        '접수완료': 'RECEIVED_COMPLETE', // 백엔드의 RECEIVED_COMPLETE  
        '승인처리중': 'APPROVAL_PENDING', // 백엔드의 APPROVAL_PENDING
        '승인완료': 'APPROVED',          // 백엔드의 APPROVED
        '구축중': 'BUILDING',           // 백엔드의 BUILDING
        '구축완료': 'COMPLETED',        // 백엔드의 COMPLETED
        '삭제됨': 'DELETED',            // 백엔드의 DELETED
      };

      const backendStatus = statusMapping[newStatus];
      if (!backendStatus) {
        throw new Error(`알 수 없는 상태: ${newStatus}`);
      }

      console.log(`📤 서버로 전송할 상태: ${backendStatus}`);

      const response = await fetch(`/api/admin/applications/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          status: backendStatus,
          comments: `관리자가 상태를 '${newStatus}'로 변경`,
          approverEmployeeId: localStorage.getItem('userId'),
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ 서버 응답 오류:', response.status, errorText);
        throw new Error(`상태 변경 실패: ${response.status}`);
      }

      console.log('✅ 서버 상태 변경 성공');

      // ✅ 로컬 상태 즉시 업데이트
      updateCardStatus(id, newStatus, `관리자가 상태를 '${newStatus}'로 변경`);
      
      // ✅ 선택된 아이템도 즉시 업데이트
      if (selectedItem && selectedItem.id === id) {
        setSelectedItem(prev => prev ? { 
          ...prev, 
          status: newStatus,
          historyList: [
            // ✅ 소나큐브 수정: nullish coalescing 연산자 사용
            ...(prev.historyList ?? []),
            {
              by: localStorage.getItem('userId') ?? 'admin',
              timestamp: new Date().toISOString(),
              note: `관리자가 상태를 '${newStatus}'로 변경`,
              status: newStatus
            }
          ]
        } : null);
      }

      // ✅ 서버와 동기화 (백그라운드에서)
      await refreshCards();
      
    } catch (err) {
      console.error('❌ 상태 업데이트 실패:', err);
      alert(`❌ 상태 변경 중 오류가 발생했습니다: ${err instanceof Error ? err.message : '알 수 없는 오류'}`);
      // 실패 시 서버 상태로 복구
      await refreshCards();
      throw err;
    }
  };

  const handleBulkStatusChange = async (): Promise<void> => {
    if (selectedIds.size === 0) {
      alert('선택된 항목이 없습니다.');
      return;
    }

    try {
      const promises = Array.from(selectedIds).map(id =>
        handleStatusChange(id, bulkStatus)
      );

      await Promise.all(promises);
      alert(`✅ ${selectedIds.size}개 항목이 ${bulkStatus}로 변경되었습니다.`);
      setSelectedIds(new Set());
      
    } catch (err) {
      console.error('❌ 일괄 상태 변경 실패:', err);
      alert('❌ 일괄 상태 변경 중 오류가 발생했습니다.');
    }
  };

  const toggleCardSelection = (id: string): void => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const filteredCards = submittedCards.filter(card => {
    const userIdMatch =
      // ✅ 소나큐브 수정: 논리 연산자는 그대로 유지, nullish coalescing은 적절한 곳에만 사용
      !filterUserId || (card.userId?.toLowerCase() ?? '').includes(filterUserId.toLowerCase());
  
    const dateMatch = !filterDate || card.date === filterDate;
  
    let statusMatch = true;
  
    if (filterStatus) {
      statusMatch = card.status === filterStatus;
    } else {
      const isDeletedView = activeSidebar === '삭제된 요청';
      statusMatch = isDeletedView ? card.status === '삭제됨' : card.status !== '삭제됨';
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
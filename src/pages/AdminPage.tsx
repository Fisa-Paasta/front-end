import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminCardList from '@/components/admin/AdminCardList';
import AdminCardDetail from '@/components/admin/AdminCardDetail';
import LogView from '@/components/admin/LogView';
import AdminFilterBar from '@/components/admin/AdminFilterBar';
import { SubmittedCard } from '@/context/SubmittedContext';

import { StatusType, STATUS_ENUM, AdminCardData } from '@/types/admin';

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

  // ✅ 관리자 권한 확인
  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'admin') {
      alert('관리자만 접근 가능한 페이지입니다.');
      navigate('/home');
    }
  }, [navigate]);

  // ✅ 서버에서 데이터 가져오기
  const [cards, setCards] = useState<AdminCardData[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedItem, setSelectedItem] = useState<AdminCardData | null>(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterUserId, setFilterUserId] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [bulkStatus, setBulkStatus] = useState<StatusType>('승인완료');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [activeSidebar, setActiveSidebar] = useState<string>('전체 요청');

  // ✅ 서버에서 전체 신청서 가져오기
  const fetchAllApplications = async () => {
    try {
      setLoading(true);
      console.log('🔄 관리자 신청서 목록 로드 시작...');
      
      const response = await fetch('http://localhost:8080/api/admin/applications', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) throw new Error('신청서 목록 가져오기 실패');

      const applications = await response.json();
      console.log('📋 관리자 신청서 원본 데이터:', applications);
      
      // ApplicationResponse를 AdminCardData로 변환
const adminCards: AdminCardData[] = applications.map((app: any) => {
  const history: SubmittedCard['historyList'] = [];

  // ✅ 서버에서 내려온 historyList가 있다면 먼저 반영
  if (Array.isArray(app.historyList)) {
    history.push(
      ...app.historyList.map((h: any) => ({
        by: h.approver || 'system',
        timestamp: h.timestamp || app.createdAt,
        note: h.comment || '',
        status: convertStatusToKorean(h.status || app.status),
      }))
    );
  }

  // ✅ 최신 상태가 반영되지 않았다면 수동으로 추가
  history.push({
    by: app.approvedBy || 'system',
    timestamp: app.updatedAt || app.createdAt,
    note: app.comments || '상태 변경됨',
    status: convertStatusToKorean(app.status),
  });

  return {
    id: app.id.toString(),
    title: app.title,
    desc: app.description || '—',
    date: new Date(app.createdAt).toISOString().split('T')[0],
    status: convertStatusToKorean(app.status),
    starred: false,
    userId: app.employeeId,
    formDataSnapshot: {
      env: app.envType,
      vm: {
        hostname: app.vmHostname || '',
        username: app.vmUsername || '',
        environment: app.vmEnvironment || 'on-premise',
        ec2Type: app.vmEc2Type || '',
        ebsType: app.vmEbsType || '',
        ebsSize: app.vmEbsSize || '',
      },
      k8s: {
        type: app.k8sType || '',
        namespace: app.k8sNamespace || '',
        node: app.k8sNodeCount || '',
        version: '',
      },
      resources: {
        cpu: app.resourceCpu || '',
        ram: app.resourceRam || '',
        disk: app.resourceDisk || '',
      },
      os: {
        name: app.osName || '',
        version: app.osVersion || '',
      },
      frontendItems: app.frontendItems ? JSON.parse(app.frontendItems) : [],
      frontendDomain: app.frontendDomain || '',
      backendItems: app.backendItems ? JSON.parse(app.backendItems) : [],
      apiDomain: app.apiDomain || '',
      apiPaths: app.apiPaths ? JSON.parse(app.apiPaths) : [],
      webServerItems: app.webServerItems ? JSON.parse(app.webServerItems) : [],
      dbItems: app.dbItems ? JSON.parse(app.dbItems) : [],
      userId: app.employeeId,
    },
    historyList: history,
  };
});


      console.log('✅ 변환된 관리자 카드 데이터:', adminCards);
      console.log('🔍 삭제됨 상태 카드 수:', adminCards.filter(card => card.status === '삭제됨').length);
      
      setCards(adminCards);
    } catch (err) {
      console.error('❌ 관리자 신청서 목록 로드 실패:', err);
      alert('신청서 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ 초기 로드
  useEffect(() => {
    fetchAllApplications();
  }, []);

  const handleSidebarFilter = (status: string, label: string) => {
    setFilterStatus(status === 'LOG_VIEW' ? '' : status);
    setActiveSidebar(label);
  };

  const handleDelete = async (id: string, comment?: string) => {
    try {
      const response = await fetch(`http://localhost:8080/api/admin/applications/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          status: 'DELETED',
          comments: comment || '관리자가 삭제함',
          approverEmployeeId: localStorage.getItem('userId'),
        }),
      });

      if (!response.ok) throw new Error('삭제 실패');

      alert('✅ 신청서가 삭제되었습니다.');
      await fetchAllApplications(); // 목록 새로고침
    } catch (err) {
      console.error('❌ 삭제 실패:', err);
      alert('❌ 삭제 중 오류가 발생했습니다.');
    }
  };

  const handleEdit = async (id: string, newTitle: string, newDesc: string) => {
    try {
      const response = await fetch(`http://localhost:8080/api/applications/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          title: newTitle,
          description: newDesc,
        }),
      });
  
      if (!response.ok) throw new Error('서버 수정 실패');
  
      await fetchAllApplications(); // ✅ 최신 정보 반영
    } catch (err) {
      console.error('❌ 관리자 요청 수정 실패:', err);
      alert('요청사항 수정에 실패했습니다.');
    }
  };
  

  const handleStatusChange = async (id: string, newStatus: StatusType) => {
    try {
      const response = await fetch(`http://localhost:8080/api/admin/applications/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          status: convertKoreanToEnglish(newStatus),
          comments: `상태를 ${newStatus}로 변경`,
          approverEmployeeId: localStorage.getItem('userId'),
        }),
      });

      if (!response.ok) throw new Error('상태 업데이트 실패');

      console.log('✅ 상태 업데이트 성공');
      await fetchAllApplications(); // 목록 새로고침
      
      // 선택된 아이템 업데이트
      const updatedCard = cards.find(card => card.id === id);
      if (updatedCard) {
        setSelectedItem({ ...updatedCard, status: newStatus });
      }
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
            status: convertKoreanToEnglish(bulkStatus),
            comments: `일괄 처리: ${bulkStatus}로 변경`,
            approverEmployeeId: localStorage.getItem('userId'),
          }),
        })
      );

      await Promise.all(promises);
      alert(`✅ ${selectedIds.size}개 항목이 ${bulkStatus}로 변경되었습니다.`);
      
      setSelectedIds(new Set());
      await fetchAllApplications();
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

  // ✅ 필터링 로직 수정
  const filteredCards = cards.filter(card => {
    // 사번 검색 (부분 일치)
    const userIdMatch =
  !filterUserId || (card.userId?.toLowerCase() ?? '').includes(filterUserId.toLowerCase());

    
    // 날짜 필터
    const dateMatch = !filterDate || card.date === filterDate;
    
    // 상태 필터
    let statusMatch = true;
    if (filterStatus) {
      statusMatch = card.status === filterStatus;
    } else {
      // 기본적으로 삭제된 카드는 숨김 (단, "삭제됨" 메뉴 선택 시 제외)
      statusMatch = activeSidebar === '삭제된 요청' || card.status !== '삭제됨';
    }
    
    return userIdMatch && dateMatch && statusMatch;
  });

  if (loading) {
    return (
      <div className="flex h-screen bg-background-light dark:bg-background-dark text-foreground-light dark:text-foreground-dark transition-colors items-center justify-center">
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
            (총 {cards.length}개)
          </span>
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

// ✅ 상태 변환 헬퍼 함수들
const convertStatusToKorean = (status: string): StatusType => {
  const statusMap: Record<string, StatusType> = {
    '접수중': '접수중',
    '접수완료': '접수완료', 
    '승인처리중': '승인처리중',
    '승인완료': '승인완료',
    '구축중': '구축중',
    '구축완료': '구축완료',
    '삭제됨': '삭제됨',
  };
  return statusMap[status] || '접수중';
};

const convertKoreanToEnglish = (status: StatusType): string => {
  const statusMap: Record<StatusType, string> = {
    '접수중': 'RECEIVED',
    '접수완료': 'RECEIVED_COMPLETE',
    '승인처리중': 'APPROVAL_PENDING', 
    '승인완료': 'APPROVED',
    '구축중': 'BUILDING',
    '구축완료': 'COMPLETED',
    '삭제됨': 'DELETED',
  };
  return statusMap[status] || 'RECEIVED';
};
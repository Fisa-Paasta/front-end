import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { StatusType } from '@/types/admin';
import { FormDataType } from '@/types/survey';
import { useAuth } from '@/context/AuthContext';

export interface GrafanaDashboard {
  id: string;
  title: string;
  description: string;
  panels: number;
  refresh: string;
  url: string;
}

export interface SubmittedCard {
  id: string;
  title: string;
  desc: string;
  date: string;
  status: StatusType;
  starred: boolean;
  userId?: string;
  formDataSnapshot: FormDataType & { userId?: string };
  grafanaDashboards?: GrafanaDashboard[];
  historyList?: {
    by?: string;
    timestamp?: string;
    note?: string;
    status?: StatusType; 
  }[];
}

interface SubmittedContextType {
  submittedCards: SubmittedCard[];
  addSubmittedCard: (card: Omit<SubmittedCard, 'id'>) => Promise<void>;
  toggleStarred: (id: string) => void;
  updateCardStatus: (id: string, newStatus: StatusType, note?: string) => void;
  attachGrafanaDashboards: (id: string, dashboards: GrafanaDashboard[]) => void;
  updateCardContent: (id: string, newTitle: string, newDesc: string) => void;
  deleteCard: (id: string, note?: string) => void;
  refreshCards: () => Promise<void>;
  isLoading: boolean;
}

const SubmittedContext = createContext<SubmittedContextType | undefined>(undefined);

// ✅ 상태 변환 헬퍼 함수 분리
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
  return statusMap[status] ?? '접수중';
};

// ✅ 히스토리 아이템 생성 함수 분리
const createHistoryItem = (app: any, status: StatusType) => ({
  by: app.approvedBy ?? 'system',
  timestamp: app.updatedAt ?? app.createdAt,
  note: app.comments ?? '',
  status,
});

// ✅ 폼 데이터 스냅샷 생성 함수 분리
const createFormDataSnapshot = (app: any): FormDataType & { userId?: string } => ({
  env: app.envType,
  vm: {
    hostname: app.vmHostname ?? '',
    username: app.vmUsername ?? '',
    environment: app.vmEnvironment ?? 'on-premise',
    ec2Type: app.vmEc2Type ?? '',
    ebsType: app.vmEbsType ?? '',
    ebsSize: app.vmEbsSize ?? '',
  },
  k8s: {
    type: app.k8sType ?? '',
    namespace: app.k8sNamespace ?? '',
    node: app.k8sNodeCount ?? '',
    version: '',
  },
  resources: {
    cpu: app.resourceCpu ?? '',
    ram: app.resourceRam ?? '',
    disk: app.resourceDisk ?? '',
  },
  os: {
    name: app.osName ?? '',
    version: app.osVersion ?? '',
  },
  frontendItems: app.frontendItems ? JSON.parse(app.frontendItems) : [],
  frontendDomain: app.frontendDomain ?? '',
  backendItems: app.backendItems ? JSON.parse(app.backendItems) : [],
  apiDomain: app.apiDomain ?? '',
  apiPaths: app.apiPaths ? JSON.parse(app.apiPaths) : [],
  webServerItems: app.webServerItems ? JSON.parse(app.webServerItems) : [],
  dbItems: app.dbItems ? JSON.parse(app.dbItems) : [],
  userId: app.employeeId,
});

// ✅ 카드 변환 함수 분리 (중첩 레벨 감소)
const transformApplicationToCard = (app: any, existingCard?: SubmittedCard): SubmittedCard => {
  const id = app.id.toString();
  const status = convertStatusToKorean(app.status);
  const newHistoryItem = createHistoryItem(app, status);
  const existingHistory = existingCard?.historyList ?? [];

  const isDuplicate = existingHistory.some(
    h =>
      h.timestamp === newHistoryItem.timestamp &&
      h.note === newHistoryItem.note &&
      h.status === newHistoryItem.status
  );

  return {
    id,
    title: app.title,
    desc: status === '삭제됨' ? app.comments ?? '—' : app.description ?? '—',
    date: new Date(app.createdAt).toISOString().split('T')[0],
    status,
    starred: existingCard?.starred ?? false,
    userId: app.employeeId,
    formDataSnapshot: createFormDataSnapshot(app),
    historyList: isDuplicate ? existingHistory : [...existingHistory, newHistoryItem],
  };
};

export const SubmittedProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [submittedCards, setSubmittedCards] = useState<SubmittedCard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user, isLoading: authLoading } = useAuth();

  // ✅ 서버에서 카드 목록 불러오기 함수 분리
  const fetchCardsFromServer = useCallback(async (): Promise<SubmittedCard[]> => {
    const isAdmin = localStorage.getItem('role') === 'admin';
    const url = isAdmin
      ? `http://localhost:8080/api/admin/applications`
      : `http://localhost:8080/api/applications/employee/${user?.userId}`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!res.ok) {
      if (res.status === 404) {
        return [];
      }
      throw new Error(`서버 오류: ${res.status}`);
    }

    return res.json();
  }, [user?.userId]);

  // ✅ refreshCards 함수 최적화 (중첩 레벨 감소)
  const refreshCards = useCallback(async (): Promise<void> => {
    if (!user?.userId || authLoading) return;

    try {
      setIsLoading(true);
      console.log('🔄 신청서 목록 새로고침 시작...');
      
      const applications = await fetchCardsFromServer();
      console.log(`📋 신청서 ${applications.length}개 로드됨`);

      setSubmittedCards(prevCards => {
        const cards: SubmittedCard[] = applications.map((app: any) => {
          const existingCard = prevCards.find(c => c.id === app.id.toString());
          return transformApplicationToCard(app, existingCard);
        });

        console.log('✅ 신청서 목록 로드 완료');
        return cards;
      });
    } catch (err) {
      console.error('❌ 신청서 목록 로드 실패:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.userId, authLoading, fetchCardsFromServer]);

  // ✅ user 변경 시 자동 로드
  useEffect(() => {
    if (!authLoading && user) {
      console.log('👤 사용자 변경 감지, 신청서 로드 시작');
      refreshCards().catch(console.error); // ✅ Promise 반환값 처리
    }
  }, [user, authLoading, refreshCards]);

  const addSubmittedCard = useCallback(async (card: Omit<SubmittedCard, 'id'>): Promise<void> => {
    if (!user?.userId) throw new Error('로그인이 필요합니다');
    
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:8080/api/submit-card', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          userId: user.userId,
          userName: user.userName,
          formDataSnapshot: card.formDataSnapshot,
          title: card.title,
          desc: card.desc,
          status: card.status,
          date: card.date,
        }),
      });

      if (!response.ok) throw new Error('서버 저장 실패');
      
      console.log('✅ 서버 저장 성공');
      await refreshCards();
      
    } catch (err) {
      console.error('❌ 신청서 저장 실패:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [user?.userId, user?.userName, refreshCards]);

  const toggleStarred = useCallback((id: string) => {
    setSubmittedCards(prev =>
      prev.map(card =>
        card.id === id ? { ...card, starred: !card.starred } : card
      )
    );
  }, []);

  const updateCardStatus = useCallback((id: string, newStatus: StatusType, note?: string) => {
    const userId = user?.userId ?? 'unknown';
    setSubmittedCards(prev =>
      prev.map(card => {
        if (card.id !== id) return card;
        const newHistory = {
          by: userId,
          timestamp: new Date().toISOString(),
          note: note ?? `상태를 '${newStatus}'로 변경함`,
        };
        return {
          ...card,
          status: newStatus,
          historyList: [...(card.historyList ?? []), newHistory],
        };
      })
    );
  }, [user?.userId]);

  const updateCardContent = useCallback(async (id: string, newTitle: string, newDesc: string): Promise<void> => {
    try {
      setIsLoading(true);

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

      if (!response.ok) {
        throw new Error('서버 수정 실패');
      }

      setSubmittedCards(prev =>
        prev.map(card =>
          card.id === id ? { ...card, title: newTitle, desc: newDesc } : card
        )
      );

      console.log(`✅ 요청사항 업데이트 완료 (id: ${id})`);
    } catch (err) {
      console.error('❌ 요청사항 수정 실패:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const attachGrafanaDashboards = useCallback((id: string, dashboards: GrafanaDashboard[]) => {
    setSubmittedCards(prev =>
      prev.map(card =>
        card.id === id ? { ...card, grafanaDashboards: dashboards } : card
      )
    );
  }, []);

  const deleteCard = useCallback((id: string, note?: string) => {
    const userId = user?.userId ?? 'unknown';
    setSubmittedCards(prev =>
      prev.map(card => {
        if (card.id !== id) return card;
        const history = {
          by: userId,
          timestamp: new Date().toISOString(),
          note: note ?? '카드가 삭제되었습니다.',
        };
        return {
          ...card,
          status: '삭제됨' as StatusType,
          historyList: [...(card.historyList ?? []), history],
        };
      })
    );
  }, [user?.userId]);

  // ✅ Context 값을 useMemo로 메모이제이션하여 불필요한 리렌더링 방지
  const contextValue = useMemo(() => ({
    submittedCards,
    addSubmittedCard,
    toggleStarred,
    updateCardStatus,
    attachGrafanaDashboards,
    updateCardContent,
    deleteCard,
    refreshCards,
    isLoading,
  }), [
    submittedCards,
    addSubmittedCard,
    toggleStarred,
    updateCardStatus,
    attachGrafanaDashboards,
    updateCardContent,
    deleteCard,
    refreshCards,
    isLoading,
  ]);

  return (
    <SubmittedContext.Provider value={contextValue}>
      {children}
    </SubmittedContext.Provider>
  );
};

export const useSubmitted = (): SubmittedContextType => {
  const context = useContext(SubmittedContext);
  if (!context) {
    throw new Error('useSubmitted must be used within a SubmittedProvider');
  }
  return context;
};
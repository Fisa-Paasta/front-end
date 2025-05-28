import React, { createContext, useContext, useState, useEffect } from 'react';
import { StatusType } from '@/types/admin';
import { FormDataType } from '@/types/survey';

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
  formDataSnapshot: FormDataType & { userId?: string };
  grafanaDashboards?: GrafanaDashboard[];
  historyList?: {
    by?: string;
    timestamp?: string;
    note?: string;
  }[];
}

interface SubmittedContextType {
  submittedCards: SubmittedCard[];
  addSubmittedCard: (card: Omit<SubmittedCard, 'id'>) => Promise<void>; // ✅ Promise 반환
  toggleStarred: (id: string) => void;
  updateCardStatus: (id: string, newStatus: StatusType, note?: string) => void;
  attachGrafanaDashboards: (id: string, dashboards: GrafanaDashboard[]) => void;
  updateCardContent: (id: string, newTitle: string, newDesc: string) => void;
  deleteCard: (id: string, note?: string) => void;
  refreshCards: () => Promise<void>; // ✅ 새로 추가
}

const SubmittedContext = createContext<SubmittedContextType | undefined>(undefined);

export const SubmittedProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [submittedCards, setSubmittedCards] = useState<SubmittedCard[]>([]);

  // ✅ 서버에서 카드 목록 불러오기
  const refreshCards = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) return;

      const res = await fetch(`http://localhost:8080/api/applications/employee/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (!res.ok) throw new Error('신청서 목록 가져오기 실패');
      
      const applications = await res.json();
      
      // ApplicationResponse를 SubmittedCard로 변환
      const cards: SubmittedCard[] = applications.map((app: any) => ({
        id: app.id.toString(),
        title: app.title,
        desc: app.description || '—',
        date: new Date(app.createdAt).toISOString().split('T')[0],
        status: convertStatusToKorean(app.status),
        starred: false,
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
          userId,
        },
        historyList: [],
      }));
      
      setSubmittedCards(cards);
    } catch (err) {
      console.error('❌ 신청서 목록 로드 실패:', err);
    }
  };

  // ✅ 초기 로드
  useEffect(() => {
    refreshCards();
  }, []);

  // ✅ 중복 제거: 서버 저장만 수행
  const addSubmittedCard = async (card: Omit<SubmittedCard, 'id'>) => {
    const userId = localStorage.getItem('userId') || 'unknown';
    
    try {
      const response = await fetch('http://localhost:8080/api/submit-card', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          userId,
          userName: localStorage.getItem('userName'),
          formDataSnapshot: card.formDataSnapshot,
          title: card.title,
          desc: card.desc,
          status: card.status,
          date: card.date,
        }),
      });

      if (!response.ok) throw new Error('서버 저장 실패');
      
      console.log('✅ 서버 저장 성공');
      
      // ✅ 서버 저장 후 목록 새로고침
      await refreshCards();
      
    } catch (err) {
      console.error('❌ 신청서 저장 실패:', err);
      throw err; // FormStep에서 에러 처리
    }
  };

  const toggleStarred = (id: string) => {
    setSubmittedCards(prev =>
      prev.map(card =>
        card.id === id ? { ...card, starred: !card.starred } : card
      )
    );
  };

  const updateCardStatus = (id: string, newStatus: StatusType, note?: string) => {
    const userId = localStorage.getItem('userId') || 'unknown';
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
          historyList: [...(card.historyList || []), newHistory],
        };
      })
    );
  };

  const updateCardContent = (id: string, newTitle: string, newDesc: string) => {
    setSubmittedCards(prev =>
      prev.map(card =>
        card.id === id ? { ...card, title: newTitle, desc: newDesc } : card
      )
    );
  };

  const attachGrafanaDashboards = (id: string, dashboards: GrafanaDashboard[]) => {
    setSubmittedCards(prev =>
      prev.map(card =>
        card.id === id ? { ...card, grafanaDashboards: dashboards } : card
      )
    );
  };

  const deleteCard = (id: string, note?: string) => {
    const userId = localStorage.getItem('userId') || 'unknown';
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
          historyList: [...(card.historyList || []), history],
        };
      })
    );
  };

  return (
    <SubmittedContext.Provider
      value={{
        submittedCards,
        addSubmittedCard,
        toggleStarred,
        updateCardStatus,
        attachGrafanaDashboards,
        updateCardContent,
        deleteCard,
        refreshCards,
      }}
    >
      {children}
    </SubmittedContext.Provider>
  );
};

// ✅ 상태 변환 헬퍼
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

export const useSubmitted = (): SubmittedContextType => {
  const context = useContext(SubmittedContext);
  if (!context) {
    throw new Error('useSubmitted must be used within a SubmittedProvider');
  }
  return context;
};
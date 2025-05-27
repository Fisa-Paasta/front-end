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
  addSubmittedCard: (card: Omit<SubmittedCard, 'id'>) => void;
  toggleStarred: (id: string) => void;
  updateCardStatus: (id: string, newStatus: StatusType, note?: string) => void;
  attachGrafanaDashboards: (id: string, dashboards: GrafanaDashboard[]) => void;
  updateCardContent: (id: string, newTitle: string, newDesc: string) => void;
  deleteCard: (id: string, note?: string) => void;
}

const SubmittedContext = createContext<SubmittedContextType | undefined>(undefined);

export const SubmittedProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [submittedCards, setSubmittedCards] = useState<SubmittedCard[]>([]);

  // ✅ 서버에서 초기 카드 목록 불러오기
  useEffect(() => {
    const fetchSubmittedCardsFromServer = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/submitted-cards', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (!res.ok) throw new Error('카드 목록 가져오기 실패');
        const data = await res.json();
        setSubmittedCards(data);
      } catch (err) {
        console.error('❌ 서버 카드 목록 오류:', err);
      }
    };

    fetchSubmittedCardsFromServer();
  }, []);

  const addSubmittedCard = (card: Omit<SubmittedCard, 'id'>) => {
    const userId = localStorage.getItem('userId') || 'unknown';
    const newCard: SubmittedCard = {
      ...card,
      id: crypto.randomUUID(),
      formDataSnapshot: {
        ...card.formDataSnapshot,
        userId,
      },
    };

    setSubmittedCards(prev => [...prev, newCard]);

    // ✅ 서버로 저장
    fetch('http://localhost:8080/api/submit-card', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        userId,
        userName: localStorage.getItem('userName'),
        formDataSnapshot: newCard.formDataSnapshot,
        title: newCard.title,
        desc: newCard.desc,
        status: newCard.status,
        date: newCard.date,
      }),
    }).catch((err) => {
      console.error('❌ 서버 저장 실패:', err);
    });
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
      }}
    >
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

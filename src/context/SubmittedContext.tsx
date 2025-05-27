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
  formDataSnapshot: FormDataType;
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
}

const SubmittedContext = createContext<SubmittedContextType | undefined>(undefined);

export const SubmittedProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [submittedCards, setSubmittedCards] = useState<SubmittedCard[]>(() => {
    try {
      const saved = localStorage.getItem('submittedCards');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const syncToLocalStorage = (updated: SubmittedCard[]) => {
    const prev = JSON.stringify(submittedCards);
    const next = JSON.stringify(updated);
    if (prev !== next) {
      localStorage.setItem('submittedCards', next);
      setSubmittedCards(updated);
    }
  };

  const updateCardContent = (id: string, newTitle: string, newDesc: string) => {
    const updated = submittedCards.map(card =>
      card.id === id ? { ...card, title: newTitle, desc: newDesc } : card
    );
    syncToLocalStorage(updated);
  };

  const addSubmittedCard = (card: Omit<SubmittedCard, 'id'>) => {
    const newCard: SubmittedCard = {
      ...card,
      id: crypto.randomUUID(),
      formDataSnapshot: card.formDataSnapshot,
    };
    syncToLocalStorage([...submittedCards, newCard]);
  };

  const toggleStarred = (id: string) => {
    const updated = submittedCards.map(card =>
      card.id === id ? { ...card, starred: !card.starred } : card
    );
    syncToLocalStorage(updated);
  };

  const updateCardStatus = (id: string, newStatus: StatusType, note?: string) => {
    const userId = localStorage.getItem('userId') || 'unknown';
    const updated = submittedCards.map(card => {
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
    });
    syncToLocalStorage(updated);
  };

  const attachGrafanaDashboards = (id: string, dashboards: GrafanaDashboard[]) => {
    const updated = submittedCards.map(card =>
      card.id === id ? { ...card, grafanaDashboards: dashboards } : card
    );
    syncToLocalStorage(updated);
  };

  useEffect(() => {
    console.log('[📦 submittedCards 변경됨]', submittedCards);
  }, [submittedCards]);

  return (
    <SubmittedContext.Provider
      value={{
        submittedCards,
        addSubmittedCard,
        toggleStarred,
        updateCardStatus,
        attachGrafanaDashboards,
        updateCardContent,
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

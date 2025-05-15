// src/context/SubmittedContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface SubmittedCard {
  id: string;
  title: string;
  desc: string;
  date: string;
  status: string;
  starred: boolean;
  historyList?: {
    by?: string;
    timestamp?: string;
    note?: string;
  }[];
}

interface SubmittedContextType {
  submittedCards: SubmittedCard[];
  addSubmittedCard: (card: SubmittedCard) => void;
}

const SubmittedContext = createContext<SubmittedContextType | undefined>(undefined);

export const SubmittedProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [submittedCards, setSubmittedCards] = useState<SubmittedCard[]>(() => {
    // ✅ 초기화 시 localStorage에서 불러옴
    const saved = localStorage.getItem('submittedCards');
    return saved ? JSON.parse(saved) : [];
  });

  // ✅ 추가할 때 localStorage에도 반영
  const addSubmittedCard = (card: SubmittedCard) => {
    setSubmittedCards(prev => {
      const updated = [...prev, card];
      localStorage.setItem('submittedCards', JSON.stringify(updated));
      return updated;
    });
    console.log('[SubmittedProvider] ✅ New card added:', card);
  };

  useEffect(() => {
    console.log('[SubmittedProvider] 📦 submittedCards 상태 변경됨:', submittedCards);
  }, [submittedCards]);

  return (
    <SubmittedContext.Provider value={{ submittedCards, addSubmittedCard }}>
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

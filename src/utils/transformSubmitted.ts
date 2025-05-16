import { SubmittedCard } from '@/context/SubmittedContext';
import { AdminCardData, StatusType } from '@/types/admin';

const isValidStatus = (status: string): status is StatusType => {
  return ['접수중', '접수완료', '승인처리중', '승인완료', '구축중', '구축완료'].includes(status);
};

export const transformSubmittedCards = (submittedCards: SubmittedCard[]): AdminCardData[] => {
  return submittedCards.map((card, index) => ({
    id: Number.isNaN(Number(card.id)) ? index : Number(card.id), // number 변환 안전하게 처리
    title: card.title,
    desc: card.desc,
    date: card.date,
    status: isValidStatus(card.status) ? card.status : '접수중',
    starred: card.starred,
    userId: 'unknown', // SubmittedCard에 없음
    historyList: (card.historyList || []).map((log) => ({
      status: isValidStatus(card.status) ? card.status : '접수중', // fallback
      timestamp: log.timestamp ?? new Date().toISOString(),
      approver: log.by ?? 'unknown',
      comment: log.note ?? ''
    }))
  }));
};

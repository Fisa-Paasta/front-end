import { SubmittedCard } from '@/context/SubmittedContext';
import { AdminCardData, StatusType } from '@/types/admin';

const isValidStatus = (status: string): status is StatusType => {
  return ['접수중', '접수완료', '승인처리중', '승인완료', '구축중', '구축완료'].includes(status);
};

export const transformSubmittedCards = (submittedCards: SubmittedCard[]): AdminCardData[] => {
  return submittedCards.map((card) => ({
    id: card.id, // ✅ 더 이상 숫자 변환 없음
    title: card.title,
    desc: card.desc,
    date: card.date,
    status: isValidStatus(card.status) ? card.status : '접수중',
    starred: card.starred,
    userId: 'unknown', // 나중에 필요 시 실제 사용자 ID 할당
    historyList: (card.historyList || []).map((log) => ({
      status: isValidStatus(card.status) ? card.status : '접수중',
      timestamp: log.timestamp ?? new Date().toISOString(),
      approver: log.by ?? 'unknown',
      comment: log.note ?? ''
    }))
  }));
};

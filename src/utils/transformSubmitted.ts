import { SubmittedCard } from '@/context/SubmittedContext';
import { AdminCardData, StatusType } from '@/types/admin';

// 상태 값 유효성 체크
const isValidStatus = (status: string): status is StatusType => {
  return ['접수중', '접수완료', '승인처리중', '승인완료', '구축중', '구축완료'].includes(status);
};

// SubmittedCard → AdminCardData 변환 함수
export const transformSubmittedCards = (submittedCards: SubmittedCard[]): AdminCardData[] => {
  return submittedCards.map((card) => ({
    id: card.id, // ✅ UUID 기반 string 그대로 사용
    title: card.title,
    desc: card.desc,
    date: card.date,
    status: isValidStatus(card.status) ? card.status : '접수중',
    starred: card.starred,
    userId: 'unknown', // 향후 로그인 유저 ID로 대체 가능
    historyList: (card.historyList || []).map((log) => ({
      status: isValidStatus(card.status) ? card.status : '접수중',
      timestamp: log.timestamp ?? new Date().toISOString(),
      approver: log.by ?? 'unknown',
      comment: log.note ?? ''
    }))
  }));
};

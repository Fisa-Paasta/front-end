import { SubmittedCard } from '@/context/SubmittedContext';
import { AdminCardData, StatusType, STATUS_ENUM } from '@/types/admin';

// ✅ 유효한 상태인지 체크
const isValidStatus = (status: string): status is StatusType => {
  return (Object.values(STATUS_ENUM) as string[]).includes(status);
};

export const transformSubmittedCards = (submittedCards: SubmittedCard[]): AdminCardData[] => {
  return submittedCards.map((card) => {
    // ✅ formDataSnapshot 안에 userId가 없을 경우 대비
    const userId = card.formDataSnapshot?.userId ?? localStorage.getItem('userId') ?? 'unknown';

    return {
      id: card.id,
      title: card.title,
      desc: card.desc,
      date: card.date,
      status: isValidStatus(card.status) ? card.status : '접수중',
      starred: card.starred,
      userId,
      formDataSnapshot: card.formDataSnapshot,
      historyList: (card.historyList || []).map((log) => ({
        status: isValidStatus(card.status) ? card.status : '접수중',
        timestamp: log.timestamp ?? new Date().toISOString(),
        approver: log.by ?? 'unknown',
        comment: log.note ?? '',
      })),
    };
  });
};

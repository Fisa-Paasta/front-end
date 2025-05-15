export interface AdminCardData {
  id: number;
  title: string;
  desc: string;
  userId: string;  // ✅ 사용자 사번 추가
  date: string;
  status: '접수중' | '접수완료' | '승인처리중' | '승인완료' | '구축중' | '구축완료';
  starred?: boolean;
  historyList?: {
    approver?: string;
    timestamp: string;
    status: string;
    comment?: string;
  }[];
}

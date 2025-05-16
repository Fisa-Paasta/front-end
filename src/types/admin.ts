// src/types/admin.ts

// 🔄 상태 상수 정의 및 타입 자동 추론
export const STATUS_ENUM = {
  접수중: '접수중',
  접수완료: '접수완료',
  승인처리중: '승인처리중',
  승인완료: '승인완료',
  구축중: '구축중',
  구축완료: '구축완료',
} as const;

// 🔐 STATUS_ENUM의 키 값만을 사용하는 타입 정의
export type StatusType = keyof typeof STATUS_ENUM;

// 📦 카드 데이터 구조
export interface AdminCardData {
  id: number;
  title: string;
  desc: string;
  userId: string; // 신청자 사번
  date: string;   // 신청 날짜
  status: StatusType; // 현재 상태 (enum 기반)
  starred?: boolean; // 즐겨찾기 여부 (선택사항)
  historyList?: {
    approver?: string;     // 상태 변경 관리자 ID
    timestamp: string;     // 변경 시간
    status: StatusType;    // 변경된 상태
    comment?: string;      // 변경 사유
  }[];
}
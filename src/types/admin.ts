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
  id: string; // ✅ UUID 기반 string
  title: string;
  desc: string;
  date: string;
  status: StatusType;
  starred: boolean;
  userId: string; // 🔧 로그인 사용자 ID (현재는 'unknown' placeholder)
  historyList: {
    status: StatusType;
    timestamp: string;
    approver: string;
    comment: string;
  }[];
}

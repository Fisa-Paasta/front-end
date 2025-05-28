// src/types/admin.ts
import { SubmittedCard } from '@/context/SubmittedContext';

export const STATUS_ENUM = {
  접수중: '접수중',
  접수완료: '접수완료',
  승인처리중: '승인처리중',
  승인완료: '승인완료',
  구축중: '구축중',
  구축완료: '구축완료',
  삭제됨: '삭제됨',
} as const;

export type StatusType = keyof typeof STATUS_ENUM;

// ✅ 핵심: SubmittedCard를 그대로 재사용
export type AdminCardData = SubmittedCard;

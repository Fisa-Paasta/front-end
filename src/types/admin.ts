// src/types/admin.ts

import { FormDataType } from '@/types/survey'; // ✅ 반드시 추가

export const STATUS_ENUM = {
  접수중: '접수중',
  접수완료: '접수완료',
  승인처리중: '승인처리중',
  승인완료: '승인완료',
  구축중: '구축중',
  구축완료: '구축완료',
} as const;

export type StatusType = keyof typeof STATUS_ENUM;

export interface AdminCardData {
  id: string;
  title: string;
  desc: string;
  date: string;
  status: StatusType;
  starred: boolean;
  userId: string;
  formDataSnapshot: FormDataType;  // ✅ 추가된 부분
  grafanaDashboards?: {
    id: string;
    title: string;
    description: string;
    panels: number;
    refresh: string;
    url: string;
  }[];
  historyList: {
    status: StatusType;
    timestamp: string;
    approver: string;
    comment: string;
  }[];
}

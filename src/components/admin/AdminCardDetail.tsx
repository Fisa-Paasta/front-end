import React, { useEffect, useState } from 'react';
import { AdminCardData, StatusType } from '../../types/admin';

interface AdminCardDetailProps {
  item: AdminCardData;
  onClose: () => void;
  onStatusChange: (id: string, newStatus: StatusType) => void;
}

const STATUS_OPTIONS: StatusType[] = [
  '접수중',
  '접수완료',
  '승인처리중',
  '승인완료',
  '구축중',
  '구축완료',
  '삭제됨',
];

const STATUS_COLORS: Record<StatusType, string> = {
  접수중: 'bg-yellow-500 text-black',
  접수완료: 'bg-green-600 text-white',
  승인처리중: 'bg-blue-500 text-white',
  승인완료: 'bg-blue-700 text-white',
  구축중: 'bg-purple-500 text-white',
  구축완료: 'bg-gray-500 text-white',
  삭제됨: 'bg-red-500 text-white',
};

export default function AdminCardDetail({
  item,
  onClose,
  onStatusChange
}: AdminCardDetailProps) {
  const [status, setStatus] = useState<StatusType>(item.status);

  useEffect(() => {
    setStatus(item.status);
  }, [item.status]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as StatusType;
    setStatus(newStatus);
    onStatusChange(item.id, newStatus);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!item) return null;

  return (
    <dialog 
      open
      className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center" 
      onKeyDown={handleKeyDown}
      aria-labelledby="card-detail-title"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-panel-light dark:bg-panel-dark rounded-2xl p-6 w-full max-w-lg shadow-2xl text-foreground-light dark:text-foreground-dark"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-4 -right-4 z-10 bg-white dark:bg-panel-dark text-gray-500 hover:text-gray-800 dark:hover:text-white rounded-full shadow-md w-9 h-9 flex items-center justify-center text-xl focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="모달 닫기"
        >
          ✕
        </button>

        <h2 id="card-detail-title" className="text-xl font-bold mb-4">📋 요청 상세</h2>
        
        <div className="space-y-3 mb-6">
          <div><span className="font-semibold">제목:</span> {item.title}</div>
          <div><span className="font-semibold">요청사항:</span> {item.desc}</div>
          <div><span className="font-semibold">날짜:</span> {item.date}</div>
        </div>

        <div className="w-full mb-4">
          <label htmlFor="status-select" className="block font-semibold mb-1 text-left">
            상태 변경
          </label>
          <select
            id="status-select"
            className="w-full px-4 py-2 rounded-md bg-[#2c323d] text-white border border-gray-500 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm appearance-none"
            value={status}
            onChange={handleChange}
            aria-label="상태 변경 선택"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <output className={`mt-4 px-4 py-2 rounded-lg ${STATUS_COLORS[status]} block`}>
          현재 상태: {status}
        </output>

        {item.historyList && item.historyList.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold mb-2">📜 상태 변경 이력</h3>
            <ul className="text-sm space-y-1">
              {item.historyList.map((entry, idx) => (
                <li key={`history-${item.id}-${entry.timestamp ?? Date.now()}-${idx}`} className="text-gray-500 dark:text-gray-400">
                  <time dateTime={entry.timestamp}>{entry.timestamp}</time> - {entry.by ?? '시스템'}
                  {entry.note && (
                    <span className="text-xs text-gray-400 ml-2">({entry.note})</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </dialog>
  );
}
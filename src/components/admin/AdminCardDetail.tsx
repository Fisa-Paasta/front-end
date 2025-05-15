// src/components/admin/AdminCardDetail.tsx
import React from 'react';
import { AdminCardData } from '../../types/admin';

interface AdminCardDetailProps {
  item: AdminCardData;
  onClose: () => void;
  onStatusChange: (id: number, newStatus: string) => void;
}

const STATUS_OPTIONS = [
  '접수중',
  '접수완료',
  '승인처리중',
  '승인완료',
  '구축중',
  '구축완료'
];

const STATUS_COLORS: Record<string, string> = {
  '접수중': 'bg-yellow-500 text-black',
  '접수완료': 'bg-green-600 text-white',
  '승인처리중': 'bg-blue-500 text-white',
  '승인완료': 'bg-blue-700 text-white',
  '구축중': 'bg-purple-500 text-white',
  '구축완료': 'bg-gray-500 text-white'
};

export default function AdminCardDetail({ item, onClose, onStatusChange }: AdminCardDetailProps) {
  if (!item) return null;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onStatusChange(item.id, e.target.value);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-panel-light dark:bg-panel-dark rounded-2xl p-6 w-full max-w-lg shadow-2xl text-foreground-light dark:text-foreground-dark"
      >
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 z-10 bg-white dark:bg-panel-dark text-gray-500 hover:text-gray-800 dark:hover:text-white rounded-full shadow-md w-9 h-9 flex items-center justify-center text-xl"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-4">📋 요청 상세</h2>
        <p><strong>제목:</strong> {item.title}</p>
        <p><strong>설명:</strong> {item.desc}</p>
        <p><strong>날짜:</strong> {item.date}</p>

        <div className="mt-4">
          <label htmlFor="status" className="block font-semibold mb-1">상태 변경</label>
          <select
            id="status"
            className="formbold-form-input"
            value={item.status}
            onChange={handleChange}
          >
            {STATUS_OPTIONS.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        <div className={`mt-4 px-4 py-2 rounded-lg ${STATUS_COLORS[item.status]}`}>현재 상태: {item.status}</div>

        {item.historyList && item.historyList.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold mb-2">📜 상태 변경 이력</h3>
            <ul className="text-sm space-y-1">
              {item.historyList.map((entry, idx) => (
                <li key={idx} className="text-gray-500 dark:text-gray-400">
                  {entry.timestamp} - {entry.approver}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
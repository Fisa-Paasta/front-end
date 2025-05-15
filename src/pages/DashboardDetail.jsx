import React, { useState } from 'react';
import ConfirmModal from '../components/ConfirmModal';
import { useSubmitted } from '@/context/SubmittedContext';

export default function DashboardDetail({ item, onClose }) {
  const [showHistory, setShowHistory] = useState(false);
  const { submittedCards } = useSubmitted();

  if (!item) return null;

  const statusData = statusDetailMap(item.status, setShowHistory) || {
    icon: 'ℹ️',
    title: '알 수 없음',
    color: 'bg-white text-black',
    description: '상태 정보가 없습니다.',
    action: null,
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-panel-light dark:bg-panel-dark rounded-2xl p-6 w-full max-w-md shadow-2xl text-foreground-light dark:text-foreground-dark transition-colors duration-500"
      >
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 z-10 bg-white dark:bg-panel-dark text-gray-500 hover:text-gray-800 dark:hover:text-white rounded-full shadow-md w-9 h-9 flex items-center justify-center text-xl"
        >
          ✕
        </button>

        <div className={`${statusData.color} flex items-start gap-3 rounded-lg px-4 py-3 mb-6`}>
          <div className="text-2xl">{statusData.icon}</div>
          <div className="flex-1">
            <p className="text-base font-bold leading-tight">{statusData.title}</p>
            <p className="text-sm mt-1">{statusData.description}</p>
          </div>
        </div>

        <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
          <div><span className="text-foreground-light dark:text-white font-medium">📌 제목:</span> {item.title}</div>
          <div><span className="text-foreground-light dark:text-white font-medium">📝 설명:</span> {item.desc}</div>
          <div><span className="text-foreground-light dark:text-white font-medium">📅 날짜:</span> {item.date}</div>
          <div><span className="text-foreground-light dark:text-white font-medium">⭐ 즐겨찾기:</span> {item.starred ? '⭐️' : '—'}</div>
        </div>

        {statusData.action && (
          <div className="mt-6 border-t border-gray-700 pt-4">
            {statusData.action}
          </div>
        )}

        {showHistory && (
          <ConfirmModal
            title={item.title}
            historyList={item.historyList || []}
            onClose={() => setShowHistory(false)}
            onSubmit={() => setShowHistory(false)}
          />
        )}
      </div>
    </div>
  );
}

// 상태별 시각화 설정
const statusDetailMap = (status, setShowHistory) => {
  const base = {
    '접수중': {
      icon: '⏳',
      color: 'bg-yellow-500 text-black',
      title: '신청 접수 중',
      description: '현재 인프라 신청이 접수되어 대기 중입니다.',
      action: null,
    },
    '접수완료': {
      icon: '✅',
      color: 'bg-green-600 text-white',
      title: '접수 완료',
      description: '신청이 정상적으로 접수되었습니다.',
      action: null,
    },
    '승인처리중': {
      icon: '🔄',
      color: 'bg-blue-500 text-white',
      title: '승인 처리 중',
      description: '관리자가 요청을 검토 중입니다.',
      action: (
        <button
          className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 transition"
          onClick={() => setShowHistory(true)}
        >
          승인 이력 보기
        </button>
      ),
    },
    '승인완료': {
      icon: '✔️',
      color: 'bg-blue-700 text-white',
      title: '승인 완료',
      description: '승인이 완료되어 곧 구축이 시작됩니다.',
      action: <div className="text-sm text-gray-300">📝 환경 구성 파일 자동 생성 중</div>,
    },
    '구축중': {
      icon: '🛠️',
      color: 'bg-purple-500 text-white',
      title: '구축 중',
      description: '인프라 자동화 작업이 실행 중입니다.',
      action: (
        <progress className="w-full h-2" value={70} max={100}>
          70%
        </progress>
      ),
    },
    '구축완료': {
      icon: '🎉',
      color: 'bg-gray-500 text-white',
      title: '구축 완료',
      description: '서비스 배포가 완료되었습니다.',
      action: (
        <a
          href="http://your-dashboard-url"
          target="_blank"
          rel="noreferrer"
          className="text-blue-400 underline hover:text-blue-300 transition"
        >
          대시보드 접속
        </a>
      ),
    }
  };
  return base[status];
};
